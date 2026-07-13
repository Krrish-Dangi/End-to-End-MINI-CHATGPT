from services.embedding import get_embedding_model
from fastapi import UploadFile
from langchain_classic.document_loaders import PyPDFLoader
import tempfile
from services.chunking import split_text
from langchain_chroma import Chroma
from services.hash_file import hash_file_bytes
import os
import sqlite3 as sq
from datetime import datetime


def create_vector_store(session_id: str, file: UploadFile):
    try:
        file_path = None
        ## Check whether file is already uploaded
        hash_value = hash_file_bytes(file)
        file.file.seek(0) ## Otherwise file.read() will read 0 bytes
        with sq.connect("store/lumi.db") as connection:
            cursor = connection.cursor()
            cursor.execute("PRAGMA foreign_keys = ON;")
            query = '''
            SELECT 1
            FROM uploaded_files
            WHERE session_id = ? AND file_hash = ?;
            '''
            cursor.execute(query, (session_id, hash_value))
            flag = cursor.fetchone()
        
        ## If exists return
        if flag is not None:
            return None
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
            temp.write(file.file.read())
            file_path = temp.name

        file_loader = PyPDFLoader(file_path=file_path)
        content = file_loader.load()

        docs = split_text(chunks= content, size= 1000, overlap = 100)

        embedder = get_embedding_model()

        ## Find Chroma DB and then add docs
        directory = "store/vector_db"
        db = Chroma(persist_directory=directory, embedding_function=embedder, collection_name= session_id)
        db.add_documents(docs)

        ## If its new add it to the table
        with sq.connect("store/lumi.db") as connection:
            cursor = connection.cursor()
            cursor.execute("PRAGMA foreign_keys = ON;")
            query ='''
            INSERT INTO uploaded_files (session_id, filename, file_hash, uploaded_at) VALUES
            (?, ?, ?, ?)
            '''
            cursor.execute(query, (session_id, file.filename, hash_value, datetime.now()))
            connection.commit()

        return True
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)