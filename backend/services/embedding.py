import os
from dotenv import load_dotenv
load_dotenv()
os.environ["HF_KEY"] = os.getenv("HF_KEY")

from langchain_huggingface import HuggingFaceEmbeddings

def get_embedding_model(name: str):
    model = HuggingFaceEmbeddings(model=name)
    return model