import subprocess
import json
from concurrent.futures import ThreadPoolExecutor

def temp1(company_name):
    company_name_1 = company_name.replace(" ", "_")
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_accounts", "-s", company_name_1, "-o","json","-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "["+result.stdout[:-3] + "]"
    account_json = json.loads(output)
    return account_json 

def temp2(company_name):
    company_name_1 = company_name.replace(" ", ".")
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_accounts", "-s", company_name_1, "-o","json","-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "["+result.stdout[:-3] + "]"
    account_json = json.loads(output)
    return account_json

def temp3(company_name):
    company_name_1 = company_name.replace(" ", "")
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_accounts", "-s", company_name_1, "-o","json","-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "["+result.stdout[:-3] + "]"
    account_json = json.loads(output)
    return account_json



def fix_json_format(file_path, output_file_path):
    try:
        # Read the file content
        with open(file_path, "r") as file:
            json_data = file.read()
        
        # Remove the erroneous parts
        clean_data = json_data.replace("[]", "")
        
        # Parse the cleaned data into JSON
        fixed_json = json.loads(clean_data)
        
        # Save the properly formatted JSON into a new file
        with open(output_file_path, "w") as output_file:
            json.dump(fixed_json, output_file, indent=4)
        
        print(f"Properly formatted JSON has been saved to {output_file_path}")
    
    except Exception as e:
        print(f"An error occurred: {e}")


def account_finder(user_input):
    with open('account.json', 'w') as file:
        pass

    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(temp1, user_input),
                   executor.submit(temp2, user_input),
                   executor.submit(temp3, user_input)]

        for future in futures:
            account_json = future.result()
            with open('account.json', 'a') as json_file_account:
                json.dump(account_json, json_file_account, indent=4)
    
    fix_json_format("account.json","account.json")
    print("Account Searching Done")

    print("The result has been saved to "+ 'account.json')
    account_list = account_extract('account.json',1)
    return account_list

def account_extract (file, mode = 0):
    #if want to get the list of data from json, mode = 0
    #if want to get txt data from json, mode = 1
    input_file = file 
    with open(input_file, 'r') as f:
        json_data = json.load(f)

    if mode == 0:
    # Extract 'data' field values into a list
        account_list = [entry['data'] for entry in json_data]
        filter_string = 'http'
        account_list = [items for items in account_list if filter_string in items]
        return account_list

    # Save the list to a txt file
    if mode == 1:
        account_list = [entry['data'] for entry in json_data]
        filter_string = 'http'
        account_list = [items for items in account_list if filter_string in items]
        output_file = 'account.txt'
        with open(output_file, 'w') as f:
            for account in account_list:
                f.write(f"{account}\n")
        print(f"Related account saved to: {output_file}")
    
    return None


#test pls comment out when use
# start_time = time.time()

# company_name = "Simon Fraser University"
# print(account_finder(company_name))
# end_time = time.time()
# elapsed_time = end_time - start_time
# print(f"Time taken: {elapsed_time:.2f} seconds")
# print(account_extract('account.json'))
