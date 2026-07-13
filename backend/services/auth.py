import os
import json
import urllib.request
from urllib.error import HTTPError
from fastapi import Depends, HTTPException, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

security = HTTPBearer(auto_error=False)

def verify_user(request: Request, credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verifies the user by validating the Supabase JWT token against the Supabase Auth server.
    This works reliably for both HS256 and ES256 (Asymmetric) JWTs.
    """
    if not credentials:
        print("AUTH ERROR: No credentials found in Authorization header")
        raise HTTPException(status_code=401, detail="Authentication required")
        
    token = credentials.credentials
    
    try:
        # Securely verify token directly with Supabase
        req = urllib.request.Request(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": SUPABASE_ANON_KEY
            }
        )
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                token_user_id = data.get("id")
                if not token_user_id:
                    print("AUTH ERROR: No user ID in Supabase response")
                    raise HTTPException(status_code=401, detail="Invalid token structure")
                return token_user_id
    except HTTPError as e:
        print("AUTH ERROR: Supabase rejected token (HTTPError):", e.code)
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except Exception as e:
        print("AUTH ERROR: Failed to contact Supabase Auth:", str(e))
        raise HTTPException(status_code=500, detail="Authentication service unavailable")

def validate_access(user_id: str, token_user_id: str | None):
    """
    Ensures that the requested user_id matches the authenticated token_user_id.
    """
    if token_user_id is None:
        raise HTTPException(status_code=401, detail="Authentication required")
    if user_id != token_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's data")
