from webbrowser import get
import database
from reaction import Reaction, getString
from datetime import datetime

def extract_time_from_insight(insight):
    return database.parse_datetime(insight["time"]["$date"])

def extract_type_from_insight(insight):
    return insight["type"]

def get_analytics_data_for(room):
    graph_data = {} # A dictionary from reaction to the graph data

    resets = extract_reset_times(database.find_snapshots(room))
    times = [] # A list of all times
    reaction_to_events = {} # A map from reaction to its corresponding events

    for reaction in Reaction:
        time_to_event = {} # A map from the exact time to the event that happened then (add/remove/reset)
        # Get all reaction additions/removal from the database and sort them.
        data = database.parse_mongo_json(database.db[getString(reaction)].find({
            "room": room
        }))

        # Populate the time-event map
        for entry in data:
            interaction_time = extract_time_from_insight(entry)
            time_to_event[interaction_time] = extract_type_from_insight(entry)
            times.append(interaction_time)

        # Add resets to the time-event map
        for reset_time in resets:
            time_to_event[reset_time] = "reset"

        reaction_to_events[reaction] = time_to_event

    # Sort the list of event times
    for reset_time in resets:
        times.append(reset_time)

    times.sort()

    # for now the start time is the time of the first reaction.
    start_time = times[0]

    # Iterate over the list of events times and calculate points accordingly.
    for reaction in Reaction:
        points = [] # A list of points that will be sent to the frontend.
        current_count = 0 # Current count of active reactions
        for time in times:
            if (time in reaction_to_events[reaction]):
                print("in")
                current_event = reaction_to_events[reaction][time]
                print(current_event)
                if (current_event == "add"):
                    current_count += 1
                elif (current_event == "remove"):
                    current_count -= 1
                else: # reset
                    current_count = 0

            time_in_recording = time - start_time
            points.append({
                "x": int(time_in_recording.total_seconds()),
                "y": current_count
            })
        graph_data[getString(reaction)] = points

    return graph_data

def extract_reset_times(snapshots):
    if snapshots != []:
        return list(map(lambda s: database.parse_datetime(s["end"]["$date"]), snapshots))
    else:
        return []