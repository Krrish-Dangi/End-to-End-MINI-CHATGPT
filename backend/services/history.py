from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
import sqlite3 as sq
from datetime import datetime

def load_history(session_id: str) -> BaseChatMessageHistory:
    history = InMemoryChatMessageHistory()

    with sq.connect("store/lumi.db") as conn:
        cursor = conn.cursor()
        query = '''
        SELECT role, content FROM messages
        WHERE session_id = ?
        ORDER BY id;
        '''

        messages = cursor.execute(query, (session_id,)).fetchall()
        for row in messages:
            if row[0] == "human":
                history.add_user_message(row[1])
            else:
                history.add_ai_message(row[1])

    return history

def get_history(session_id: str):
    history = list()

    with sq.connect("store/lumi.db") as conn:
        cursor = conn.cursor()
        query = '''
        SELECT role, content FROM messages
        WHERE session_id = ?
        ORDER BY id;
        '''

        messages = cursor.execute(query, (session_id,)).fetchall()
        for role, content in messages:
            pair = dict()
            pair["type"] = role
            pair["content"] = content
            history.append(pair)

    return history

def add_history(session_id: str, human_mssg: str, ai_mssg: str):
    with sq.connect("store/lumi.db") as conn:
        cursor = conn.cursor()
        cursor.execute("PRAGMA foreign_keys = ON;")
        query = '''
        INSERT INTO messages 
        (session_id, role, content, created_at)
        VALUES
        (?, ?, ?, ?)
        '''

        messages = cursor.executemany(query, [
            (session_id, "human", human_mssg, datetime.now()),
            (session_id, "ai", ai_mssg, datetime.now())
            ])
        
        conn.commit()