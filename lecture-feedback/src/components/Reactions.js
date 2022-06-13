export const Reaction = {
  GOOD: "good",
  CONFUSED: "confused",
  TOO_FAST: "tooFast",
  CHILLING: "chilling",
}

export const NilReaction = "nil"

export const getString = reaction => {
  return Object.values(Reaction)[Object.values(Reaction).indexOf(reaction)]
}

export function getColour(reaction) {
  switch(reaction) {
    case Reaction.GOOD:
      return "green"
    case Reaction.CONFUSED:
      return "red"
    case Reaction.TOO_FAST:
      return "orange"
    case Reaction.CHILLING:
      return "#1da1f2" // twitter
    }
}

export default Reaction
