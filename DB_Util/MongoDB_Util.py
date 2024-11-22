import logging
from pymongo import MongoClient, errors
from dotenv import load_dotenv
import os

class MongoDBHandler:
    def __init__(self, db_name="osint_database"):
        load_dotenv()
        uri = os.getenv("MONGODB_URI")

        logging.basicConfig(
            filename="DB_logging.txt",
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s"
        )

        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection_name = "osintdata"
        
        # Create collection if it doesn't exist
        if self.collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.collection_name)
            logging.info(f"Collection '{self.collection_name}' created.")
        
        self.collection = self.db[self.collection_name]
        logging.info("Connected to MongoDB and initialized collection.")

    def insert_data(self, data):
        """Insert a single document into the collection."""
        logging.info("Attempting to insert data.")
        try:
            result = self.collection.insert_one(data)
            logging.info(f"Data inserted successfully with ID: {result.inserted_id}")
            return result.inserted_id
        except errors.PyMongoError as e:
            logging.error(f"Insert Error: {e}")
            return None

    def insert_many(self, data_list):
        """Insert multiple documents into the collection."""
        logging.info("Attempting to insert multiple documents.")
        try:
            result = self.collection.insert_many(data_list)
            logging.info(f"Inserted multiple documents successfully with IDs: {result.inserted_ids}")
            return result.inserted_ids
        except errors.PyMongoError as e:
            logging.error(f"Insert Many Error: {e}")
            return None

    def find_data(self, query={}, projection=None):
        """Find documents in the collection based on a query."""
        logging.info(f"Attempting to find documents with query: {query}")
        try:
            documents = list(self.collection.find(query, projection))
            logging.info(f"Found {len(documents)} documents matching the query.")
            return documents
        except errors.PyMongoError as e:
            logging.error(f"Find Error: {e}")
            return []

    def update_data(self, query, update, upsert=False):
        """Update documents in the collection based on a query."""
        logging.info(f"Attempting to update documents with query: {query} and update: {update}")
        try:
            result = self.collection.update_many(query, {"$set": update}, upsert=upsert)
            logging.info(f"Updated {result.modified_count} documents.")
            return result.modified_count
        except errors.PyMongoError as e:
            logging.error(f"Update Error: {e}")
            return 0
        
    def get_all_data(self):
        """Return all documents in the collection as a list of dictionaries."""
        try:
            documents = list(self.collection.find())
            return documents
        except errors.PyMongoError as e:
            logging.error(f"Get All Data Error: {e}")
            return []

    def delete_data(self, query):
        """Delete documents in the collection based on a query."""
        logging.info(f"Attempting to delete documents with query: {query}")
        try:
            result = self.collection.delete_many(query)
            logging.info(f"Deleted {result.deleted_count} documents.")
            return result.deleted_count
        except errors.PyMongoError as e:
            logging.error(f"Delete Error: {e}")
            return 0

    def find_one(self, query={}, projection=None):
        """Find a single document in the collection."""
        logging.info(f"Attempting to find a single document with query: {query}")
        try:
            document = self.collection.find_one(query, projection)
            if document:
                logging.info("Document found.")
                return document
            else:
                logging.info("No document found with the given query.")
                return None
        except errors.PyMongoError as e:
            logging.error(f"Find One Error: {e}")
            return None

    def close_connection(self):
        """Close the MongoDB client connection."""
        logging.info("Closing MongoDB connection.")
        self.client.close()
        logging.info("MongoDB connection closed.")
