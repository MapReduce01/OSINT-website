import requests
import json
from logPrint import logprint

def gleifAPI(name):
    gleif_api_url = "https://api.gleif.org/api/v1/lei-records"

    # Company name to search for (replace with the company's legal name)
    company_name = name  

    params = {
        "filter[entity.legalName]": company_name
    }

    response = requests.get(gleif_api_url, params=params)

    if response.status_code == 200:
        data = response.json()
        
        if data['data']:
            for lei_record in data['data']:
                entity_name = lei_record['attributes']['entity']['legalName']['name']
                lei_code = lei_record['id']
                legal_address = lei_record['attributes']['entity']['legalAddress']
                country = legal_address['country']
                actual_address = legal_address['addressLines']
                postalcode = legal_address['postalCode']
                registration_status = lei_record['attributes']['registration']['status']
                logprint(f"Entity Name: {entity_name}")
                logprint(f"LEI Code: {lei_code}")
                logprint(f"Country: {country}")
                logprint(f"Legal Address: {actual_address}")
                logprint(f"Postal Code: {postalcode}")
                logprint(f"Registration Status: {registration_status}")
                # lei_record is a dict, attributes are shown as ablove
                json_version = json.dumps(lei_record)
                with open('gleif.json', 'w') as json_file_gleif:
                    json.dump(json_version, json_file_gleif, indent=4)
                return json_version
        else:
            logprint("No matching company found.")
    else:
        logprint(f"Error: {response.status_code}")
        logprint(response.text)
