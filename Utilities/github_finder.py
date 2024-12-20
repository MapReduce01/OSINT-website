import subprocess
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from logPrint import logprint
from pathlib import Path
import re

def search_github(domain):
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_github", "-s", domain, "-o","json","-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = re.sub(r',\s*$', '', result.stdout.strip())
    #output = "[" + result.stdout[:-3] + "]"
    #print(type(output))
    #print(output)
    github_json = json.loads(output)
    return github_json

def github_finder(domain_list_filtered):
    github_json_list = []
    logprint("Starting GitHub search...")
    with ThreadPoolExecutor() as executor:
        future_to_domain = {executor.submit(search_github, domain): domain for domain in domain_list_filtered}

        for future in as_completed(future_to_domain):
            github_json = future.result()
            github_json_list.extend(github_json)

    github_json_list.extend(github_json)

    logprint("Github Searching Done")

    script_directory = Path(__file__).parent  
    #target_folder = script_directory.parent / "json_temp"  
    #file_path = target_folder / "github.json"

    #target_folder.mkdir(parents=True, exist_ok=True)

    result = []
    for entry in github_json_list:
        parts = entry["data"].split("\n")
        url = next((part.split(": ", 1)[1] for part in parts if part.startswith("URL:")), None)
        description = next((part.split(": ", 1)[1] for part in parts if part.startswith("Description:")), None)
        
        if url and description:
            result.append({"URL": url, "Description": description})

    #with open(str(file_path), 'w') as json_file_github:
        #json.dump(result, json_file_github)
    #logprint("The result has been saved to "+ 'github.json')
    return result

# def github_extract (file, mode = 0):
#     #if want to get the list of data from json, mode = 0
#     #if want to get txt data from json, mode = 1
#     input_file = file 
#     with open(input_file, 'r') as f:
#         json_data = json.load(f)

#     if mode == 0:
#     # Extract 'data' field values into a list
#         github_list = [entry['data'] for entry in json_data]
#         filter_string = 'github'
#         github_list = [items for items in github_list if filter_string in items]
#         return github_list

#     # Save the list to a txt file
#     if mode == 1:
#         github_list = [entry['data'] for entry in json_data]
#         filter_string = 'github'
#         github_list = [items for items in github_list if filter_string in items]

#         script_directory = Path(__file__).parent  
#         target_folder = script_directory.parent / "txt_temp"  
#         file_path = target_folder / "github.txt"

#         target_folder.mkdir(parents=True, exist_ok=True)

#         output_file = str(file_path)
#         with open(output_file, 'w') as f:
#             for github in github_list:
#                 f.write(f"{github}\n")
#         logprint(f"Related github saved to: {output_file}")
    
#     return None


#test pls comment out when use
#domain_list_filtered = ['sfu.ca', 'go.sfu.ca', 'my.sfu.ca', 'ad.sfu.ca', 'cs.sfu.ca', 'fs.sfu.ca', 'fhs.sfu.ca', 'cec.sfu.ca', 'ucs.sfu.ca', 'rcg.sfu.ca', 'cas.sfu.ca', 'www.sfu.ca', 'bms.sfu.ca', 'avs.sfu.ca', 'net.sfu.ca', 'mbb.sfu.ca', 'its.sfu.ca', 'cep.sfu.ca', 'pkp.sfu.ca', 'sis.sfu.ca', 'sfu.ca']
#github_finder(domain_list_filtered)

# print(github_extract('github.json'))
