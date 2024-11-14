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
from gptAPI import gptAPI
from hibpAPI import email_seeker
import re
import subprocess
import json
from pathlib import Path
from logPrint import logprint
from censys.search import CensysHosts
import socket
from ipSafeCheck import *
from emailFinder import *
from github_finder import *
from Account import *
from censysFinder import *
import os
import requests


# get target website
def search_website(user_input):
    logprint("Searching... ", user_input)
    target_website = wikiCrawler(user_input)
    logprint("website found: " + target_website)
    return target_website

def find_domains(target_website):
    try:
        pattern_www = r'www\.[a-zA-Z0-9\-\.]+'
        matches_www = re.findall(pattern_www, target_website)
        target_domain = matches_www[0].replace("www.","")
    except:
        target_domain = target_website
    logprint("Finding subdomains... It might take a while"+"\n")
    domain_list = subfinderAPI(target_domain)

    domain_list_filtered = topDomains(domain_list, target_domain, 20)
    domain_list_filtered.append(target_domain)
    logprint(domain_list_filtered)
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

def combine_json_data(json_values, output_file_name=None):
    combined_data = []
    for json_value in json_values:
        combined_data.append(json_value)

    if output_file_name:
        with open(output_file_name, 'w') as output_file:
            json.dump(combined_data, output_file, indent=4)
    
    return combined_data

# merge and return all results for multi-thread
def get_safe_Ip_merged(user_input):
    target_website = search_website(user_input)
    domain_list_filtered = find_domains(target_website)
    ip_addresses_filtered = get_Ip_address(domain_list_filtered)
    ip_safe_list = ip_safe_check(ip_addresses_filtered)
    return domain_list_filtered, ip_addresses_filtered, ip_safe_list

# merge txts together
def merge_txt_files():
    description = Path(__file__).parent / "txt_temp" / "Description.txt"
    insight = Path(__file__).parent / "txt_temp" / "Insight.txt"
    account = Path(__file__).parent / "txt_temp" / "account.txt"
    email = Path(__file__).parent / "txt_temp" / "email.txt"
    email_breaches = Path(__file__).parent / "txt_temp" / "email_breaches.txt"
    ip_safe_list = Path(__file__).parent / "txt_temp" / "ip_safe_list.txt"
    github = Path(__file__).parent / "txt_temp" / "github.txt"
    censys_clear = Path(__file__).parent / "txt_temp" / "censys_clear.txt"
    # gleif = Path(__file__).parent / "txt_temp" / "gleif.txt"

    # txt_files = [str(description),str(insight),str(account),str(email),str(email_breaches),str(ip_safe_list),str(github),str(censys_clear),str(gleif)]
    # output_file = 'Summary.txt'

    # with open(output_file, 'w') as outfile:
    #     for txt_file in txt_files:
    #         try:
    #             outfile.write(f"===== {txt_file} =====\n")

    #             with open(txt_file, 'r') as infile:
    #                 outfile.write(infile.read())
    #                 outfile.write("\n\n")  
            
    #         except FileNotFoundError:
    #             logprint(f"File {txt_file} not found, skipping.")

def get_user_input():
    user_input = input("Enter a name to search: ")

    des_query = "give me an overview of " + user_input
    des_answer = gptAPI(des_query,"Description")
    logprint(des_answer)

    dep_query = "tell me all the departments in " + user_input + " and show me more details about these departments"
    dep_answer = gptAPI(dep_query,"Department")
    logprint(dep_answer)

    target_location = Path(__file__).parent / "json_temp" / "Department.json"
    insight_query = query_about_file(target_location, "tell me more details of each element mentioned in this file")
    insight_answer = gptAPI(insight_query, "Insight")
    logprint(insight_answer)

    return user_input, des_answer, insight_answer


# #######################   Start process   #########################

user_input, des_answer, insight_answer = get_user_input()

with ThreadPoolExecutor() as executor:
    # future_gleif = executor.submit(gleifAPI, user_input)

    future_account = executor.submit(account_finder, user_input)
    future_censys = executor.submit(censys_finder, user_input)
    future_Ip = executor.submit(get_safe_Ip_merged, user_input)
    domain_list_filtered, ip_addresses_filtered, ip_safe_list = future_Ip.result()

# #######################   API call   #########################
# start_time = time.time()
with ThreadPoolExecutor() as executor:
    # Schedule the execution of the functions
    # ip_addresses_filtered = ['142.58.233.76', '142.58.142.154', '142.58.143.9', '142.58.103.137', '206.12.7.86', '142.58.233.147', '142.58.232.180', '142.58.143.42', '142.58.142.134']
    # ip_safe_list = ['142.58.233.76', '142.58.142.154', '142.58.143.9', '142.58.103.137', '206.12.7.86', '142.58.233.147', '142.58.232.180', '142.58.143.42', '142.58.142.134']
    # domain_list_filtered = ['sfu.ca', 'www.sfu.ca', 'my.sfu.ca', 'secure.sfu.ca', 'students.sfu.ca', 'alumni.sfu.ca', 'its.sfu.ca', 'api.lib.sfu.ca', 'github.sfu.ca', 'research.wiki.iat.sfu.ca', 'tracs.sfu.ca', 'mailgw.alumni.sfu.ca', 'documents.lib.sfu.ca', 'sfuprint.mps.sfu.ca', 'canvas.its.sfu.ca', 'library.lib.sfu.ca', 'science.sfu.ca', 'archives.sfu.ca', 'public.research.sfu.ca', 'networking.sfu.ca', 'sfu.ca']

    future_email = executor.submit(email_finder, domain_list_filtered)
    future_github = executor.submit(github_finder, domain_list_filtered)

    # Collect results when complete
    # email_list = future_email.result()
    # github_list = future_github.result()

# target_location = Path(__file__).parent / "txt_temp" / "email.txt"   

hibp_result = email_seeker(future_email.result())
data_to_save = {"uni_id":user_input.upper().replace(" ",""),"org_name": user_input,"description": des_answer,"insight": insight_answer,"account": future_account.result(),"email": future_email.result(),"email_breaches": hibp_result,"ip": ip_safe_list,"github": future_github.result(),"censys": future_censys.result()}
logprint("==============================")
logprint(data_to_save)
response = requests.post("http://127.0.0.1:5000/addNewOrg", json=data_to_save)
logprint(response)


# all_json_data = [des_answer,insight_answer,future_account.result(),future_email.result(),hibp_result,future_Ip.result(),future_github.result(),future_censys.result()]
# combined_json = combine_json_data(all_json_data, output_file_name="Summary.json")

# merge_txt_files()

# end_time = time.time()
# elapsed_time = end_time - start_time
# print(f"Time taken: {elapsed_time:.2f} seconds")

# # #######################   Specific Test   #########################
# start_time = time.time()
# domain_list_filtered = ['sfu.ca', 'www.sfu.ca', 'my.sfu.ca', 'secure.sfu.ca', 'students.sfu.ca', 'alumni.sfu.ca', 'its.sfu.ca', 'api.lib.sfu.ca', 'github.sfu.ca', 'research.wiki.iat.sfu.ca', 'tracs.sfu.ca', 'mailgw.alumni.sfu.ca', 'documents.lib.sfu.ca', 'sfuprint.mps.sfu.ca', 'canvas.its.sfu.ca', 'library.lib.sfu.ca', 'science.sfu.ca', 'archives.sfu.ca', 'public.research.sfu.ca', 'networking.sfu.ca', 'sfu.ca']
# lei_info = gleifAPI("Simon Fraser University")
# gleif_extract("gleif.json")
# print(lei_info)

# end_time = time.time()
# elapsed_time = end_time - start_time
# print(f"Time taken: {elapsed_time:.2f} seconds")
# ip_addresses_filtered = ['142.58.233.76', '142.58.142.154', '142.58.143.9', '142.58.103.137', '206.12.7.86', '142.58.233.147', '142.58.232.180', '142.58.143.42', '142.58.142.134']
# ip_safe_list = ['142.58.233.76', '142.58.142.154', '142.58.143.9', '142.58.103.137', '206.12.7.86', '142.58.233.147', '142.58.232.180', '142.58.143.42', '142.58.142.134']
# domain_list_filtered = ['sfu.ca', 'www.sfu.ca', 'my.sfu.ca', 'secure.sfu.ca', 'students.sfu.ca', 'alumni.sfu.ca', 'its.sfu.ca', 'api.lib.sfu.ca', 'github.sfu.ca', 'research.wiki.iat.sfu.ca', 'tracs.sfu.ca', 'mailgw.alumni.sfu.ca', 'documents.lib.sfu.ca', 'sfuprint.mps.sfu.ca', 'canvas.its.sfu.ca', 'library.lib.sfu.ca', 'science.sfu.ca', 'archives.sfu.ca', 'public.research.sfu.ca', 'networking.sfu.ca', 'sfu.ca']
