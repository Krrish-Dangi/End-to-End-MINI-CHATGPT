from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from store.session_store import conversation_store

def get_history(id: str) -> BaseChatMessageHistory:
    if id not in conversation_store:
        conversation_store[id] = {
            "history" : InMemoryChatMessageHistory()
        }
    return conversation_store[id]["history"]