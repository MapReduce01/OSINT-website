import json
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed
from logPrint import logprint
from pathlib import Path


def check_ip(ip):
    malicious_check = False
    ip_json_list = []

    # use abusech
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_abusech", "-s", ip, "-o", "json", "-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "[" + result.stdout[:-3] + "]"
    ip_json = json.loads(output)
    
    for item in ip_json:
        if item.get("type") == "Malicious IP Address":
            malicious_check = True
            logprint(f"{ip} is a malicious IP Address (abusech)")

    # use botvrij
    command = ["python", "./spiderfoot/sf.py", "-m", "sfp_botvrij", "-s", ip, "-o", "json", "-q"]
    result = subprocess.run(command, capture_output=True, text=True)
    output = "[" + result.stdout[:-3] + "]"
    ip_json = json.loads(output)

    for item in ip_json:
        if item.get("type") == "Malicious IP Address":
            malicious_check = True
            logprint(f"{ip} is a malicious IP Address (botvrij)")

    ip_json_list.extend(ip_json)
    return ip, malicious_check, ip_json_list


def ip_safe_check(ip_addresses_filtered):
    ip_json_list = []
    ip_safe_list = []

    logprint("Starting malicious IP filter...")

    with ThreadPoolExecutor() as executor:
        future_to_ip = {executor.submit(check_ip, ip): ip for ip in ip_addresses_filtered}

        for future in as_completed(future_to_ip):
            ip, malicious_check, ip_json = future.result()
            if not malicious_check:
                ip_safe_list.append(ip)
                ip_json_list.extend(ip_json)

    logprint("Malicious IP Filter Done")

    script_directory = Path(__file__).parent  
    target_folder = script_directory.parent / "json_temp"  
    file_path = target_folder / "ip_safe_list.json"

    target_folder.mkdir(parents=True, exist_ok=True)

    with open(str(file_path), 'w') as json_file_ip:
        json.dump(ip_json_list, json_file_ip, indent=4)

    logprint("The result has been saved to " + 'ip_safe_list.json')
    ip_extract(str(file_path), 1)
    
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

        script_directory = Path(__file__).parent  
        target_folder = script_directory.parent / "txt_temp"  
        file_path = target_folder / "ip_safe_list.txt"

        target_folder.mkdir(parents=True, exist_ok=True)

        output_file = str(file_path)
        with open(output_file, 'w') as f:
            for ip in ip_list:
                f.write(f"{ip}\n")
        logprint(f"Safety IP addresses saved to: {output_file}")
    
    return None