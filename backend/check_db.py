import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('MONGODB_URI') or os.getenv('MONGODB_URL')
print(f"Connecting to: {uri}")
try:
    client = MongoClient(uri)
    client.admin.command('ping')
    print("PING SUCCESSFUL! Connected to MongoDB!")
    db = client.get_database('audioguard')
    print(f"Collections: {db.list_collection_names()}")
except Exception as e:
    print(f"CONNECTION ERROR: {e}")
