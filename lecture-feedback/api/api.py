from reaction import Reaction, getString
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from dotenv import load_dotenv
from datetime import datetime, timedelta
import database

load_dotenv()

app = Flask(__name__, static_folder="../build", static_url_path="/")

app.config["SECRET_KEY"] = "mysecret"

CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

studentCount = 0

database.initialise_database()
database.fetch_snapshot()

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

    database.create_new_snapshot()
    update_counts()
    reset_buttons()

    print("created snapshot")
    return None

def update_counts():
    for reaction in Reaction:
        update_reaction_count(reaction)

    # print("hi")
    emit("update students connected", {"count":studentCount})

def reset_buttons():
    emit("reset buttons", broadcast=True)

def in_room(room):
    return room in socketio.server.rooms(request.sid)

@app.route("/api/snapshots")
@cross_origin()
def get_snapshots():
    snapshots = database.find_snapshots()

    return {"snapshots":snapshots}

@socketio.on("connect")
def test_connect():
    print("connected")
    update_counts()

@socketio.on("disconnect")
def test_disconnect():
    global studentCount
    # Hacky for now, need a way to keep track of all of these nicely
    # print(socketio.server.rooms(request.sid))
    if in_room("student"):
        studentCount -= 1
        emit("update students connected", {"count":studentCount}, broadcast=True)

    print("disconnected")

#for now, since one room, we will call the room student
@socketio.on("join")
def on_join(data):
    global studentCount
    room = data['room']
    if room == "student" and not in_room("student"):
        studentCount += 1
        emit("update students connected", {"count":studentCount}, broadcast=True)
    join_room(room)
    print("joined room")

@socketio.on("leave")
def on_leave(data):
    global studentCount
    room = data['room']
    if room == "student" and in_room("student"):
        studentCount -= 1
        emit("update students connected", {"count":studentCount}, broadcast=True)
    leave_room(room)
    print("left room")
####

@socketio.on("connect teacher")
def handle_message():
    update_counts()
    update_all_reactions()

@socketio.on("connect student") 
def handle_message():
    global studentCount
    studentCount += 1
    print("student connected")
    emit("update students connected", {"count":studentCount}, broadcast=True)

@socketio.on("disconnect student") 
def handle_message():
    global studentCount
    studentCount -= 1
    emit("update students connected", {"count":studentCount}, broadcast=True)

@socketio.on("add reaction")
def handle_reaction(reaction):
    database.add_insight(reaction)
    database.save_totals()
    update_reaction_count(reaction)
    update_all_reactions()

@socketio.on("update line graph")
def handle_message():
    emit("update line graph", get_graph_data(), broadcast=True)

graph_data = None
def get_graph_data():
    global graph_data
    if not graph_data:
        graph_data = fetch_graph_data()
    else:
        totals = database.get_totals_for(datetime.now())
        for reaction in Reaction:
            graph_data[getString(reaction)] = graph_data[getString(reaction)][1:] + [totals[reaction]]

    return graph_data

def fetch_graph_data():
    request_time = datetime.now()
    data = {}

    for reaction in Reaction:
        data[reaction] = []

    for i in range (21):
        totals = database.get_totals_for(request_time - timedelta(seconds = 30 * i))
        for reaction in Reaction:
            data[getString(reaction)] = [totals[reaction]] + data[getString(reaction)]
    return data

@socketio.on("remove reaction")
def handle_reaction(reaction):
    database.remove_insight(reaction)
    database.save_totals()
    update_reaction_count(reaction)
    update_all_reactions()
    
def update_reaction_count(reaction):
    emit(
        "update " + reaction, 
        {"count":database.count_active(reaction)}, 
        broadcast=True)

def update_all_reactions():
    output = {}
    for reaction in Reaction:
        output[reaction] = database.count_active(reaction)
    emit("update all", output, broadcast=True)

@app.route("/api/reaction-count", methods=['POST'])
@cross_origin()
def get_reaction_count():
        # also add room later on
        reaction = request.json["reaction"]
        return {"count":database.count_active(reaction)}

@app.route("/api/student-count", methods=['POST'])
@cross_origin()
def get_student_count():
        # also add room later on
        # reaction = request.json["reaction"]
        return {"count":studentCount}

@app.route("/api/all_reactions", methods=['POST'])
@cross_origin()
def get_all_reactions():
        # also add room later on
        output = {}
        for reaction in Reaction:
            output[reaction] = database.count_active(reaction)
        print (output)
        return output

@app.route("/api/line_graph_data", methods=['POST'])
@cross_origin()
def send_graph_data():
    return get_graph_data()

@socketio.on("create snapshot")
def handle_message():
    database.create_new_snapshot()
    # need to update counts now
    update_counts()
    update_all_reactions()
    #reset buttons
    socketio.emit("reset buttons", broadcast=True)

@app.route("/api/leave-comment", methods=['PUT'])
@cross_origin()
def add_comment():
        # also add room later on
        comment = request.json["comment"]
        # when we actually associate them with reactions
        reaction = request.json["reaction"]
        database.add_comment(comment, reaction)
        socketio.emit("update comments", broadcast=True)
        return {"success":True}

@app.route("/api/get-comments")
@cross_origin()
def get_comments():
        # also add room later on
        return {"comments": database.get_current_comments()}

if __name__ == "__main__":
    socketio.run()
