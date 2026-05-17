import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('MONGODB_URI') or os.getenv('MONGODB_URL')
output_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db_result.txt')

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(f"Connecting to URI: {uri}\n")
    try:
        client = MongoClient(uri)
        client.admin.command('ping')
        f.write("PING SUCCESSFUL! Connected to MongoDB!\n\n")
        
        # List all databases
        databases = client.list_database_names()
        f.write(f"Databases on this cluster: {databases}\n")
        
        for db_name in databases:
            db = client.get_database(db_name)
            cols = db.list_collection_names()
            f.write(f"  Database '{db_name}' collections: {cols}\n")
            if 'users' in cols:
                count = db.users.count_documents({})
                f.write(f"    Total users in '{db_name}': {count}\n")
                # print some user emails for verification
                users_list = list(db.users.find({}, {'email': 1, 'name': 1}))
                f.write(f"    Users: {users_list}\n")
            if 'detections' in cols:
                count = db.detections.count_documents({})
                f.write(f"    Total detections in '{db_name}': {count}\n")
    except Exception as e:
        f.write(f"CONNECTION ERROR: {str(e)}\n")

print("Diagnostics written successfully to db_result.txt")
