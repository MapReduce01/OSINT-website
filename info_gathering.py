import sys
sys.path.append('Utilities')
import time
from wikiCrawler import wikiCrawler
from subfinderAPI import subfinderAPI
from openai_utilities import openai_query
from gleifAPI import gleifAPI
from gNews import fetch_news
from topDomains import topDomains
from openai_utilities import query_about_file
from gptAPI import *
from hibpAPI import email_seeker
import re
import subprocess
import json
from pathlib import Path
from logPrint import logprint
from censys.search import CensysHosts
import socket
from ipSafeCheck import *
from github_finder import *
from email_extract import *
from Account import *
from censysFinder import *
import os
import requests

# get target website

def clean_url(input_string):
    last_dot_index = input_string.rfind('.')
    
    if last_dot_index == -1:
        return input_string
    
    last_slash_index = input_string.find('/', last_dot_index)
    
    if last_slash_index == -1:
        return input_string
        
    return_str = input_string[:last_slash_index]+"/"
    return return_str
    
def search_website(user_input):
    logprint("Searching... ", user_input)
    target_website = wikiCrawler(user_input)
    target_website = clean_url(target_website)
    logprint("website found: " + target_website)
    return target_website

def find_domains(target_website):
    try:
        # pattern_www = r'http\.[a-zA-Z0-9\-\.]+'
        # matches_www = re.findall(pattern_www, target_website)
        target_domain = target_website[:-1].replace("https://","")
        target_domain = target_domain.replace("http://","")
        target_domain = target_domain.replace("www.","")
    except:
        target_domain = target_website
    logprint("Finding subdomains... It might take a while"+"\n")
    domain_list = subfinderAPI(target_domain)

    domain_list_filtered = topDomains(domain_list, target_domain, 100)
    domain_list_filtered.append(target_domain)
    #logprint(domain_list_filtered)
    return domain_list_filtered

def get_Ip_address(domain_list_filtered):
    ip_addresses = []
    for x in domain_list_filtered:
        try:
            ip_address = socket.gethostbyname(x)
            ip_addresses.append(ip_address)
            logprint(f"{x} -> {ip_address}")
        except socket.gaierror:
            logprint(f"Failed to resolve {x}")

    ip_addresses_filtered = list(set(ip_addresses))
    return ip_addresses_filtered


def get_safe_Ip_merged(user_input):
    target_website = search_website(user_input)
    domain_list_filtered = find_domains(target_website)
    ip_addresses_filtered = get_Ip_address(domain_list_filtered)
    ip_safe_list = ip_safe_check(ip_addresses_filtered)
    return domain_list_filtered, ip_addresses_filtered, ip_safe_list

def get_user_input(js_value):
    user_input = js_value

    des_query = "give me an overview of " + user_input + "  Only return me the answer, no more other words."
    des_answer = gptAPI(des_query,"Description")
    #logprint(des_answer)

    dep_query = "tell me all the departments in " + user_input + " and show me more details about these departments"
    dep_answer = gptAPI(dep_query,"Department")
    #logprint(dep_answer)

    #target_location = Path(__file__).parent / "json_temp" / "Department.json"
    #insight_query = query_about_file(target_location, "tell me more details of each element mentioned in this file")
    
    insight_query = "tell me more details of each element mentioned in the following: " + str(dep_answer) + "  Only return me the answer, no more other words."
    insight_answer = gptAPI(insight_query, "Insight")
    #logprint(insight_answer)

    return user_input, des_answer, insight_answer

try:

    if len(sys.argv) > 1:
        js_value = sys.argv[1] 
        js_value = js_value.replace("(company)","")
        logprint(f"Received value: {js_value}")
    else:
        logprint("No value received!")
        
    process_step = "step0"
    params = {
    "org_name": js_value
    }

    res = requests.get("http://0.0.0.0:5000/listOrgInfo", params)
    print(res)
    if "200" in str(res):
        logprint(f"Data already existed in DB. Aborted Inserting.")  
    else:
        logprint("LLM gathering detailed info...")
        wiki_name_query = "what is the company(or organization) "+js_value+"\'s name in wikipedia page? Only return me the name, no more other words."
        wiki_name = wiki_org_name(wiki_name_query)
        user_input, des_answer, insight_answer = get_user_input(js_value)
        logprint("LLM info searching done.")

        with ThreadPoolExecutor() as executor:
            # future_gleif = executor.submit(gleifAPI, user_input)
            future_account = executor.submit(account_finder, user_input)
            #future_censys = executor.submit(censys_finder, user_input)
            future_Ip = executor.submit(get_safe_Ip_merged, wiki_name)

        domain_list_filtered, ip_addresses_filtered, ip_safe_list = future_Ip.result()
        process_step = "step1"
        
        main_domain_list = [domain_list_filtered[-1]]
        print(main_domain_list)
        
        with ThreadPoolExecutor() as executor:
            future_email = executor.submit(new_email_finder, main_domain_list)
            future_github = executor.submit(github_finder, main_domain_list)
                
        #hibp_result = email_seeker(future_email.result())
        process_step = "step2"
        
        juni_id = js_value.upper().replace(" ","")
        jorg_name = js_value.title()
        try:
            jdes = des_answer
        except:
            jdes = []
        try:
            jins = insight_answer
        except:
            jins = []
        try:
            jacc = future_account.result()
        except:
            jacc = []
        try:
            jemail = future_email.result()
        except:
            jemail = []
        try:
            jebreach = hibp_result
        except:
            jebreach = []
        try:
            jip = ip_safe_list
        except:
            jip = []
        try:
            jgit = future_github.result()
        except:
            jgit = []
        try:
            jcen = future_censys.result()
        except:
            jcen = []

        data_to_save = {"uni_id":juni_id,"org_name": jorg_name,"description": jdes,"insight": jins,"account": jacc,"email": jemail,"email_breaches": jebreach,"ip": jip,"github": jgit,"censys": jcen}

        #data_to_save = {"uni_id":user_input.upper().replace(" ",""),"org_name": user_input.title(),"description": des_answer,"insight": insight_answer,"account": future_account.result(),"email_breaches": hibp_result,"ip": ip_safe_list,"github": future_github.result(),"censys": future_censys.result()}
        
        process_step = "step3"
        
        res2 = requests.get("http://0.0.0.0:5000/listOrgInfo", params)
        logprint("Start inserting into DB")
        if "200" in str(res2):
            logprint(f"Data already existed in DB. Aborted Inserting.") 
        else:
            response = requests.post("http://0.0.0.0:5000/addNewOrg", json=data_to_save)      
        process_step = "step4"
        logprint(user_input.title() + " done.")
        logprint("===================================================================================================")

except Exception as e:
    logprint(traceback.format_exc())
    logprint(js_value.title() + " " +  process_step + " Failed.")
    pass
