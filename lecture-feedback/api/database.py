from datetime import datetime
import json
import os
import pymongo
from bson import json_util
from pymongo import MongoClient
import certifi
from reaction import Reaction
import random

snapshot = None
currentSnapshot = None
cluster = None
client = None
db = None

def initialise_database():
    global cluster 
    cluster = os.environ.get('MONGODB_URI')
    global client 
    client = MongoClient(cluster, tlsCAFile=certifi.where())
    global db 
    db = client["lecture-feedback"]


# Find the most recent snapshot in the database
def fetch_snapshot():
    global snapshot
    global currentSnapshot
    snapshot = db["snapshots"].find_one(sort=[("end", pymongo.DESCENDING)])
    if snapshot is None:
        currentSnapshot = datetime.min #should be start time of meeting
    else:
        currentSnapshot = snapshot['end']


# Functions for adding insights exposed to the api
def add_insight(type, room, sid):
    add_entry(db, type, generate_insight("add", room, sid))

def remove_insight(type, room, sid):
    add_entry(db, type, generate_insight("remove", room, sid))

# Add an insight to a table in the database
def add_entry(db, table, content):
    tb = db[table]
    tb.insert_one(content)

# Create a basic insight
def generate_insight(type, room, sid):
    return {
        "type": type,
        "room": room,
        "sid": sid,
        "time": datetime.now()
    }

# Count insights of given type
def count_active(table, room, active_students):
    return count_active_between(table, currentSnapshot, datetime.now(), room, active_students)

def count_active_between(table, start, end, room,active_students):
    add_count = count_entries(table, start, end, "add", room, active_students)
    remove_count = count_entries(table, start, end, "remove", room, active_students)
    return add_count - remove_count

# Note only counts if the student is currently connected (with associated sid)
def count_entries(table, start, end, type, room, active_students):
    return db[table].count_documents({
        "time": {
            "$gte": start,
            "$lte": end
        },
        "type":type,
        "room": room,
        "sid": {
            "$in": list(active_students)
        }

    })

def find_snapshots(room):
    return parse_mongo_json(list(db['snapshots'].find({
        "room": room
        })))

def parse_mongo_json(data):
    return json.loads(json_util.dumps(data))

#NOTE: When we end the lecture, we should also add an end time like we do here to the current
#snapshot, we also need a way of adding initial start time (can be done with start for example)
def create_new_snapshot(room):
    global currentSnapshot

    nextSnapshot = datetime.now()
    
    db["snapshots"].insert_one({
        "start":currentSnapshot, #for now
        "end": nextSnapshot,
        "summarised_data": get_summarised(currentSnapshot, nextSnapshot),
        "room": room
    })

    currentSnapshot = nextSnapshot

def get_summarised(start, end, room, active_students):
    output = {}

    for reaction in Reaction:
        output[reaction] = count_active_between(reaction, start, end, room, active_students)

    return output

# Functions for comments
def add_comment(comment, reaction, room, sid):
    db["comments"].insert_one({
        "comment": comment,
        "reaction": reaction,
        "time": datetime.now(),
        "room": room,
        "sid": sid
    })

def get_comments_between(start, end, room, active_students):
    comments = db["comments"].find({
        "time": {
            "$gte": start,
            "$lte": end
        },
        "room": room,
        "sid": {
            "$in": list(active_students)
        }
    })

    parsed_comments = []
    for comment in comments:
        parsed_comments.append({"comment":comment["comment"], "reaction":comment["reaction"]})
    return parsed_comments

def get_current_comments(room, active_students):
    return get_comments_between(currentSnapshot, datetime.now(), room, active_students)


def get_new_code():
    def gen_code(): return random.randrange(10**(6-1),10**6)
    
    code = gen_code()
    
    while add_active_code(code):
        code = gen_code()

    return code

# Adds code to database as active, if it already exists, returns false
# probably not thread safe
def add_active_code(code: int):
    is_new_code = 0 == db["active_codes"].count_documents({
            "code": code
        })


    if is_new_code:
        db["active_codes"].insert_one({"code": code})

    return not is_new_code

def is_active_code(code: int):
    return db["active_codes"].find_one({"code":code}) is not None
    