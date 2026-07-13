from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.chat import chat_router
from api.upload import upload_router
from services.Database import initialize_database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

initialize_database()

app.include_router(chat_router)
app.include_router(upload_router)