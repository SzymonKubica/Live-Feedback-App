from datetime import datetime
import json
import os
import pymongo
from bson import json_util
from pymongo import MongoClient
from reaction import Reaction

cluster = os.environ.get('MONGODB_URI')
client = MongoClient(cluster)
db = client["lecture-feedback"]

# Find the most recent snapshot in the database
snapshot = db["snapshots"].find_one(sort=[("end", pymongo.DESCENDING)])

if snapshot is None:
    currentSnapshot = datetime.min #should be start time of meeting
else:
    currentSnapshot = snapshot['end']



# Functions for adding insights exposed to the api
def add_insight(type):
    add_entry(db, type, generate_insight("add"))

def remove_insight(type):
    add_entry(db, type, generate_insight("remove"))

# Add an insight to a table in the database
def add_entry(db, table, content):
    tb = db[table]
    tb.insert_one(content)

# Create a basic insight
def generate_insight(type):
    return {
        "type": type,
        "time": datetime.now()
    }

# Count insights of given type
def count_active(table):
    return count_active_between(table, currentSnapshot, datetime.now())

def count_active_between(table, start, end):
    add_count = count_entries(table, start, end, "add")
    remove_count = count_entries(table, start, end, "remove")
    return add_count - remove_count

def count_entries(table, start, end, type):
    return db[table].count_documents({
        "time": {
            "$gte": start,
            "$lte": end
        },
        "type":type
    })
