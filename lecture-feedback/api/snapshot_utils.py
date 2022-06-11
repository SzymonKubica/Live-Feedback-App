import json
from reaction import Reaction
from bson import json_util
from database import count_active_between, db, snapshot, currentSnapshot
from datetime import datetime
import pymongo


def find_snapshots():
    return parse_mongo_json(list(db['snapshots'].find({})))

def parse_mongo_json(data):
    return json.loads(json_util.dumps(data))

#NOTE: When we end the lecture, we should also add an end time like we do here to the current
#snapshot, we also need a way of adding initial start time (can be done with start for example)
def create_new_snapshot():
    global currentSnapshot

    nextSnapshot = datetime.now()
    
    db["snapshots"].insert_one({
        "start":currentSnapshot, #for now
        "end": nextSnapshot,
        "summarised_data": get_summarised(currentSnapshot, nextSnapshot)
    })

    currentSnapshot = nextSnapshot

def get_summarised(start, end):
    output = {}

    for reaction in Reaction:
        output[reaction] = count_active_between(reaction, start, end)

    return output