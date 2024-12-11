# import json

# with open('extracted_emails.txt', 'r') as file:
#     emails = file.readlines()

# emails = [email.strip() for email in emails]

# email_data = []
# for email in emails:
#     full_name = email.split('@')[0].replace('_', ' ').title()
#     email_data.append({
#         "email": email,
#         "full_name": full_name
#     })

# result = {"email": email_data}


import subprocess
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
# from logPrint import logprint
import re

def search_email(domain):
    # command = ["python", "./spiderfoot/sf.py", "-m", "sfp_hunter", "-s", domain, "-o", "json", "-q"]
    # result = subprocess.run(command, capture_output=True, text=True)
    # output = re.sub(r',\s*$', '', result.stdout.strip())
    # email_json = json.loads(output)

    # result = []
    # email_to_name = {}

    # for item in email_json:
    #     if item["type"] == "Email Address":
    #         email_to_name[item["data"]] = {"email": item["data"], "full_name": None}
    #     elif item["type"] == "Raw Data from RIRs/APIs" and "Possible full name" in item["data"]:
    #         possible_name = item["data"].replace("Possible full name: ", "").strip()
    #         for email in email_to_name:
    #             if email_to_name[email]["full_name"] is None and item["source"] in email:
    #                 email_to_name[email]["full_name"] = possible_name

    # result = [details for details in email_to_name.values() if details["full_name"]]
    # grep "@amazon.com" emails.txt > output.txt
    command = ["grep", domain, "extracted_emails.txt"]
    result = subprocess.run(command, capture_output=True, text=True)
    emails = result.stdout.strip().split('\n')

    email_data = []
    for email in emails:
        full_name = email.split('@')[0].replace('_', ' ').title()
        email_data.append({
            "email": email,
            "full_name": full_name
        })

    result = email_data
    print(result)

    return result

def new_email_finder(domain_list_filtered):
    email_json_list = []

    # logprint("Starting email search...")
    print(domain_list_filtered)
    email_list = search_email(domain_list_filtered[0])
    

    # logprint("Email Searching Done")

    script_directory = Path(__file__).parent  
    return email_list




#test pls comment out when use

#domain_list_filtered = ["sfu.ca"]
#email_finder(domain_list_filtered)

# print(email_extract('email.json',1))

