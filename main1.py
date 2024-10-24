from wikiCrawler import wikiCrawler
from subfinderAPI import subfinderAPI
from openai_utilities import openai_query
from gleifAPI import gleifAPI
from topDomains import topDomains
from openai_utilities import query_about_file
from gptAPI import gptAPI
from gNews import fetch_news
import re
import subprocess
import json
from censys.search import CensysHosts
import socket

user_input = input("Enter a name to search: ")
print("Searching... ", user_input)
target_website = wikiCrawler(user_input)
print("website found: " + target_website) 

des_query = "give me an overview of " + user_input
des_answer = gptAPI(des_query,"Description")
print(des_answer)

dep_query = "tell me all the departments in " + user_input + " and show me more details about these departments"
dep_answer = gptAPI(dep_query,"Department")

insight_query = query_about_file('Department.json', "tell me more details of each element mentioned in this file")
insight_answer = gptAPI(insight_query, "Insight")
print(insight_answer)


# run subfinder API to find all subdomains
pattern_www = r'www\.[a-zA-Z0-9\-\.]+'
matches_www = re.findall(pattern_www, target_website)
target_domain = matches_www[0].replace("www.","")
print("Finding subdomains... It might take a while"+"\n")
domain_list = subfinderAPI(target_domain)

### 1 ###
domain_list_filtered = topDomains(domain_list, target_domain, 20)
domain_list_filtered.append(target_domain)
print(domain_list_filtered)
### 1 ###

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



ip_json_list = []
########## use abusech and botvrij
for ip in ip_addresses_filtered:
    malicious_check = False
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_abusech", "-s", ip, "-o","json","-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "["+result.stdout[:-3] + "]"
    ip_json = json.loads(output)
    for item in ip_json:
         if item.get("type") == "Malicious IP Address":
              malicious_check = True
    
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_botvrij", "-s", ip, "-o","json","-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "["+result.stdout[:-3] + "]"
    ip_json = json.loads(output)
    for item in ip_json:
         if item.get("type") == "Malicious IP Address":
              malicious_check = True


    if not malicious_check:
        for item in ip_json:
            ip_json_list.extend(ip_json) 

with open('ip_safe_list.json', 'w') as json_file_ip:
    json.dump(ip_json_list, json_file_ip, indent=4)

#######################   use hunter #########################
email_json_list = []
for domain in domain_list_filtered:
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_hunter", "-s", domain, "-o","json","-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "["+result.stdout[:-3] + "]"
    email_json = json.loads(output)
    email_json_list.extend(email_json) 

with open('email.json', 'w') as json_file_email:
    json.dump(email_json_list, json_file_email, indent=4)


#######################   use censys #########################
# censys_json_list = []
# for domain in domain_list_filtered:
#     command = ["python", "./OSINT-website/spiderfoot/sf.py", "-m", "sfp_censys", "-s", domain, "-o","json","-q"]
#     result = subprocess.run(command, capture_output=True, text=True)
#     output = "["+result.stdout[:-3] + "]"
#     censys_json = json.loads(output)
#     censys_json_list.extend(censys_json) 

# with open('censys.json', 'w') as json_file_censys:
#     json.dump(censys_json_list, json_file_censys, indent=4)


API_ID = "f8013bed-c783-4320-97be-e0d390cbea7d"
API_SECRET = "6djq5lM85rMUneVhOp4SBFGnd46Laa4T"

censys_hosts = CensysHosts(api_id=API_ID, api_secret=API_SECRET)
query = "Simon Fraser University"
censys_results = censys_hosts.search(query)


# with open('censys.json', 'w') as json_file_censys:
#     json.dump(censys_results, json_file_censys, indent=4)
censys_str = ""
for result in censys_results:
    print(result)
    censys_str= censys_str+str(result)

with open("censys.txt", "w") as text_file:
    text_file.write(censys_str)

#######################   use account #########################

command = ["python", "./spiderfoot/sf.py", "-m", "sfp_accounts", "-s", user_input, "-o","json","-q"]
result = subprocess.run(command, capture_output=True, text=True)
output = "["+result.stdout[:-3] + "]"
account_json = json.loads(output)

with open('account.json', 'w') as json_file_account:
    json.dump(account_json, json_file_account, indent=4)

#######################   use github #########################
github_json_list = []
for domain in domain_list_filtered:
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_github", "-s", domain, "-o","json","-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "["+result.stdout[:-3] + "]"
    github_json = json.loads(output)
    github_json_list.extend(github_json) 

with open('github.json', 'w') as json_file_github:
    json.dump(github_json_list, json_file_github, indent=4)

#######################   use gNews #########################
# apikey = "92fb531ccd5040d9677d73c64d78bc69"
# news_data = fetch_news(apikey, "sfu")

# news_json_list = []
# query = "Try to extract information from the following news:"+news_data+", such as names, emails, phone numbers, etc., and summarize each news item in one sentence. Return it in JSON format."
# try:
#     news_json = json.loads(openai_query(query))
#     with open('news.json', 'w') as json_file_news:
#         json.dump(news_json_list, json_file_news, indent=4)
# except json.JSONDecodeError as e:
#     print(f"JSONDecodeError: {e}, Because the ChatGPT do not return the JSON format")


#################### use gleif #################################
lei_info = gleifAPI(user_input)
with open('gleif.json', 'w') as json_file_gleif:
    json.dump(lei_info, json_file_gleif, indent=4)



############################          LLM   to summarize all output json         ######################

query = "summarize these infomation in detail and return the summary with json format:"+json.dumps(domain_list_filtered)+json.dumps(ip_json_list)+json.dumps(email_json_list)+censys_str+json.dumps(account_json)+json.dumps(github_json_list)+json.dumps(lei_info)
summary  = openai_query(query)
with open("Summary.txt", "w") as text_file:
    text_file.write(summary)
