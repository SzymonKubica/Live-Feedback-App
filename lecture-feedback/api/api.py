import functools
from flask import Flask, jsonify, request, session
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask_session import Session
from dotenv import load_dotenv
from datetime import datetime, timedelta
import bcrypt

# Our modules
import database
import line_graph
from reaction import Reaction, getString
import analysis_graph

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
line_graph.initialise_graph_data(data_points=21)

# When there is a 404, we send it to react so it can deal with it
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")

@app.route("/")
@cross_origin()
def index():
    return app.send_static_file("index.html")

# Decorator to ensurer a user is logged in
def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        if "logged_in_email" not in session:
            return jsonify({"error":"unauthorised"}), 401
        return func(*args, **kwargs)
    return secure_function

def reset_buttons(room):
    emit("reset buttons", to=room)

def in_room(room):
    return room in socketio.server.rooms(request.sid)

@socketio.on("connect")
def test_connect():
    print("connected")
    print(request.sid)

@socketio.on("disconnect")
def test_disconnect():
    if request.sid in students_sid:
        room = sid_to_room[request.sid]
        student_room_counts[room] -= 1
        students_sid.remove(request.sid)
        database.remove_pending_reaction(room, request.sid)
        sid_to_room.pop(request.sid)
        update(room)
        print("student disconnected")
    else:
        # TODO: Add some handling for the case when a teacher was disconnected due to some error
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
        database.remove_pending_reaction(request.sid, room)
        update(room)
        leave_room(room)
        session.pop(room)

    # TODO: figure out what to do for lecturers
    #leave_room(room)
    #session.pop(room) # since they have now left the meeting
    print("left room")

@socketio.on("add reaction")
def handle_reaction(reaction, room):
    sid = request.sid
    database.add_insight(reaction, room, sid)
    update(room)

@socketio.on("update line graph")
@login_required
def handle_message():
    room = sid_to_room[request.sid]
    emit("update line graph", line_graph.room_to_graph_data[room], to=room)



@socketio.on("remove reaction")
def handle_reaction(reaction, room):
    sid = request.sid
    database.remove_insight(reaction, room, sid)
    update(room)
    
# Updates all of the data associated with a given room
def update(room):
    print("updating room: " + str(room))
    emit("update", count_active_reactions_in(room), to=room)
    emit("update students connected", {"count":student_room_counts[room]}, to=room)

def count_active_reactions_in(room):
    output = {}
    for reaction in Reaction:
        output[reaction] = database.count_active(reaction, room)
    return output

@socketio.on("update line graph")
def handle_message():
    room = sid_to_room[request.sid]
    line_graph.update_graph_data(room, students_sid)
    emit("update line graph", line_graph.room_to_graph_data[room], broadcast=True)

@socketio.on("create snapshot")
def handle_message():
    room = sid_to_room[request.sid]
    database.create_new_snapshot(room, students_sid)
    update(room)
    reset_buttons(room)
    print("snapshot created for room: " + str(room))

@app.route("/api/create-snapshot")
@cross_origin()
def create_snapshot():
    room = sid_to_room[request.sid]
    database.create_new_snapshot(room, students_sid)
    update(room)
    reset_buttons(room)
    print("created snapshot")
    return None

@app.route("/api/snapshots")
@cross_origin()
def get_snapshots():
    print("Request received to show snapshots")
    room = sid_to_room[request.sid]
    snapshots = database.find_snapshots(room)
    database.get_reset_snaphosts(room)
    return {"snapshots":snapshots}

@app.route("/api/reaction-count", methods=['POST'])
@login_required
@cross_origin()
def get_reaction_count():
        reaction = request.json["reaction"]
        room = request.json["room"]
        return {"count":database.count_active(reaction, room)}

@app.route("/api/student-count", methods=['POST'])
@login_required
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
@login_required
@cross_origin()
def get_all_reactions():
        room = request.json["room"]
        return count_active_reactions_in(room)

@app.route("/api/line_graph_data", methods=['POST'])
@login_required
@cross_origin()
def send_graph_data():
    room = request.json["room"]
    print("Line graph data requested for room: " + str(room))
    line_graph.update_graph_data(room)
    analysis_graph.get_analytics_data_for(room)
    return line_graph.room_to_graph_data[room]

@app.route("/api/analytics_graph_data", methods=['POST'])
@login_required
@cross_origin()
def send_analytics_data():
    room = request.json["room"]
    print("Analytics graph data requested for room: " + str(room))
    return analysis_graph.get_analytics_data_for(room)

@socketio.on("create snapshot")
@login_required
def handle_message():
    room = sid_to_room[request.sid]
    database.create_new_snapshot(room, students_sid)
    update(room)
    reset_buttons(room)
    print("snapshot created for room: " + str(room))


@socketio.on("leave comment")
def add_comment(comment, reaction, room):
    sid = request.sid
    database.add_comment(comment, reaction, room, sid)
    socketio.emit("update comments", to=room)
    return {"success":True}

@app.route("/api/get-comments", methods=['POST'])
@login_required
@cross_origin()
def get_comments():
        room = request.json["room"]
        comments = database.get_current_comments(room, students_sid)
        print(comments)
        return {"comments": comments}

# code stuff
@app.route("/api/new-code")
@login_required
@cross_origin()
def get_new_code():
    code = database.get_new_code(session["logged_in_email"])
    database.fetch_snapshot(str(code))   
    return {"code":code}

@app.route("/api/is-code-active", methods=['POST'])
@cross_origin()
def is_code_active():
    code = request.json['code']
    return {"valid":database.is_active_code(code)}

# login stuff
@app.route("/api/create-user", methods=['POST'])
@cross_origin()
def create_user():
    email = request.json['email']
    password = request.json['password'].encode('utf8')

    # if exists complain
    if database.user_exists(email):
        return jsonify({"error": "user already exists"}), 409

    hash = bcrypt.hashpw(password, bcrypt.gensalt())
    database.store_new_user(email, hash)
    return jsonify({"success": True}), 200

@app.route("/api/login", methods=['POST'])
@cross_origin()
def login():
    email = request.json['email']
    password = request.json['password'].encode('utf8')

    if not database.user_exists(email):
        return jsonify({"error": "invalid details"}), 403

    user = database.get_user(email)

    if bcrypt.checkpw(password, user["hash"]):
        session["logged_in_email"] = email
        return jsonify({"success": True}), 200 
    else:
        return jsonify({"error": "invalid details"}), 403

@app.route("/api/authenticated", methods=['POST'])
@cross_origin()
def check_authenticated():
    if session.get("logged_in_email") is None:
        return {"authenticated": False}
    else:
        return {"authenticated": True}


@app.route("/api/logout", methods=['POST'])
@cross_origin()
def logout():
    if session.get("logged_in_email") is None:
        return jsonify({"error": "not logged in"}), 400
    else:
        session.pop("logged_in_email")
        return jsonify({"success": True}), 200

@app.route("/api/owner", methods=['POST'])
@login_required
@cross_origin()
def check_owner():
    room = request.json["room"]
    return {"owner":database.room_owner(room, session["logged_in_email"])}


if __name__ == "__main__":
    socketio.run()
