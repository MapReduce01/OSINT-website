from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import RedirectResponse
import uvicorn
from DB_Util.MongoDB_Util import MongoDBHandler
from DB_Util.models.OrgItem import OrgItem, jsvalue
import traceback
from fastapi.middleware.cors import CORSMiddleware
from DB_Util.MongoDB_Util import *
from typing import Optional

import sys
sys.path.append('Utilities')
import time
from wikiCrawler import wikiCrawler
from subfinderAPI import subfinderAPI
from openai_utilities import openai_query
from gleifAPI import gleifAPI
from gNews import fetch_news
from topDomains import topDomains
from openai_utilities import query_about_file
from gptAPI import gptAPI
from hibpAPI import email_seeker
import re
import subprocess
import json
from pathlib import Path
from logPrint import logprint
from censys.search import CensysHosts
import socket
from ipSafeCheck import *
from emailFinder import *
from github_finder import *
from Account import *
from censysFinder import *
import os
import requests

MongoDBHandler = MongoDBHandler(db_name="test")


app = FastAPI(
    title="osintdata",
    description="test",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def search_website(user_input):
    logprint("Searching... ", user_input)
    target_website = wikiCrawler(user_input)
    logprint("website found: " + target_website)
    return target_website

def find_domains(target_website):
    try:
        pattern_www = r'www\.[a-zA-Z0-9\-\.]+'
        matches_www = re.findall(pattern_www, target_website)
        target_domain = matches_www[0].replace("www.","")
    except:
        target_domain = target_website
    logprint("Finding subdomains... It might take a while"+"\n")
    domain_list = subfinderAPI(target_domain)

    domain_list_filtered = topDomains(domain_list, target_domain, 20)
    domain_list_filtered.append(target_domain)
    logprint(domain_list_filtered)
    return domain_list_filtered

def get_Ip_address(domain_list_filtered):
    ip_addresses = []
    for x in domain_list_filtered:
        try:
            ip_address = socket.gethostbyname(x)
            ip_addresses.append(ip_address)
            logprint(f"{x} -> {ip_address}")
        except socket.gaierror:
            logprint(f"Failed to resolve {x}")

    ip_addresses_filtered = list(set(ip_addresses))
    return ip_addresses_filtered



# merge and return all results for multi-thread
def get_safe_Ip_merged(user_input):
    target_website = search_website(user_input)
    domain_list_filtered = find_domains(target_website)
    ip_addresses_filtered = get_Ip_address(domain_list_filtered)
    ip_safe_list = ip_safe_check(ip_addresses_filtered)
    return domain_list_filtered, ip_addresses_filtered, ip_safe_list



def get_user_input(message):
    user_input = message

    des_query = "give me an overview of " + user_input
    des_answer = gptAPI(des_query,"Description")
    logprint(des_answer)

    dep_query = "tell me all the departments in " + user_input + " and show me more details about these departments"
    dep_answer = gptAPI(dep_query,"Department")
    logprint(dep_answer)

    target_location = Path(__file__).parent / "json_temp" / "Department.json"
    insight_query = query_about_file(target_location, "tell me more details of each element mentioned in this file")
    insight_answer = gptAPI(insight_query, "Insight")
    logprint(insight_answer)

    return user_input, des_answer, insight_answer

    
@app.get("/", tags=["documentation"])
async def root():
    return RedirectResponse(url="/docs")


@app.post("/addNewOrg", tags=["add | update"])
async def addNewOrg(Org: OrgItem):
    try:
        Org = Org.dict()
        result = MongoDBHandler.insert_data(Org)
        return result 
    except:
        traceback.print_exc()
        result = Org(data=Org, status_code=1)
    return result 



@app.post("/updateOrg", tags=["add | update"])
async def updateOrg(Org: OrgItem):
    try:
        Org = Org.dict()
        MongoDBHandler.update_data(Org)
        result = Org(data=Org, status_code=0)
    except:
        traceback.print_exc()
        result = Org(data=Org, status_code=1)

    return result


@app.get("/listOrgInfo", tags=["get"])
async def listOrgInfo(org_name: str = Query(example="Simon Fraser University"))->OrgItem:
    uni_id = org_name.upper().replace(" ","")
    found_doc = MongoDBHandler.find_one(query={"uni_id": uni_id})
    return found_doc

@app.get("/listAllOrgs", tags=["get"])
async def listAllOrgs():
    OrgList = MongoDBHandler.get_all_data()
    return OrgList


@app.delete("/removeOrgFromDB", tags=["delete"])
async def removeOrgFromDB(
    org_name: str = Query(example="Simon Fraser University")) -> OrgItem:
    try:
        org_name = org_name.upper().replace(" ","")
        delete_query = {"org_name": org_name}
        MongoDBHandler.delete_data(delete_query)
    
    except:
        traceback.print_exc()

    return 0
    
@app.post("/receive-value", tags=["post"])
async def receive_value(data: jsvalue):
    js_value = data.value
    user_input, des_answer, insight_answer = get_user_input(js_value)
    
    domain_list_filtered = []
    ip_addresses_filtered = []
    ip_safe_list = []
    
    with ThreadPoolExecutor() as executor:
	    	# future_gleif = executor.submit(gleifAPI, user_input)
	    	future_account = executor.submit(account_finder, user_input)
	    	future_censys = executor.submit(censys_finder, user_input)
	    	future_Ip = executor.submit(get_safe_Ip_merged, user_input)
	    	
    domain_list_filtered, ip_addresses_filtered, ip_safe_list = future_Ip.result()
    
    with ThreadPoolExecutor() as executor:
    		future_email = executor.submit(email_finder, domain_list_filtered)
    		future_github = executor.submit(github_finder, domain_list_filtered)
    		
    hibp_result = email_seeker(future_email.result())
    
    data_to_save = {"uni_id":user_input.upper().replace(" ",""),"org_name": user_input,"description": des_answer,"insight": insight_answer,"account": future_account.result(),"email": future_email.result(),"email_breaches": hibp_result,"ip": ip_safe_list,"github": future_github.result(),"censys": future_censys.result()}
    logprint("==============================")
    org = OrgItem(**data_to_save)
    result = await addNewOrg(org)
    return result

# command to run -> cd DB_Util -> python -m uvicorn FastAPI_DB:app --reload


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")
