export interface Card {
  id: number
  englishWord: string
  pronunciation: string
  frenchTranslation: string
  frenchPhrase: string
  englishPhrase: string
  englishPhrasePronunciation: string
  totalCards: number
}

export interface GuideStep {
  target: string
  content: string
  placement: "top" | "bottom" | "left" | "right"
}

