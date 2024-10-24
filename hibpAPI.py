import requests
import concurrent.futures
import time


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


# Have I Been Pwned API credentials
API_KEY = 'a5d0f59d23dd47b4a173947d68a1ccff'

def email_seeker(file_path):
    hibp_list = []
    lines_with_at = []  
    # Open the file and read it line by line
    with open(file_path, 'r') as file:
        for line in file:
            # Check if '@' is in the current line
            if '@' in line:
                lines_with_at.append(line.strip())  # Strip to remove any extra spaces or newline characters
    
    for x in lines_with_at:
        result = check_hibp(x)
        # Display the results
        if isinstance(result, list):
            print(f"Breaches for {x}:")
            hibp_list.append(x)
            for breach in result:
                print(f"- {breach['Name']}: {breach['BreachDate']}")
                hibp_list.append(f"- {breach['Name']}: {breach['BreachDate']}")
        else:
            print(result)
        time.sleep(6)
    
    save_list_to_txt("email_breaches.txt", hibp_list)
    

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

