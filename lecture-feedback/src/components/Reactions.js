export const Reaction = {
    GOOD: "good",
    CONFUSED: "confused",
    TOO_FAST: "too-fast",
    CHILLING: "chilling"
}

export const getString = (reaction) => {
    return Object.values(Reaction)[Object.values(Reaction).indexOf(reaction)]
}

export default Reaction

