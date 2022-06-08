from flask import Flask
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit

count = 0


app = Flask(__name__, static_folder='../build', static_url_path='/')

app.config['SECRET_KEY'] = 'mysecret'

CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

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
    emit("fromApi",{"count":count})

@socketio.on('disconnect')
def test_disconnect():
    print("disconnected")


@socketio.on("confused")
def handleMessage():
    global count
    count += 1
    emit("fromApi",{"count":count}, broadcast=True)
    # return None

if __name__ == "__main__":
    socketio.run()