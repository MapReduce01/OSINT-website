import subprocess
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

def search_email(domain):
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_hunter", "-s", domain, "-o", "json", "-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "[" + result.stdout[:-3] + "]"
    email_json = json.loads(output)
    return email_json

def email_finder(domain_list_filtered):
    email_json_list = []

    print("Starting email search...")

    with ThreadPoolExecutor() as executor:
        future_to_domain = {executor.submit(search_email, domain): domain for domain in domain_list_filtered}

        for future in as_completed(future_to_domain):
            email_json = future.result()
            email_json_list.extend(email_json)

    print("Email Searching Done")

    with open('email.json', 'w') as json_file_email:
        json.dump(email_json_list, json_file_email, indent=4)

    print("The result has been saved to " + 'email.json')
    email_list = email_extract('email.json',1)
    return email_list

def email_extract (file, mode = 0):
    #if want to get the list of data from json, mode = 0
    #if want to get txt data from json, mode = 1
    input_file = file 
    with open(input_file, 'r') as f:
        json_data = json.load(f)

    if mode == 0:
    # Extract 'data' field values into a list
        email_list = [entry['data'] for entry in json_data]
        filter_string = '@'
        name_string = 'name'
        email_list = [items for items in email_list if filter_string in items or name_string in items]
        return email_list

    # Save the list to a txt file
    if mode == 1:
        email_list = [entry['data'] for entry in json_data]
        filter_string = '@'
        name_string = 'name'
        email_list = [items for items in email_list if filter_string in items or name_string in items]
        output_file = 'email.txt'
        with open(output_file, 'w') as f:
            for email in email_list:
                f.write(f"{email}\n")
        print(f"Related email saved to: {output_file}")
    
    return None


#test pls comment out when use

# domain_list_filtered = ["sfu.ca"]
# print(email_finder(domain_list_filtered))

# print(email_extract('email.json',1))