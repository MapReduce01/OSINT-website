import requests
import concurrent.futures
import time
from logPrint import logprint
from pathlib import Path
from emailFinder import *


# # Sample function that processes an element
# def process_element(element):
#     result = check_hibp(element)
#     # Display the results
#     if isinstance(result, list):
#         print(f"Breaches for {element}:")
#         hibp_list.append(element)
#         for breach in result:
#             print(f"- {breach['Name']}: {breach['BreachDate']}")
#             hibp_list.append(f"- {breach['Name']}: {breach['BreachDate']}")
#     else:
#         print(result)
    

# # Function to use concurrency for processing list items
# def process_list_concurrently(input_list):
#     results = []
#     # Use ThreadPoolExecutor to process items concurrently
#     with concurrent.futures.ThreadPoolExecutor() as executor:
#         # Submit tasks to the executor for each element
#         futures = [executor.submit(process_element, elem) for elem in input_list]
        
#         # Retrieve results as they complete
#         for future in concurrent.futures.as_completed(futures):
#             results.append(future.result())
    
#     return results

def save_list_to_txt(file_path, data_list):
    # Open the file in write mode
    with open(file_path, 'w') as file:
        for item in data_list:
            file.write(f"{item}\n")  

def transform_data(data):
    # Parse the string data to JSON if it’s a string
    if isinstance(data, str):
        data = json.loads(data)
        
    transformed_data = []
    for email, breaches in data.items():
        transformed_data.append({
            "Email": email,
            "Breaches": breaches
        })
    return transformed_data




# Have I Been Pwned API credentials
API_KEY = 'a5d0f59d23dd47b4a173947d68a1ccff'

def email_seeker(elist):
    hibp_list = []
    lines_with_at = []  
    # with open(file_path, 'r') as file:
    #     for line in file:
    #         # Check if '@' is in the current line
    #         if '@' in line:
    #             lines_with_at.append(line.strip())  # Strip to remove any extra spaces or newline characters
    for entry in elist:
        if 'email' in entry:
            lines_with_at.append(entry['email'])
    print(lines_with_at)

    # for x in lines_with_at:
    #     result = check_hibp(x)
    #     if isinstance(result, list):
    #         logprint(f"Breaches for {x}:")
    #         hibp_list.append(x)
    #         for breach in result:
    #             logprint(f"- {breach['Name']}: {breach['BreachDate']}")
    #             hibp_list.append(f"- {breach['Name']}: {breach['BreachDate']}")
    #     else:
    #         logprint(result)
    #     time.sleep(6)

    hibp_data = {}

    for x in lines_with_at[:10]:
        result = check_hibp(x)
        if isinstance(result, list):
            logprint(f"Breaches for {x}:")
            
            # Initialize a list of breaches for each email
            hibp_data[x] = []
            
            # Add each breach as a dictionary entry
            for breach in result:
                breach_info = {"Name": breach["Name"], "BreachDate": breach["BreachDate"]}
                logprint(f"- {breach_info['Name']}: {breach_info['BreachDate']}")
                hibp_data[x].append(breach_info)
        else:
            logprint(result)
            
        # Add a delay to avoid rate limits
        time.sleep(6)

   
    hibp_json = json.dumps(hibp_data, indent=4)
    transformed_data = transform_data(hibp_json)
    logprint("Hibp Data JSON:")
    logprint(transformed_data)
    return transformed_data


    # script_directory = Path(__file__).parent  
    # target_folder = script_directory.parent / "txt_temp"  
    # file_path = target_folder / "email_breaches.txt"

    # target_folder.mkdir(parents=True, exist_ok=True)
    
    # save_list_to_txt(str(file_path), hibp_list)
    

# Function to check breaches for an email address using HIBP API
def check_hibp(email):
    url = f'https://haveibeenpwned.com/api/v3/breachedaccount/{email}'
    
    headers = {
        'hibp-api-key': API_KEY,
        'user-agent': 'python-client'  # Required as per HIBP API documentation
    }

    params = {
        'truncateResponse': 'false'   # Optional: Set to true to only get the breach names
    }

    try:
        # Send the GET request
        response = requests.get(url, headers=headers, params=params)

        # If the response is successful (status code 200)
        if response.status_code == 200:
            return response.json()    # Return the JSON response
        elif response.status_code == 404:
            return f"No breaches found for {email}."  # Email not found in any breach
        else:
            return f"Error: {response.status_code}, {response.text}"
    except Exception as e:
        return f"Exception occurred: {str(e)}"


# target_folder = Path(__file__).parent.parent / "txt_temp" / "email.txt"
# email_seeker(str(target_folder))

# lll = ['sfu.ca', 'ad.sfu.ca', 'cs.sfu.ca', 'fs.sfu.ca', 'my.sfu.ca', 'go.sfu.ca', 'cgi.sfu.ca', 'ns3.sfu.ca', 'pkp.sfu.ca', 'cas.sfu.ca', 'idp.sfu.ca', 'avs.sfu.ca', 'its.sfu.ca', 'fhs.sfu.ca', 'bus.sfu.ca', 'rcg.sfu.ca', 'ucs.sfu.ca', 'net.sfu.ca', 'lib.sfu.ca', 'www.sfu.ca', 'sfu.ca']
# llllll = email_finder(lll)
# print(llllll)

# email_seeker(llllll)
