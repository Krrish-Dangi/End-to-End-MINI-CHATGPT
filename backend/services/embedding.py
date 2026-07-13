import os
from dotenv import load_dotenv
load_dotenv()
os.environ["HF_KEY"] = os.getenv("HF_KEY")

from langchain_huggingface import HuggingFaceEmbeddings

model = HuggingFaceEmbeddings(model = "Qwen/Qwen3-Embedding-0.6B")

def get_embedding_model():
    return model