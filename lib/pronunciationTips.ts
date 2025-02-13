interface PronunciationTip {
  word: string
  ipa: string
  explanation: string
}

const pronunciationTips: PronunciationTip[] = [
  {
    word: "thought",
    ipa: "/θɔːt/",
    explanation: "The 'th' sound /θ/ is made by placing your tongue between your teeth.",
  },
  {
    word: "rhythm",
    ipa: "/ˈrɪðəm/",
    explanation: "The 'th' sound /ð/ is voiced, unlike in 'thought'.",
  },
  {
    word: "squirrel",
    ipa: "/ˈskwɪrəl/",
    explanation: "The 'i' sound /ɪ/ is short, and the 'rr' is pronounced as /r/.",
  },
  {
    word: "through",
    ipa: "/θruː/",
    explanation: "The 'ou' makes a long 'oo' sound /uː/.",
  },
  {
    word: "enough",
    ipa: "/ɪˈnʌf/",
    explanation: "The 'ou' makes an 'uh' sound /ʌ/, and 'gh' is pronounced as /f/.",
  },
]

export function getRandomPronunciationTip(): PronunciationTip {
  const randomIndex = Math.floor(Math.random() * pronunciationTips.length)
  return pronunciationTips[randomIndex]
}

