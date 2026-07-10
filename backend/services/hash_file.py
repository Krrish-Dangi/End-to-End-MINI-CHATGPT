import hashlib
from fastapi import UploadFile

def hash_file_bytes(file: UploadFile):
    content = file.file.read()
    file_hash = hashlib.sha256(content).hexdigest()
    return file_hash