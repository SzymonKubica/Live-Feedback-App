from enum import Enum

class Reaction(str, Enum):
    def __str__(self):
        return str(self.value)
    GOOD="good"
    CONFUSED="confused"
    TOO_FAST="tooFast"
    CHILLING="chilling"
