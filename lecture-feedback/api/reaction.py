from enum import Enum

class Reaction(str, Enum):
    def __str__(self):
        return str(self.value)
    GOOD="good"
    CONFUSED="confused"
    TOO_FAST="tooFast"
    CHILLING="chilling"


def getString(reaction):
    if (reaction is Reaction.GOOD):
        return "good"
    if (reaction is Reaction.CONFUSED):
        return "confused"
    if (reaction is Reaction.TOO_FAST):
        return "tooFast"
    if (reaction is Reaction.CHILLING):
        return "chilling"