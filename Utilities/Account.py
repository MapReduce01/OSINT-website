import subprocess
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from logPrint import logprint
import re

def search_account(company_name, divided_char):
    company_name_1 = company_name.replace(" ", divided_char)
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_accounts", "-s", company_name_1, "-o","json","-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = re.sub(r',\s*$', '', result.stdout.strip())
    #output = "[" + result.stdout[:-3] + "]"
    account_json = json.loads(output)
    return account_json 



def fix_json_format(file_path):
    data = []
    
    with open(file_path, 'r') as f:
        raw_content = f.read()
        json_arrays = raw_content.split('][')
        
        for i, json_array in enumerate(json_arrays):
            if i == 0:
                json_array = json_array + ']'
            elif i == len(json_arrays) - 1:
                json_array = '[' + json_array
            else:
                json_array = '[' + json_array + ']'
                
            data.extend(json.loads(json_array))
    
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Flattened JSON saved at: {file_path}")


def account_finder(user_input):
    script_directory = Path(__file__).parent  
    #target_folder = script_directory.parent / "json_temp"  
    #file_path = target_folder / "account.json"
    #target_folder.mkdir(parents=True, exist_ok=True)

    # with open(str(file_path), 'w') as file:
    #     pass

    temp = []
    logprint("Account Searching Started")

    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(search_account, user_input,"_"),
                   executor.submit(search_account, user_input,"."),
                   executor.submit(search_account, user_input,"")]

        for future in futures:
            temp.extend( future.result())
            

    # fix_json_format(futures)
    # print(temp)
    logprint("Account Searching Done")

    # logprint("The result has been saved to "+ 'account.json')

    websites = []
    for entry in temp:
        if "<SFURL>" in entry["data"]:
            name = entry["data"].split("(Category:")[0].strip()
            url = entry["data"].split("<SFURL>")[1].split("</SFURL>")[0]
            websites.append({"website": name, "url": url})

    websites_json = json.dumps(websites)
    # print(websites_json)

    # print(websites_json)

    #with open(str(file_path), 'w') as outfile:
        #outfile.write(websites_json)

    # account_list = account_extract(str(file_path),str(file_path2))
    return websites

# def account_extract (file,file2):
#     with open(file, 'r') as file_temp:
#         data = json.load(file_temp)        

#     websites = []
#     for entry in data:
#         if "<SFURL>" in entry["data"]:
#             name = entry["data"].split("(Category:")[0].strip()
#             url = entry["data"].split("<SFURL>")[1].split("</SFURL>")[0]
#             websites.append({"website": name, "url": url})

#     websites_json = json.dumps(websites)

#     # print(websites_json)

#     with open(file2, 'w') as outfile:
#         outfile.write(websites_json)

#     return

# def account_extract (file, mode = 0):
#     #if want to get the list of data from json, mode = 0
#     #if want to get txt data from json, mode = 1
#     input_file = file 
#     with open(input_file, 'r') as f:
#         json_data = json.load(f)

#     if mode == 0:
#     # Extract 'data' field values into a list
#         account_list = [entry['data'] for entry in json_data]
#         filter_string = 'http'
#         account_list = [items for items in account_list if filter_string in items]
#         return account_list

#     # Save the list to a txt file
#     if mode == 1:
#         account_list = [entry['data'] for entry in json_data]
#         filter_string = 'http'
#         account_list = [items for items in account_list if filter_string in items]

#         script_directory = Path(__file__).parent  
#         target_folder = script_directory.parent / "txt_temp"  
#         file_path = target_folder / "account.txt"
#         target_folder.mkdir(parents=True, exist_ok=True)

#         output_file = str(file_path)
#         with open(output_file, 'w') as f:
#             for account in account_list:
#                 f.write(f"{account}\n")
#         logprint(f"Related account saved to: {output_file}")
    
#     return None


# test pls comment out when use
# start_time = time.time()

#company_name = "Simon Fraser University"
#account_finder(company_name)
# end_time = time.time()
# elapsed_time = end_time - start_time
# print(f"Time taken: {elapsed_time:.2f} seconds")
# print(account_extract('account.json'))
