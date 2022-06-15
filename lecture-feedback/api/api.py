from reaction import Reaction, getString
from flask import Flask, request, session
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from dotenv import load_dotenv
from datetime import datetime, timedelta
import database
from flask_session import Session

load_dotenv()

app = Flask(__name__, static_folder="../build", static_url_path="/")

app.config['SESSION_TYPE'] = 'filesystem'
app.config["SECRET_KEY"] = "mysecret"

CORS(app)
Session(app)

socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)


student_room_counts = {} #stores the number of students in each room
students_sid = set() #stores the socket id of all active students
sid_to_room = {} # map from sid to room
studentCount = 0

database.initialise_database()

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
    room = sid_to_room[request.sid]
    database.create_new_snapshot(room, students_sid)
    update_counts(room)
    reset_buttons(room)

    print("created snapshot")
    return None

def update_counts(room):
    for reaction in Reaction:
        update_reaction_count(reaction, room)

    # print("hi")
    emit("update students connected", {"count":studentCount})

def reset_buttons(room):
    emit("reset buttons", to=room)

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
    print(request.sid)
    # update_counts()

@socketio.on("disconnect")
def test_disconnect():
    if request.sid in students_sid:
        room = sid_to_room[request.sid]
        student_room_counts[room] -= 1
        emit("update students connected", {"count":student_room_counts[room]}, to=room)
        students_sid.remove(request.sid)
        #sid_to_room.pop(request.sid)
        update_all_reactions(room)
        print("student disconnected")
    else:
        print("teacher disconnected")

@socketio.on("join")
def on_join(data):
    room = data['room']

    sid_to_room[request.sid] = room
    
    if data['type'] == "student":
        students_sid.add(request.sid)
        student_room_counts[room] += 1
        emit("update students connected", {"count":student_room_counts[room]}, to=room)

    # need to remember to remove these rooms from counts when meeting ended otherwise we
    # will have wrong data saved over

    if data['type'] == "teacher" and room not in student_room_counts:
        student_room_counts[room] = 0 # intialise the room to 0

    session["type"] = data["type"] # stores student or teacher
    session["room"] = room
    join_room(room)
    print("{} joined room".format(data["type"]))

@socketio.on("leave")
def on_leave(data):
    room = data['room']

    if request.sid in students_sid:
        student_room_counts[room] -= 1
        students_sid.remove(request.sid)
        sid_to_room.pop(request.sid)
        emit("update students connected", {"count":student_room_counts[room]}, to=room)
        update_all_reactions(room)

    leave_room(room)
    if request.sid in students_sid:
        session.pop("room") # since they have now left the meeting
    print("left room")

@socketio.on("add reaction")
def handle_reaction(reaction, room):
    sid = request.sid
    database.add_insight(reaction, room, sid)
    #database.save_totals(room, students_sid) ## need to rewrite this to consider rooms
    update_reaction_count(reaction, room)
    update_all_reactions(room)

@socketio.on("update line graph")
def handle_message():
    room = sid_to_room[request.sid]
    emit("update line graph", get_graph_data(room), broadcast=True)

graph_data = None
def get_graph_data(room):
    global graph_data
    if not graph_data:
        graph_data = fetch_graph_data(room)
    else:
        totals = database.get_totals_for(datetime.now(), room)
        for reaction in Reaction:
            if totals == None:
                new_entry = [0]
            else: 
                new_entry = [totals[reaction]]

            graph_data[getString(reaction)] = graph_data[getString(reaction)][1:] + new_entry

    return graph_data

REFRESH_INTERVAL = 10 # seconds
def fetch_graph_data(room):
    request_time = datetime.now()
    data = {}

    for reaction in Reaction:
        data[reaction] = []

    for i in range (21):
        totals = database.get_totals_for(request_time - timedelta(seconds = REFRESH_INTERVAL * i), room)
        for reaction in Reaction:
            if totals == None:
               new_entry = [0]
            else:
               new_entry = [totals[reaction]]

            data[getString(reaction)] = new_entry + data[getString(reaction)]
    return data

@socketio.on("remove reaction")
def handle_reaction(reaction, room):
    sid = request.sid
    database.remove_insight(reaction, room, sid)
    #database.save_totals(room, sid) ## need to rewrite this also
    update_reaction_count(reaction, room)
    update_all_reactions(room)
    
def update_reaction_count(reaction, room):
    emit(
        "update " + reaction, 
        {"count":database.count_active(reaction, room, students_sid)}, 
        to=room)

def update_all_reactions(room):
    output = {}
    for reaction in Reaction:
        output[reaction] = database.count_active(reaction, room, students_sid)
    emit("update all", output, to=room)
    emit("update line graph", to=room)

@app.route("/api/reaction-count", methods=['POST'])
@cross_origin()
def get_reaction_count():
        # also add room later on
        reaction = request.json["reaction"]
        room = request.json["room"]
        return {"count":database.count_active(reaction, room, students_sid)}

@app.route("/api/student-count", methods=['POST'])
@cross_origin()
def get_student_count():
        room = request.json["room"]
        # weird bug where not initially initialised? will need to fix this
        if room in student_room_counts:
            count = student_room_counts[room]
        else:
            count = 0
        return {"count":count}

@app.route("/api/all_reactions", methods=['POST'])
@cross_origin()
def get_all_reactions():
        room = request.json["room"]
        output = {}
        for reaction in Reaction:
            output[reaction] = database.count_active(reaction, room, students_sid)
        print (output)
        return output

@app.route("/api/line_graph_data", methods=['POST'])
@cross_origin()
def send_graph_data():
    room = request.json["room"]
    return get_graph_data(room)

@socketio.on("create snapshot")
def handle_message():
    room = sid_to_room[request.sid]
    database.create_new_snapshot(room, students_sid)
    # need to update counts now
    update_counts(room)
    update_all_reactions(room)
    #reset buttons
    socketio.emit("reset buttons", to=room)

@socketio.on("leave comment")
def add_comment(comment, reaction, room):
    sid = request.sid
    database.add_comment(comment, reaction, room, sid)
    socketio.emit("update comments", to=room)
    return {"success":True}

@app.route("/api/get-comments", methods=['POST'])
@cross_origin()
def get_comments():
        room = request.json["room"]
        comments = database.get_current_comments(room, students_sid)
        print(comments)
        return {"comments": comments}


# code stuff
@app.route("/api/new-code")
@cross_origin()
def get_new_code():
    code = database.get_new_code()
    database.fetch_snapshot(str(code))   
    return {"code":code}

@app.route("/api/is-code-active", methods=['POST'])
@cross_origin()
def is_code_active():
    code = request.json['code']
    return {"valid":database.is_active_code(code)}
    


if __name__ == "__main__":
    socketio.run()
