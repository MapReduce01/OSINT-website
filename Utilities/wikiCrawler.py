import requests
from pathlib import Path
from logPrint import logprint

def fetch_wikidata(params):
    url = 'https://www.wikidata.org/w/api.php'
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an error for bad status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        logprint(f"An error occurred: {e}")
        return None
    
def get_entity_id(entity_name):
    params = {
        'action': 'wbsearchentities',
        'format': 'json',
        'search': entity_name,
        'language': 'en'
    }
    data = fetch_wikidata(params)
    if data and 'search' in data and data['search']:
        return data['search'][0]['id']
    else:
        logprint("Entity not found.")
        return None

def get_official_website(entity_name):
    entity_id = get_entity_id(entity_name)
    if not entity_id:
        return None

    params = {
        'action': 'wbgetentities',
        'ids': entity_id,
        'format': 'json',
        'props': 'claims',
        'languages': 'en'
    }
    data = fetch_wikidata(params)
    try:
        claims = data['entities'][entity_id]['claims']
        official_website = claims['P856'][0]['mainsnak']['datavalue']['value']
        return official_website
    except KeyError:
        logprint("Official website not found for this entity.")
        return None

def wikiCrawler(organization_name):
    website = get_official_website(organization_name)
    if website:
        logprint(f"The official website of {organization_name} is {website}")
        return website
    else:
        logprint(f"Could not find the official website for {organization_name}.")

