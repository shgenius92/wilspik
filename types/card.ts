export interface Card {
  id: number
  example_en: string
  example_vi: string
  word: string
  type: string
  ipa: string
  ipa_example: string
  vi: string
}

export interface GuideStep {
  target: string
  content: string
  placement: "top" | "bottom" | "left" | "right"
}

