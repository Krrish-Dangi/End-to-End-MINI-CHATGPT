from fastapi import APIRouter, UploadFile, Form, File
from services.VectorStore import create_vector_store
from fastapi.responses import Response

upload_router = APIRouter()

@upload_router.post("/upload")
def upload_file(id: str = Form(...), file: UploadFile = File(...)): ## Why Form(...) and File(...) bcz fastapi do not accepts json and file in same req. Form(...) does not works on pydantic models
    flag = create_vector_store(id, file)
    if flag == None:
        return Response(status_code=200, content= "File already uploaded in this session...")

    return Response(status_code=200, content="File successfully uploaded!")