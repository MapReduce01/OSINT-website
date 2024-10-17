import requests

# GLEIF API endpoint for searching LEI records
gleif_api_url = "https://api.gleif.org/api/v1/lei-records"

# Company name to search for (replace with the company's legal name)
company_name = "simon fraser university"  # Replace with the actual company name you want to search

# Construct the query parameters (filter by the legal name of the entity)
params = {
    "filter[entity.legalName]": company_name
}

# Make the request to the GLEIF API
response = requests.get(gleif_api_url, params=params)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON response
    data = response.json()
    
    # If there are matching LEI records
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
            print("="*50)
    else:
        print("No matching company found.")
else:
    print(f"Error: {response.status_code}")
    print(response.text)