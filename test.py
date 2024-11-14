import requests

import json

# Load JSON data from a local file
with open("111.json", "r") as file:
    data = json.load(file)

response = requests.post("http://127.0.0.1:5000/addNewOrg", json=data)