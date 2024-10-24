from wikiCrawler import wikiCrawler
from subfinderAPI import subfinderAPI
from openai_utilities import openai_query
from gleifAPI import gleifAPI
from gNews import fetch_news
import re
import subprocess
import json
from censys.search import CensysHosts
import socket


def search_website(user_input):
    print("Searching... ", user_input)
    target_website = wikiCrawler(user_input)
    return target_website


# Example usage:
target_website = search_website("Enter a name to search")
print("Website found: " + target_website) 