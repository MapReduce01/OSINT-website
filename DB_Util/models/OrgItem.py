from pydantic import BaseModel
from typing import Dict, Any

class OrgItem(BaseModel):
    _id: str
    org_name: str
    description: Dict[str, Any]
    insight: Dict[str, Any]
    account: list
    email: list
    email_breaches: str
    ip_safe_list: list
    censys: str
    gleif: str
