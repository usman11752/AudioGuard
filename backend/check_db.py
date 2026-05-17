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
    
    # List all databases
    databases = client.list_database_names()
    print(f"Databases on this cluster: {databases}")
    
    for db_name in databases:
        db = client.get_database(db_name)
        print(f"  Database '{db_name}' collections: {db.list_collection_names()}")
        if 'users' in db.list_collection_names():
            print(f"    Total users in '{db_name}': {db.users.count_documents({})}")
            
except Exception as e:
    print(f"CONNECTION ERROR: {e}")
