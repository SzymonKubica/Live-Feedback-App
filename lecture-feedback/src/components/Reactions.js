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

export default Reaction
