from store.session_store import conversation_store
from services.llm import get_groq_model
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from datetime import datetime

def create_chat_title(question: str, id: str):
    sys_message = '''
    You are an AI that generates conversation titles.

    Generate a short descriptive title for the conversation.

    Requirements:
    - 2–5 words
    - No quotation marks
    - No emojis
    - No period
    - Title Case
    - Summarize the user's intent

    Examples

    User:
    Explain Transformers simply

    Output:
    Understanding Transformers

    User:
    Help me build a RAG chatbot

    Output:
    Building a RAG Chatbot

    User:
    Improve my resume

    Output:
    Resume Review

    Return ONLY the title.
    '''

    model = get_groq_model(name= "llama-3.3-70b-versatile")

    prompt = ChatPromptTemplate.from_messages([
        ("system", sys_message),
        ("user", "{question}")
    ])

    chain = prompt|model

    response = chain.invoke({
        "question": question
    })

    conversation_store[id]["title"] = response.content
    conversation_store[id]["created_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")