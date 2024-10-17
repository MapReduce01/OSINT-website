from wikiCrawler import wikiCrawler
from subfinderAPI import subfinderAPI
import re

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

########## print test
for domain in domain_list:
    print(domain)
##########

