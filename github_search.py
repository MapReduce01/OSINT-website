import subprocess
import json

def github_finder(domain_list_filtered):
    github_json_list = []
    for domain in domain_list_filtered:
        command = ["python", "./OSINT-website/spiderfoot/sf.py", "-m", "sfp_github", "-s", domain, "-o","json","-q"]
        result = subprocess.run(command, capture_output=True, text=True)
        output = "["+result.stdout[:-3] + "]"
        github_json = json.loads(output)
        github_json_list.extend(github_json)

    print("Github Searching Done")

    with open('github.json', 'w') as json_file_github:
        json.dump(github_json_list, json_file_github, indent=4)

    print("The result has been saved to "+ 'github.json')
    github_list = github_extract('github.json')
    return github_list

def github_extract (file, mode = 0):
    #if want to get the list of data from json, mode = 0
    #if want to get txt data from json, mode = 1
    input_file = file 
    with open(input_file, 'r') as f:
        json_data = json.load(f)

    if mode == 0:
    # Extract 'data' field values into a list
        github_list = [entry['data'] for entry in json_data]
        filter_string = 'github'
        github_list = [items for items in github_list if filter_string in items]
        return github_list

    # Save the list to a txt file
    if mode == 1:
        github_list = [entry['data'] for entry in json_data]
        filter_string = 'github'
        github_list = [items for items in github_list if filter_string in items]
        output_file = 'github.txt'
        with open(output_file, 'w') as f:
            for github in github_list:
                f.write(f"{github}\n")
        print(f"Related github saved to: {output_file}")
    
    return None


#test pls comment out when use

domain_list_filtered = ["sfu.ca"]
print(github_finder(domain_list_filtered))

# print(github_extract('github.json'))