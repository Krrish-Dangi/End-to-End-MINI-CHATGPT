import os
from dotenv import load_dotenv
load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

from langchain_groq import ChatGroq

def get_groq_model(name: str):
    llm = ChatGroq(model=name, groq_api_key=groq_api_key)
    return llm