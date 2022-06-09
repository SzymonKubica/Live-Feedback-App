from flask import Flask
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit
import time
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

def add_insight(db, table, content):
    tb = db[table]
    tb.insert_one(content)

def generate_insight(type):
        return {
        "type": type,
        "time": time.time()
    }

def count_active(db, table):
    add_count = db[table].count_documents({"type":"add"})
    remove_count = db[table].count_documents({"type":"remove"})

    return add_count - remove_count


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

@socketio.on('connect')
def test_connect():
    print("connected")
    emit("update confused", {"count":count_active(db, "confused")})
    emit("update good", {"count":count_active(db, "good")})
    emit("update too fast", {"count":count_active(db, "too-fast")})
    emit("update chilling", {"count":count_active(db, "chilling")})


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
if __name__ == "__main__":
    socketio.run()