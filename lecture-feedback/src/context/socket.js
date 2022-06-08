import React from "react";

import socketio from "socket.io-client";

const ENDPOINT = process.env.API_URL;

export const socket = socketio.connect(ENDPOINT);
export const SocketContext = React.createContext();
