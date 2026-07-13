import sqlite3 as sq
import os

def initialize_database():
    os.makedirs("store", exist_ok=True)
    connection = sq.connect("store/lumi.db")
    try:
        cursor = connection.cursor()

        cursor.execute("PRAGMA foreign_keys = ON;")

        creation_query = '''CREATE TABLE IF NOT EXISTS conversations(
            session_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            title TEXT NOT NULL
        );'''

        cursor.execute(creation_query)

        creation_query = '''CREATE TABLE IF NOT EXISTS messages(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('human','ai')),
            content TEXT NOT NULL,
            created_at DATETIME NOT NULL,

            FOREIGN KEY(session_id)
                REFERENCES conversations(session_id)
                ON DELETE CASCADE
            );'''
        
        cursor.execute(creation_query)

        creation_query = '''CREATE TABLE IF NOT EXISTS uploaded_files(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            filename TEXT NOT NULL,
            file_hash TEXT NOT NULL,
            uploaded_at DATETIME NOT NULL,

            FOREIGN KEY(session_id)
                REFERENCES conversations(session_id)
                ON DELETE CASCADE
            );'''
        
        cursor.execute(creation_query)

        connection.commit()
        return True
    except Exception as e:
        raise Exception(e)
    finally:
        connection.close()