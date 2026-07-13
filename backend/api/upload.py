from fastapi import APIRouter, UploadFile, Form, File, Depends, HTTPException
from services.VectorStore import create_vector_store
from fastapi.responses import Response
from services.auth import verify_user, validate_access

upload_router = APIRouter()

@upload_router.post("/upload")
def upload_file(
    session_id: str = Form(...),
    user_id: str = Form(...), 
    file: UploadFile = File(...),
    token_user_id: str | None = Depends(verify_user)
): 
    # Validates that the uploaded user_id matches the authenticated token
    validate_access(user_id, token_user_id)

    flag = create_vector_store(session_id, user_id, file)
    if flag == None:
        return Response(status_code=200, content= "File already uploaded in this session...")

    return Response(status_code=200, content="File successfully uploaded!")