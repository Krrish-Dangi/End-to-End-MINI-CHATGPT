from langchain_classic.text_splitter import RecursiveCharacterTextSplitter

def split_text(chunks, size = 1000, overlap = 100):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size= size, chunk_overlap= overlap)
    docs = text_splitter.split_documents(chunks)
    return docs