import os
from dotenv import load_dotenv
load_dotenv()

groq_key = os.getenv("GROQ_API_KEY")

from langchain_groq import ChatGroq
llm = ChatGroq(model="llama-3.3-70b-versatile", groq_api_key=groq_key)

def get_groq_model():
    return llm