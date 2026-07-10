from services.embedding import get_embedding_model
from fastapi import UploadFile
from langchain_classic.document_loaders import PyPDFLoader
import tempfile
from services.chunking import split_text
from langchain_chroma import Chroma
from store.session_store import vector_store, uploaded_files
from services.hash_file import hash_file_bytes
import os


def create_vector_store(id: str, file: UploadFile):
    try:
        ## Check whether file is already uploaded
        hash_value = hash_file_bytes(file)
        file.file.seek(0) ## Otherwise file.read() will read 0 bytes
        files_already_uploaded = uploaded_files.setdefault(id, set())
        if hash_value in files_already_uploaded:
            return None
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
            temp.write(file.file.read())
            file_path = temp.name

        file_loader = PyPDFLoader(file_path=file_path)
        content = file_loader.load()

        docs = split_text(chunks= content, size= 1000, overlap = 100)

        ## If Chroma DNE
        if id not in vector_store:
            embedder = get_embedding_model(name="Qwen/Qwen3-Embedding-0.6B")
            vector_store[id] = Chroma.from_documents(documents=docs, embedding=embedder)
        
        ## If Chroma does exists
        else:
            vector_store[id].add_documents(docs)

        ## If its new add it to the uploaded_files
        uploaded_files[id].add(hash_value)

        return vector_store[id]
    
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)