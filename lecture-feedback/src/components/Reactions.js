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
      return "rgb(56, 161, 105)"
    case Reaction.CONFUSED:
      return "rgb(229, 62, 62)"
    case Reaction.TOO_FAST:
      return "rgb(221, 107, 32)"
    case Reaction.CHILLING:
      return "rgb(29, 161, 242)" // twitter
    }
}

export default Reaction
