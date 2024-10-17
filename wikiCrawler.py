import requests
from bs4 import BeautifulSoup

def cap_string(input_string):
    result = input_string.title().replace(" ", "_")
    return result

user_input = input("Enter a name to search: ")

print("Searching... ", user_input)

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
            print(f"{header.text.strip()}: {data.text.strip()}") # comment this out later
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
                print(f"{header.text.strip()}: {data.text.strip()}") # comment this out later
                if header.text.strip() == "Website":
                    target_website = data.text.strip()
    else:
        print("Table not found.")

print(target_website) #comment this out later

# use "target_website" as the variable name in following scripts 
