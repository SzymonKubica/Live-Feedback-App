from reaction import Reaction
from flask import Flask
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit
import json
from dotenv import load_dotenv
import database
from snapshot_utils import create_new_snapshot, find_snapshots

load_dotenv()

app = Flask(__name__, static_folder='../build', static_url_path='/')

app.config['SECRET_KEY'] = 'mysecret'

CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

studentCount = 0

# When there is a 404, we send it to react so it can deal with it
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")

@app.route("/")
@cross_origin()
def index():
    return app.send_static_file("index.html")

@app.route("/api/create-snapshot")
@cross_origin()
def create_snapshot():

    create_new_snapshot()
    update_counts()
    reset_buttons()

    print("created snapshot")
    return None

def update_counts():
    for reaction in Reaction:
        update_reaction_count(reaction)

    emit("update students connected", {"count":studentCount})

def reset_buttons():
    socketio.emit("reset buttons", broadcast=True)

@app.route("/api/snapshots")
@cross_origin()
def get_snapshots():
    snapshots = find_snapshots()

    return {"snapshots":snapshots}

@socketio.on('connect')
def test_connect():
    print("connected")
    update_counts()

@socketio.on('disconnect')
def test_disconnect():
    print("disconnected")

@socketio.on('connect teacher')
def handle_message():
    update_counts()

@socketio.on('connect student') 
def handle_message():
    global studentCount
    studentCount += 1
    print("student connected")
    emit("update students connected", {"count":studentCount}, broadcast=True)

@socketio.on('disconnect student') 
def handle_message():
    global studentCount
    studentCount -= 1
    emit("update students connected", {"count":studentCount}, broadcast=True)

@socketio.on("add reaction")
def handle_reaction(reaction):
    database.add_insight(reaction)
    update_reaction_count(reaction)

@socketio.on("remove reaction")
def handle_reaction(reaction):
    database.remove_insight(reaction)
    update_reaction_count(reaction)
    
def update_reaction_count(reaction):
    emit(
        "update " + reaction, 
        {"count":database.count_active(reaction)}, 
        broadcast=True)

@socketio.on("confused")
def handle_message():
    database.add_insight("confused")
    emit("update confused", {"count":database.count_active("confused")}, broadcast=True)
    # return None

@socketio.on("no longer confused")
def handle_message():
    database.remove_insight("confused")
    emit("update confused", {"count":database.count_active("confused")}, broadcast=True)

    # return None

@socketio.on("good")
def handle_message():
    database.add_insight("good")
    emit("update good", {"count":database.count_active("good")}, broadcast=True)
    # return None

@socketio.on("no longer good")
def handle_message():
    database.remove_insight("good")
    emit("update good", {"count":database.count_active("good")}, broadcast=True)
    # return None

@socketio.on("too-fast")
def handle_message():    
    database.add_insight("too-fast")
    emit("update too fast", {"count":database.count_active("too-fast")}, broadcast=True)
    # return None

@socketio.on("no longer too-fast")
def handle_message():
    database.remove_insight("too-fast")
    emit("update too-fast", {"count":database.count_active("too-fast")}, broadcast=True)
    # return None

@socketio.on("chilling")
def handle_message():
    database.add_insight("chilling")
    emit("update chilling", {"count":database.count_active("chilling")}, broadcast=True)
    # return None

@socketio.on("no longer chilling")
def handle_message():    
    database.remove_insight("chilling")
    emit("update chilling", {"count":database.count_active("chilling")}, broadcast=True)
    # return None

@socketio.on("create snapshot")
def handle_message():
    create_new_snapshot()
    # need to update counts now
    update_counts()
    #reset buttons
    socketio.emit("reset buttons", broadcast=True)

if __name__ == "__main__":
    socketio.run()
