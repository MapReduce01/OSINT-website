import subprocess
import json

def account_finder(company_name):
    command = ["python", "./OSINT-website/spiderfoot/sf.py", "-m", "sfp_accounts", "-s", company_name, "-o","json","-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "["+result.stdout[:-3] + "]"
    account_json = json.loads(output)

    print("Account Searching Done")

    with open('account.json', 'w') as json_file_account:
        json.dump(account_json, json_file_account, indent=4)

    print("The result has been saved to "+ 'account.json')
    account_list = account_extract('account.json')
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

# company_name = "Simon Fraser University"
# print(account_finder(company_name))

# print(account_extract('account.json'))