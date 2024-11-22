from censys.search import CensysHosts
# from censys_extract import *
from logPrint import logprint
from pathlib import Path
import json

def clean_dict(d):
    keys_to_delete = []
    
    for key, value in d.items():
        if isinstance(value, dict):
            clean_dict(value)
            if not value:
                keys_to_delete.append(key)
        elif isinstance(value, list):
            if not value:
                keys_to_delete.append(key)
        elif value is None:
            keys_to_delete.append(key)

    for key in keys_to_delete:
        del d[key]

def censys_finder(user_input):
    API_ID = "f8013bed-c783-4320-97be-e0d390cbea7d"
    API_SECRET = "6djq5lM85rMUneVhOp4SBFGnd46Laa4T"

    censys_hosts = CensysHosts(api_id=API_ID, api_secret=API_SECRET)
    query = user_input
    censys_results = censys_hosts.search(query)


    # with open('censys.json', 'w') as json_file_censys:
    #     json.dump(censys_results, json_file_censys, indent=4)
    censys_str = ""
    for result in censys_results:
        logprint(result)
        censys_str= censys_str+str(result)

    script_directory = Path(__file__).parent  
    #target_folder = script_directory.parent / "json_temp"  
    #file_path = target_folder / "censys.json"

    data = eval(censys_str)
    for item in data:
        clean_dict(item)

    #target_folder.mkdir(parents=True, exist_ok=True)
    #cnesys_json = json.dumps(data)

    #with open(str(file_path), "w") as json_file:
        #json_file.write(cnesys_json)

    return data



# censys_finder("Simon Fraser University")
