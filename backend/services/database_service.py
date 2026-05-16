import os
import bcrypt
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class DatabaseService:
    def __init__(self):
        self.uri = os.getenv('MONGODB_URI')
        self.client = None
        self.db = None
        self.collection = None
        self.users = None
        
        if self.uri:
            try:
                self.client = MongoClient(self.uri)
                # Test connection
                self.client.admin.command('ping')
                self.db = self.client.get_database('AudioGuard')
                self.collection = self.db.detections
                self.users = self.db.users
                print("Successfully connected to MongoDB!")
            except Exception as e:
                print(f"Failed to connect to MongoDB: {e}")
        else:
            print("MONGODB_URI not found in environment variables.")

    # Detection/History Methods
    def save_detection(self, result, filename, detection_type='upload'):
        """Save a detection result to MongoDB."""
        if self.collection is None:
            return None
            
        try:
            document = {
                "timestamp": datetime.utcnow(),
                "filename": filename,
                "is_fake": result.get('is_fake'),
                "confidence": result.get('confidence'),
                "label": result.get('label'),
                "type": detection_type,
                "metadata": {
                    "duration": result.get('metadata', {}).get('duration'),
                    "sample_rate": result.get('metadata', {}).get('sample_rate')
                }
            }
            
            inserted_id = self.collection.insert_one(document).inserted_id
            print(f"Saved detection to database with ID: {inserted_id}")
            return str(inserted_id)
        except Exception as e:
            print(f"Error saving to MongoDB: {e}")
            return None

    def get_history(self, limit=50):
        """Retrieve detection history from MongoDB."""
        if self.collection is None:
            return []
            
        try:
            cursor = self.collection.find().sort("timestamp", -1).limit(limit)
            history = []
            for doc in cursor:
                doc['_id'] = str(doc['_id'])
                doc['timestamp'] = doc['timestamp'].isoformat()
                history.append(doc)
            return history
        except Exception as e:
            print(f"Error fetching history from MongoDB: {e}")
            return []

    # User Management Methods
    def register_user(self, name, email, password):
        """Register a new user in MongoDB."""
        if self.users is None:
            return {"error": "Database not connected"}
            
        try:
            # Check if user already exists
            if self.users.find_one({"email": email}):
                return {"error": "Email already registered"}
            
            # Hash password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            
            user_doc = {
                "name": name,
                "email": email,
                "password": hashed_password,
                "created_at": datetime.utcnow(),
                "profile_pic": None
            }
            
            inserted_id = self.users.insert_one(user_doc).inserted_id
            print(f"User registered successfully: {email}")
            return {"success": True, "user_id": str(inserted_id)}
        except Exception as e:
            print(f"Error registering user: {e}")
            return {"error": str(e)}

    def authenticate_user(self, email, password):
        """Authenticate a user and return user data."""
        if self.users is None:
            return None
            
        try:
            user = self.users.find_one({"email": email})
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
                return {
                    "id": str(user['_id']),
                    "name": user['name'],
                    "email": user['email'],
                    "profile_pic": user.get('profile_pic')
                }
            return None
        except Exception as e:
            print(f"Error authenticating user: {e}")
            return None

# Singleton instance
db_service = DatabaseService()
