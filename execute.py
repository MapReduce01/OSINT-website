from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import RedirectResponse
import uvicorn
from DB_Util.MongoDB_Util import MongoDBHandler
from DB_Util.models.OrgItem import OrgItem, jsvalue
import traceback
from fastapi.middleware.cors import CORSMiddleware
from DB_Util.MongoDB_Util import *
from typing import Optional
import subprocess
import sys
sys.path.append('Utilities')
from logPrint import logprint

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
async def listOrgInfo(org_name: str = Query(example="Amazon"))->OrgItem:
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
    subprocess.Popen(["python", "info_gathering.py", str(js_value)])
    print(f"Called 'info_gathering.py' with value: {js_value}")
    print("==============================")
    return

# command to run -> cd DB_Util -> python -m uvicorn FastAPI_DB:app --reload


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")
