from datetime import datetime, timedelta
import json
import operator
import os
import pymongo
from bson import json_util
from pymongo import MongoClient
import certifi
from reaction import Reaction, getString
import random
import json

# snapshot = None
current_room_snapshot = {}
cluster = None
client = None
db = None

with open('empty.json') as f:
   empty_directory = json.load(f)

def initialise_database():
    global cluster 
    cluster = os.environ.get('MONGODB_URI')
    global client 
    client = MongoClient(cluster, tlsCAFile=certifi.where())
    global db 
    db = client["lecture-feedback"]


# Find the most recent snapshot in the database
# time is passed on initial fetch when new code genreated
def fetch_snapshot(room, time=None):
    # global snapshot
    global current_room_snapshot
    snapshot = db["snapshots"].find_one(
        {
            "room":room
        }
        ,sort=[("end", pymongo.DESCENDING)])
    if snapshot is None:
        current_room_snapshot[room] = datetime.min #safety coz code trash
    elif time is not None:
        current_room_snapshot[room] = time 
    else:
        current_room_snapshot[room] = snapshot['end']


# Functions for adding insights exposed to the api
def add_insight(type, room, sid):
    add_entry(db, type, generate_insight("add", room, sid))

def remove_insight(type, room, sid):
    add_entry(db, type, generate_insight("remove", room, sid))


def parse_datetime(date_string):
    return datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%S.%fZ")
def remove_pending_reaction(room, sid):
    reactions = []
    time_to_reaction = {}
    for reaction in Reaction:
        last_entry = find_latest_reaction_in(room, sid, reaction)
        if last_entry != None:
            reactions.append(last_entry)
            time_to_reaction[last_entry["time"]["$date"]] = reaction
        
    
    if reactions != []:
        reactions = sorted(reactions, key = lambda i: parse_datetime(i["time"]["$date"]) , reverse=True)
        latest_interaction = reactions[0]
        if(latest_interaction["type"] == "add"):
            remove_insight(getString(time_to_reaction[latest_interaction["time"]["$date"]]), room, sid)

def find_latest_reaction_in(room, sid, reaction):
        last_entry = parse_mongo_json((db[getString(reaction)].find_one({
            "room": room,
            "sid": sid
        }, sort=[("time", pymongo.DESCENDING)])))
        return last_entry


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
def count_active(table, room):
    return count_active_between(table, current_room_snapshot[room], datetime.now(), room)

def count_active_between(table, start, end, room):
    add_count = count_entries(table, start, end, "add", room)
    remove_count = count_entries(table, start, end, "remove", room)
    return add_count - remove_count

# Note only counts if the student is currently connected (with associated sid)
def count_entries(table, start, end, type, room):
    return db[table].count_documents({
        "time": {
            "$gte": start,
            "$lte": end
        },
        "type":type,
        "room": room,
    })

def find_snapshots(room):
    return parse_mongo_json(list(db['snapshots'].find({
        "room": room
        })))

def get_reset_snaphosts(room):
    print(find_snapshots(room))

def parse_mongo_json(data):
    return json.loads(json_util.dumps(data))

#NOTE: When we end the lecture, we should also add an end time like we do here to the current
#snapshot, we also need a way of adding initial start time (can be done with start for example)
def create_new_snapshot(room, active_students):
    # global currentSnapshot
    currnet_snapshot = current_room_snapshot[room]

    next_snapshot = datetime.now()
    
    db["snapshots"].insert_one({
        "start":currnet_snapshot, #for now
        "end": next_snapshot,
        "summarised_data": get_summarised(currnet_snapshot, next_snapshot, room),
        "room": room
    })

    current_room_snapshot[room] = next_snapshot

def get_summarised(start, end, room):
    output = {}

    for reaction in Reaction:
        output[reaction] = count_active_between(reaction, start, end, room)

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
        parsed_comments.append({"comment":comment["comment"], "reaction":comment["reaction"], "time":comment["time"]})
    return parsed_comments
    

def get_all_comments(room):
    comments = db["comments"].find({
        "room": room
    })

    parsed_comments = []
    for comment in comments:
        parsed_comments.append({"comment":comment["comment"], "reaction":comment["reaction"], "time":comment["time"]})
    return parsed_comments
    

def get_current_comments(room, active_students):
    return get_comments_between(current_room_snapshot[room], datetime.now(), room, active_students)


def get_new_code(email, time):
    def gen_code(): return str(random.randrange(10**(6-1),10**6))
    
    code = gen_code()
    
    while add_active_code(code, email, time):
        code = gen_code()

    return code

# Adds code to database as active, if it already exists, returns false
# probably not thread safe
def add_active_code(code, email, time):
    is_new_code = 0 == db["active_codes"].count_documents({
            "code": code
        })


    if is_new_code:
        db["active_codes"].insert_one(
            {
                "code": code,
                "email": email,
                "start_time": time,
                "end_time": None,
                "ended": False
            })

    return not is_new_code

def end_presentation(code):
    db["active_codes"].update_one({"code":code}, {"$set": {"ended": True, "end_time": datetime.now()}}, upsert=False)

def get_start_time(code):
    return db["active_codes"].find_one({"code":code})["start_time"]

def get_end_time(code):
    return db["active_codes"].find_one({"code":code})["end_time"]

def is_active_code(code):
    ## need to update this to take into account ended
    found = db["active_codes"].find_one({"code":code})
    return found is not None and not found["ended"]

def user_exists(email) -> bool:
    return db["users"].find_one({"email":email}) is not None

def store_new_user(email, hash):
    db["users"].insert_one({
        "email": email,
        "hash": hash
    })

    db["saved_presentations"].insert_one({
        "directory": empty_directory,
        "email": email
    })

def get_user(email):
    return db["users"].find_one({"email": email})

def room_owner(code, email) -> bool:
    return db["active_codes"].find_one({"code":code, "email":email}) is not None

def get_presentation_directory(email):
    return db["saved_presentations"].find_one({
        "email": email
    })["directory"]

def set_presentation_directory(email, new_directory):
    db["saved_presentations"].update_one(
        {"email":email}, 
        {"$set": {"directory": new_directory}}, 
        upsert=False)


def set_video_link(code, link):
    db["active_codes"].update_one(
        {"code":code}, 
        {"$set": {"video_link": link}}, 
        upsert=False)

def get_video_link(code):
    req = db["active_codes"].find_one({"code": code})
    if "video_link" in req:
        return req["video_link"]
    return ""

def set_custom_reaction(room, reaction):
    custom_reaction = reaction ## make sure not none and map it or something
    db["active_codes"].update_one(
        {"code":room}, 
        {"$set": {"custom_reaction": custom_reaction}}, 
        upsert=False)

def get_custom_reaction(room):
    return db["active_codes"].find_one({"code":room})["custom_reaction"]