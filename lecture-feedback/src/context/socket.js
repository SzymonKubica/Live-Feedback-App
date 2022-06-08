import React from "react";

import socketio from "socket.io-client";

const ENDPOINT = "http://lecture-feedback-drp.herokuapp.com:80";

export const socket = socketio.connect(ENDPOINT);
export const SocketContext = React.createContext();
