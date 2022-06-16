from sqlite3 import DatabaseError
from reaction import getString, Reaction
import database
from datetime import datetime

room_to_graph_data = {} # map from room number to the graph data
DATA_POINTS = 21

def initialise_graph_data(data_points):
    DATA_POINTS = data_points

def populate_graph():
    data = {}
    for reaction in Reaction:
        data[getString(reaction)] = []
        for i in range(DATA_POINTS):
            data[getString(reaction)] += [0]
    return data

def update_graph_data(room, active_students):
    if room in room_to_graph_data:
        for reaction in Reaction:
            count = database.count_active(reaction, room, active_students)
            entries = room_to_graph_data[room][getString(reaction)]
            list = entries[1:] + [count]
            room_to_graph_data[room][getString(reaction)] = list
    else:
        room_to_graph_data[room] = populate_graph()
    return room_to_graph_data[room]
