import requests
from bs4 import BeautifulSoup

def cap_string(input_string):
    result = input_string.title().replace(" ", "_")
    return result

def wikiCrawler(user_input):
    input = user_input
    suffix = cap_string(input)
    url = "https://en.wikipedia.org/wiki/"
    url_query = url+suffix
    response = requests.get(url_query)
    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', class_="infobox vcard")

    if table:
        rows = table.find_all('tr')
        for row in rows:
            header = row.find('th')  
            data = row.find('td')  
            if header and data:
                # print(f"{header.text.strip()}: {data.text.strip()}")
                if header.text.strip() == "Website":
                    target_website = data.text.strip()

    else:
        url_query = url+input+"_(company)"
        response = requests.get(url_query)

        soup = BeautifulSoup(response.text, 'html.parser')

        table = soup.find('table', class_="infobox ib-company vcard")

        if table:
            rows = table.find_all('tr')
            for row in rows:
                header = row.find('th')  
                data = row.find('td')  
                if header and data:
                    # print(f"{header.text.strip()}: {data.text.strip()}")
                    if header.text.strip() == "Website":
                        target_website = data.text.strip()
        else:
            print("Table not found.")
    
    return target_website
