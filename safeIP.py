import subprocess
import json

def ip_safe_check(ip_addresses_filtered):
    ip_json_list = []
    ip_safe_list = []
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
                print("There is a malicious IP Address")
        
        command = ["python", "./spiderfoot/sf.py", "-m", "sfp_botvrij", "-s", ip, "-o","json","-q"]
        result = subprocess.run(command, capture_output=True, text=True)
        output = "["+result.stdout[:-3] + "]"
        ip_json = json.loads(output)
        for item in ip_json:
            if item.get("type") == "Malicious IP Address":
                malicious_check = True


        if not malicious_check:
            ip_safe_list.append(ip)
            for item in ip_json:
                ip_json_list.extend(ip_json) 

    print("Malicious IP Filter Done")

    with open('ip_safe_list.json', 'w') as json_file_ip:
        json.dump(ip_json_list, json_file_ip, indent=4)
    
    print("The result has been saved to "+ 'ip_safe_list.json')
    
    return ip_safe_list

def ip_extract (file, mode = 0):
    #if want to get the list of data from json, mode = 0
    #if want to get txt data from json, mode = 1
    input_file = file 
    with open(input_file, 'r') as f:
        json_data = json.load(f)

    if mode == 0:
    # Extract 'data' field values into a list
        ip_list = [entry['data'] for entry in json_data]
        return ip_list

    # Save the list to a txt file
    if mode == 1:
        ip_list = [entry['data'] for entry in json_data]
        output_file = 'ip_safe.txt'
        with open(output_file, 'w') as f:
            for ip in ip_list:
                f.write(f"{ip}\n")
        print(f"Safety IP addresses saved to: {output_file}")
    
    return None

#test pls comment out when use
test_ip = ['34.211.108.47', '142.58.142.134', '3.97.108.247', '142.58.142.231', '142.58.143.9', '142.58.103.55', '142.58.143.66']

test_output_list = ip_safe_check(test_ip)
print(test_output_list)

print(ip_extract('ip_safe_list.json',1))


