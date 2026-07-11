import hashlib
from fastapi import UploadFile, HTTPException

def hash_file_bytes(file: UploadFile):
    if file.filename.lower().endswith(".pdf"):
        content = file.file.read()
        file_hash = hashlib.sha256(content).hexdigest()
        return file_hash
    
    raise HTTPException(status_code=400, detail="Please upload PDFs only...")