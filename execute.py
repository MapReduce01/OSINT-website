import time
from wikiCrawler import wikiCrawler
from subfinderAPI import subfinderAPI
from openai_utilities import openai_query
from gleifAPI import gleifAPI
from gNews import fetch_news
import re
import subprocess
import json
from censys.search import CensysHosts
import socket
from ipSafeCheck import *
from emailFinder import *


# get target website
def search_website(user_input):
    print("Searching... ", user_input)
    target_website = wikiCrawler(user_input)
    print("website found: " + target_website)
    return target_website

def find_domains(target_website):
    pattern_www = r'www\.[a-zA-Z0-9\-\.]+'
    matches_www = re.findall(pattern_www, target_website)
    target_domain = matches_www[0].replace("www.","")
    print("Finding subdomains... It might take a while"+"\n")
    domain_list = subfinderAPI(target_domain)

    query = "find top 20 subdomains which are most similar to "+target_domain+" in this list: " + str(domain_list) + ", don't add any comments, no numbers, just pure domains, seperated with comma."
    domain_list_filtered = openai_query(query).split(", ")
    domain_list_filtered.append(target_domain)
    print(domain_list_filtered)
    return domain_list_filtered

def get_Ip_address(domain_list_filtered):
    ip_addresses = []
    for x in domain_list_filtered:
        try:
            ip_address = socket.gethostbyname(x)
            ip_addresses.append(ip_address)
            print(f"{x} -> {ip_address}")
        except socket.gaierror:
            print(f"Failed to resolve {x}")

    ip_addresses_filtered = list(set(ip_addresses))
    print(ip_addresses_filtered)

# Example usage:
# user_input = input("Enter a name to search: ")
# target_website = search_website(user_input)
# domain_list_filtered = find_domains(target_website)
# domain_list_filtered = ['sfu.ca', 'www.sfu.ca', 'my.sfu.ca', 'secure.sfu.ca', 'students.sfu.ca', 'alumni.sfu.ca', 'its.sfu.ca', 'api.lib.sfu.ca', 'github.sfu.ca', 'research.wiki.iat.sfu.ca', 'tracs.sfu.ca', 'mailgw.alumni.sfu.ca', 'documents.lib.sfu.ca', 'sfuprint.mps.sfu.ca', 'canvas.its.sfu.ca', 'library.lib.sfu.ca', 'science.sfu.ca', 'archives.sfu.ca', 'public.research.sfu.ca', 'networking.sfu.ca', 'sfu.ca']
# ip_addresses_filtered = get_Ip_address(domain_list_filtered)
start_time = time.time()
ip_addresses_filtered = ['142.58.233.76', '142.58.142.154', '142.58.143.9', '142.58.103.137', '206.12.7.86', '142.58.233.147', '142.58.232.180', '142.58.143.42', '142.58.142.134']
# ip_addresses_filtered = ['142.58.233.76']
ip_safe_list = ip_safe_check(ip_addresses_filtered)
end_time = time.time()
elapsed_time = end_time - start_time
print(f"Time taken: {elapsed_time:.2f} seconds")
# ip_safe_list = ['142.58.233.76', '142.58.142.154', '142.58.143.9', '142.58.103.137', '206.12.7.86', '142.58.233.147', '142.58.232.180', '142.58.143.42', '142.58.142.134']
# email_list = email_finder(domain_list_filtered)
# print(email_list)