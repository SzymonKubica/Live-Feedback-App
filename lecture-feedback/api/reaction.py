from enum import Enum

class Reaction(str, Enum):
    GOOD="good"
    CONFUSED="confused"
    TOO_FAST="tooFast"
    CHILLING="chilling"