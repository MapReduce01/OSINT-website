import requests
import json

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
                print(f"Entity Name: {entity_name}")
                print(f"LEI Code: {lei_code}")
                print(f"Country: {country}")
                print(f"Legal Address: {actual_address}")
                print(f"Postal Code: {postalcode}")
                print(f"Registration Status: {registration_status}")
                # lei_record is a dict, attributes are shown as ablove
                json_version = json.dumps(lei_record)
                return json_version
        else:
            print("No matching company found.")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
