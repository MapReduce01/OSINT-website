import json
import urllib.request

def fetch_news(apikey, example):
    url = f"https://gnews.io/api/v4/search?q={example}&lang=en&country=us&max=10&apikey={apikey}"
    
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode("utf-8"))
        return data["articles"]

# Example usage
# apikey = "92fb531ccd5040d9677d73c64d78bc69"
# example = "sfu"
# news_data = fetch_news(apikey, example)
# print(news_data)