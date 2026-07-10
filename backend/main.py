from fastapi import FastAPI
from api.chat import chat_router
from api.upload import upload_router

app = FastAPI()
app.include_router(chat_router)
app.include_router(upload_router)