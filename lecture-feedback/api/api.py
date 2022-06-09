from flask import Flask
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit
from datetime import datetime
import pymongo
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='../build', static_url_path='/')

app.config['SECRET_KEY'] = 'mysecret'

CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

cluster = os.environ.get('MONGODB_URI')
client = MongoClient(cluster)
db = client["lecture-feedback"]

studentCount = 0

snapshot = db["snapshots"].find_one(sort=[("end", pymongo.DESCENDING)])
if snapshot is None:
    currentSnapshot = datetime.min #should be start time of meeting
else:
    currentSnapshot = snapshot['end']

# logs when insight is added
def add_insight(db, table, content):
    tb = db[table]
    tb.insert_one(content)

# creates a basic insight
def generate_insight(type):
        return {
        "type": type,
        "time": datetime.now()
    }

#counts insights
def count_active(db, table):
    # add_count = db[table].count_documents({"type":"add"})
    # remove_count = db[table].count_documents({"type":"remove"})

    # return add_count - remove_count
    return count_active_between(table, currentSnapshot, datetime.now())

def count_active_between(table, start, end):
    # is there a cleaner way?
    add_count = db[table].count_documents({
        "time": {
            "$gte": start,
            "$lte": end
        },
        "type":"add"
    })

    remove_count = db[table].count_documents({
        "time": {
            "$gte": start,
            "$lte": end
        },
        "type":"remove"
    })

    return add_count - remove_count

def get_summarised(start, end):
    good = count_active_between("good", start, end)

    confused = count_active_between("confused", start, end)

    too_fast = count_active_between("too-fast", start, end)

    chilling = count_active_between("chilling", start, end)

    return {
        "good": good,
        "confused": confused,
        "too-fast": too_fast,
        "chilling": chilling
    }



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

    # need to update counts now
    updateAll()

    #reset buttons
    socketio.emit("reset buttons", broadcast=True)


# When there is a 404, we send it to react so it can deal with it
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")

@app.route("/")
@cross_origin()
def index():
    return app.send_static_file("index.html")

@app.route("/test")
@cross_origin()
def test():
    import random
    return {"test":random.randint(0,100)}

@app.route("/api/create-snapshot")
@cross_origin()
def create_snapshot():
    create_new_snapshot()
    print("created snapshot")
    return None

@socketio.on('connect')
def test_connect():
    print("connected")

def updateAll():
    emit("update confused", {"count":count_active(db, "confused")})
    emit("update good", {"count":count_active(db, "good")})
    emit("update too fast", {"count":count_active(db, "too-fast")})
    emit("update chilling", {"count":count_active(db, "chilling")})
    emit("update students connected", {"count":studentCount})



@socketio.on('connect')
def test_connect():
    print("connected")
    updateAll()
@socketio.on('connect teacher')
def handleMessage():
    updateAll()


@socketio.on('connect student') 
def handleMessage():
    global studentCount
    studentCount += 1
    print("student connected")
    emit("update students connected", {"count":studentCount}, broadcast=True)

@socketio.on('disconnect student') 
def handleMessage():
    global studentCount
    studentCount -= 1
    print("student connected")
    emit("update students connected", {"count":studentCount}, broadcast=True)

@socketio.on('disconnect')
def test_disconnect():
    print("disconnected")


@socketio.on("confused")
def handleMessage():
    add_insight(db, "confused", generate_insight("add"))
    emit("update confused", {"count":count_active(db, "confused")}, broadcast=True)
    # return None

@socketio.on("no longer confused")
def handleMessage():
    add_insight(db, "confused", generate_insight("remove"))
    emit("update confused", {"count":count_active(db, "confused")}, broadcast=True)

    # return None

@socketio.on("good")
def handleMessage():
    add_insight(db, "good", generate_insight("add"))
    emit("update good", {"count":count_active(db, "good")}, broadcast=True)
    # return None

@socketio.on("no longer good")
def handleMessage():
    add_insight(db, "good", generate_insight("remove"))
    emit("update good", {"count":count_active(db, "good")}, broadcast=True)
    # return None

@socketio.on("too fast")
def handleMessage():    
    add_insight(db, "too-fast", generate_insight("add"))
    emit("update too fast", {"count":count_active(db, "too-fast")}, broadcast=True)
    # return None

@socketio.on("no longer too fast")
def handleMessage():
    add_insight(db, "too-fast", generate_insight("remove"))
    emit("update too fast", {"count":count_active(db, "too-fast")}, broadcast=True)
    # return None

@socketio.on("chilling")
def handleMessage():
    add_insight(db, "chilling", generate_insight("add"))
    emit("update chilling", {"count":count_active(db, "chilling")}, broadcast=True)
    # return None

@socketio.on("no longer chilling")
def handleMessage():    
    add_insight(db, "chilling", generate_insight("remove"))
    emit("update chilling", {"count":count_active(db, "chilling")}, broadcast=True)
    # return None

@socketio.on("create snapshot")
def handleMessage():
    create_new_snapshot()


if __name__ == "__main__":
    socketio.run()
