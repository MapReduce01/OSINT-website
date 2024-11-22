from pydantic import BaseModel, Field
from typing import Dict, Any
from typing import Optional

class OrgItem(BaseModel):
    uni_id: Any
    org_name: Any
    description: Any
    insight: Any
    account: Any
    email: Any
    email_breaches: Any
    ip: Any
    github: Any
    censys: Any

class jsvalue(BaseModel):
    value: str
