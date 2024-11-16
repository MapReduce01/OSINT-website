import subprocess
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from logPrint import logprint
import re

def search_email(domain):
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_hunter", "-s", domain, "-o", "json", "-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = re.sub(r',\s*$', '', result.stdout.strip())
    #output = result.stdout
    #print(type(output))
    #print(output)
    email_json = json.loads(output)

    result = []
    email_to_name = {}

    for item in email_json:
        if item["type"] == "Email Address":
            email_to_name[item["data"]] = {"email": item["data"], "full_name": None}
        elif item["type"] == "Raw Data from RIRs/APIs" and "Possible full name" in item["data"]:
            possible_name = item["data"].replace("Possible full name: ", "").strip()
            for email in email_to_name:
                if email_to_name[email]["full_name"] is None and item["source"] in email:
                    email_to_name[email]["full_name"] = possible_name

    result = [details for details in email_to_name.values() if details["full_name"]]

    return result

def email_finder(domain_list_filtered):
    email_json_list = []

    logprint("Starting email search...")

    with ThreadPoolExecutor() as executor:
        future_to_domain = {executor.submit(search_email, domain): domain for domain in domain_list_filtered}

        for future in as_completed(future_to_domain):
            email_json = future.result()
            email_json_list.extend(email_json)

    logprint("Email Searching Done")

    script_directory = Path(__file__).parent  
    target_folder = script_directory.parent / "json_temp"  
    file_path = target_folder / "email.json"

    target_folder.mkdir(parents=True, exist_ok=True)

    with open(str(file_path), 'w') as json_file_email:
        json.dump(email_json_list, json_file_email)

    logprint("The result has been saved to " + 'email.json')
    # email_list = email_extract(str(file_path),1)
    return email_json_list

# def email_extract (file, mode = 0):
#     #if want to get the list of data from json, mode = 0
#     #if want to get txt data from json, mode = 1
#     input_file = file 
#     with open(input_file, 'r') as f:
#         json_data = json.load(f)

#     if mode == 0:
#     # Extract 'data' field values into a list
#         email_list = [entry['data'] for entry in json_data]
#         filter_string = '@'
#         name_string = 'name'
#         email_list = [items for items in email_list if filter_string in items or name_string in items]
#         return email_list

#     # Save the list to a txt file
#     if mode == 1:
#         email_list = [entry['data'] for entry in json_data]
#         filter_string = '@'
#         name_string = 'name'
#         email_list = [items for items in email_list if filter_string in items or name_string in items]

#         script_directory = Path(__file__).parent  
#         target_folder = script_directory.parent / "txt_temp"  
#         file_path = target_folder / "email.txt"

#         target_folder.mkdir(parents=True, exist_ok=True)

#         output_file = str(file_path)
#         with open(output_file, 'w') as f:
#             for email in email_list:
#                 f.write(f"{email}\n")
#         logprint(f"Related email saved to: {output_file}")
    
#     return None


#test pls comment out when use

#domain_list_filtered = ["sfu.ca","amazon.com"]
#email_finder(domain_list_filtered)

# print(email_extract('email.json',1))
