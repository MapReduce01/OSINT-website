from wikiCrawler import wikiCrawler
from subfinderAPI import subfinderAPI
from openai_utilities import openai_query
import re
import socket


user_input = input("Enter a name to search: ")
print("Searching... ", user_input)
target_website = wikiCrawler(user_input)
print("website found: " + target_website) # comment this out later

# run subfinder API to find all subdomains
pattern_www = r'www\.[a-zA-Z0-9\-\.]+'
matches_www = re.findall(pattern_www, target_website)
target_domain = matches_www[0].replace("www.","")
print("Finding subdomains... It might take a while"+"\n")
domain_list = subfinderAPI(target_domain)

query = "find top 20 most similar subdomains to "+target_domain+" in this list: " + str(domain_list) + ", don't add any comments, no numbers, just pure domains, seperated with comma."
filtered_list = openai_query(query).split(", ")

ip_addresses = []

for x in filtered_list:
    try:
        ip_address = socket.gethostbyname(x)
        ip_addresses.append(ip_address)
        print(f"{x} -> {ip_address}")
    except socket.gaierror:
        print(f"Failed to resolve {x}")

ip_addresses_filtered = list(set(ip_addresses))
print(ip_addresses_filtered)

