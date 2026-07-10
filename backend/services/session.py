from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from store.session_store import history_store

def get_history(id: str) -> BaseChatMessageHistory:
    if id not in history_store:
        history_store[id] = InMemoryChatMessageHistory()
    return history_store[id]