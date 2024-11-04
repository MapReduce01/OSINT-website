from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import RedirectResponse
import uvicorn
from MongoDB_Util import MongoDBHandler
from models.OrgItem import OrgItem
import traceback
from fastapi.middleware.cors import CORSMiddleware
from db_test import MongoDBHandler

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
        Org["orgname"] = str(Org["org_name"]).upper().replace(" ","")
        MongoDBHandler.update_data(Org)
        result = Org(data=Org, status_code=0)
    except:
        traceback.print_exc()
        result = Org(data=Org, status_code=1)

    return result


@app.get("/listOrgInfo", tags=["get"])
async def listOrgInfo(org_name: str = Query(example="Simon Fraser University"))->OrgItem:
    org_name = org_name.upper().replace(" ","")
    found_doc = MongoDBHandler.find_one(query={"org_name": org_name})
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

# command to run -> cd DB_Util -> python -m uvicorn FastAPI_DB:app --reload

