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
from logPrint import logprint
from censys.search import CensysHosts
import socket
from ipSafeCheck import *
from emailFinder import *
from github_finder import *
from Account import *
from gleif_extract import *
from censysFinder import *
import os

    
# get target website
def search_website(user_input):
    logprint("Searching... ", user_input)
    target_website = wikiCrawler(user_input)
    logprint("website found: " + target_website)
    return target_website

def find_domains(target_website):
    pattern_www = r'www\.[a-zA-Z0-9\-\.]+'
    matches_www = re.findall(pattern_www, target_website)
    target_domain = matches_www[0].replace("www.","")
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

# merge and return all results for multi-thread
def get_safe_Ip_merged(user_input):
    target_website = search_website(user_input)
    domain_list_filtered = find_domains(target_website)
    ip_addresses_filtered = get_Ip_address(domain_list_filtered)
    ip_safe_list = ip_safe_check(ip_addresses_filtered)
    return domain_list_filtered, ip_addresses_filtered, ip_safe_list

# merge txts together
def merge_txt_files():
    txt_files = ['Description.txt','Insight.txt','account.txt', 'email.txt','email_breaches.txt','ip_safe.txt', 'github.txt', 'censys_clear.txt', 'gleif.txt']
    output_file = 'Summary.txt'

    with open(output_file, 'w') as outfile:
        for txt_file in txt_files:
            try:
                outfile.write(f"===== {txt_file} =====\n")

                with open(txt_file, 'r') as infile:
                    outfile.write(infile.read())
                    outfile.write("\n\n")  
            
            except FileNotFoundError:
                logprint(f"File {txt_file} not found, skipping.")


# #######################   Start process   #########################
user_input = input("Enter a name to search: ")

des_query = "give me an overview of " + user_input
des_answer = gptAPI(des_query,"Description")
logprint(des_answer)

dep_query = "tell me all the departments in " + user_input + " and show me more details about these departments"
dep_answer = gptAPI(dep_query,"Department")

insight_query = query_about_file('Department.json', "tell me more details of each element mentioned in this file")
insight_answer = gptAPI(insight_query, "Insight")
logprint(insight_answer)

with ThreadPoolExecutor() as executor:
    future_account = executor.submit(account_finder, user_input)
    future_gleif = executor.submit(gleifAPI, user_input)
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
email_seeker("email.txt")
merge_txt_files()
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
