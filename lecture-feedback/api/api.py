from flask import Flask
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit

goodCount = 0
confusedCount = 0
tooFastCount = 0
chillingCount = 0

app = Flask(__name__, static_folder='../build', static_url_path='/')

app.config['SECRET_KEY'] = 'mysecret'

CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

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
    emit("update confused", {"count":confusedCount})
    emit("update good", {"count":goodCount})
    emit("update too fast", {"count":tooFastCount})
    emit("update chilling", {"count":chillingCount})


@socketio.on('disconnect')
def test_disconnect():
    print("disconnected")


@socketio.on("confused")
def handleMessage():
    global confusedCount
    confusedCount += 1
    emit("update confused", {"count":confusedCount}, broadcast=True)
    # return None

@socketio.on("no longer confused")
def handleMessage():
    global confusedCount
    confusedCount -= 1
    emit("update confused", {"count":confusedCount}, broadcast=True)
    # return None

@socketio.on("good")
def handleMessage():
    global goodCount 
    goodCount += 1
    emit("update good", {"count":goodCount}, broadcast=True)
    # return None

@socketio.on("no longer good")
def handleMessage():
    global goodCount
    goodCount -= 1
    emit("update good", {"count":goodCount}, broadcast=True)
    # return None

@socketio.on("too fast")
def handleMessage():
    global tooFastCount
    tooFastCount += 1
    emit("update too fast", {"count":tooFastCount}, broadcast=True)
    # return None

@socketio.on("no longer too fast")
def handleMessage():
    global tooFastCount
    tooFastCount -= 1
    emit("update too fast", {"count":tooFastCount}, broadcast=True)
    # return None

@socketio.on("chilling")
def handleMessage():
    global chillingCount
    chillingCount += 1
    emit("update chilling", {"count":chillingCount}, broadcast=True)
    # return None

@socketio.on("no longer chilling")
def handleMessage():
    global chillingCount
    chillingCount -= 1
    emit("update chilling", {"count":chillingCount}, broadcast=True)
    # return None
if __name__ == "__main__":
    socketio.run()