"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpeakerWaveIcon, BookmarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"
import type { Card as CardType, GuideStep } from "@/types/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const getCard = (id: number): CardType => ({
  id,
  englishWord: "Serendipity",
  pronunciation: "/ˌserənˈdɪpəti/",
  frenchTranslation: "Sérendipité",
  frenchPhrase: "J'ai fait une découverte par sérendipité.",
  englishPhrase: "I made a discovery by serendipity. I made a discovery by serendipity. I made a discovery by serendipity. I made a discovery by serendipity. I made a discovery by serendipity. I made a discovery by serendipity. I made a discovery by serendipity. I made a discovery by serendipity. ",
  englishPhrasePronunciation: "/aɪ meɪd ə dɪˈskʌvəri baɪ ˌserənˈdɪpəti/",
  totalCards: 100,
})

const guideSteps: GuideStep[] = [
  { target: "englishWord", content: "This is the English word you're learning.", placement: "bottom" },
  { target: "pronunciation", content: "This is how to pronounce the English word.", placement: "bottom" },
  { target: "frenchTranslation", content: "This is the French translation of the English word.", placement: "bottom" },
  {
    target: "frenchPhrase",
    content: "Read this French phrase and try to translate it to English.",
    placement: "bottom",
  },
  {
    target: "englishPhrase",
    content: "This is the English translation. Practice pronouncing it correctly.",
    placement: "bottom",
  },
  { target: "markRevision", content: "Tap here if you want to review this card later.", placement: "bottom" },
  {
    target: "nextCard",
    content: "If you've successfully translated and pronounced the phrase, move to the next card.",
    placement: "bottom",
  },
]

export default function CardPage({ params }: { params: { id: string } }) {
  const [card, setCard] = useState<CardType>(getCard(Number.parseInt(params.id)))
  const [currentGuideStep, setCurrentGuideStep] = useState(0)
  const [isBlurred, setIsBlurred] = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const elementRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const [isMarkedForRevision, setIsMarkedForRevision] = useState(false)

  useEffect(() => {
    setCurrentGuideStep(0)
    setShowGuide(false)
    setIsBlurred(true)
    setIsMarkedForRevision(false)
    const timer = setTimeout(() => {
          setIsBlurred(false)
        }, 6000)
    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    setCard(getCard(card.id + 1))
  }

  const handleMarkForRevision = () => {
    setIsMarkedForRevision(!isMarkedForRevision)
    console.log("Marked for revision:", card.id)
  }

  const handleGuideNext = () => {
    if (currentGuideStep < guideSteps.length - 1) {
      setCurrentGuideStep(currentGuideStep + 1)
    } else {
      setShowGuide(false)
    }
  }

  const renderGuidePopover = (step: GuideStep) => (
    <Popover open={showGuide && guideSteps[currentGuideStep].target === step.target}>
      <PopoverTrigger asChild>
        <div ref={(el) => (elementRefs.current[step.target] = el)} />
      </PopoverTrigger>
      <PopoverContent side={step.placement} className="w-64 p-4 z-50">
        <div className="relative">
          <p>{step.content}</p>
          <Button size="sm" onClick={handleGuideNext} className="mt-2">
            {currentGuideStep === guideSteps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">

      {showGuide && <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-40 pointer-events-none" />}
      <Card className="w-full max-w-sm relative">
        <div className="absolute top-2 left-2 bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
          1 / {card.totalCards}
        </div>
        <CardHeader className="text-center space-y-2 mt-8">
          <h2
            className={`text-2xl font-bold text-gray-900 relative ${showGuide && guideSteps[currentGuideStep].target === "englishWord" ? "z-50 bg-blue-50 p-2 rounded" : ""}`}
            id="englishWord"
          >
            {card.englishWord}
          </h2>
          {renderGuidePopover(guideSteps[0])}
          <div
            className={`flex items-center justify-center space-x-2 text-gray-600 relative ${showGuide && guideSteps[currentGuideStep].target === "pronunciation" ? "z-50 bg-blue-50 p-2 rounded" : ""}`}
            id="pronunciation"
          >
            <SpeakerWaveIcon className="w-5 h-5" />
            <span className="text-sm">{card.pronunciation}</span>
          </div>
          {renderGuidePopover(guideSteps[1])}
          <p
            className={`text-lg text-gray-700 relative ${showGuide && guideSteps[currentGuideStep].target === "frenchTranslation" ? "z-50 p-2 rounded" : ""}`}
            id="frenchTranslation"
          >
            {card.frenchTranslation}
          </p>
          {renderGuidePopover(guideSteps[2])}
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`bg-blue-50 p-3 rounded-lg relative ${showGuide && guideSteps[currentGuideStep].target === "frenchPhrase" ? "z-50" : ""}`}
            id="frenchPhrase"
          >
            <p className="text-base text-blue-800">{card.frenchPhrase}</p>
          </div>
          {renderGuidePopover(guideSteps[3])}
          <div
            className={`bg-green-50 p-3 rounded-lg space-y-2 relative ${showGuide && guideSteps[currentGuideStep].target === "englishPhrase" ? "z-50" : ""}`}
            id="englishPhrase"
          >
            <p className={`text-base text-green-800 transition-all duration-300 ${isBlurred ? "blur-sm" : ""}`}>
                          {card.englishPhrase}
                        </p>
                        <div
                          className={`flex items-center space-x-2 text-green-600 transition-all duration-300 ${isBlurred ? "blur-sm" : ""}`}
                        >
                          <SpeakerWaveIcon className="w-5 h-5" />
                          <span className="text-xs">{card.englishPhrasePronunciation}</span>
                        </div>
          </div>
          {renderGuidePopover(guideSteps[4])}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div
            id="markRevision"
            className={`relative ${showGuide && guideSteps[currentGuideStep].target === "markRevision" ? "z-50" : ""}`}
          >
            <Button variant="outline" onClick={handleMarkForRevision}>
              {isMarkedForRevision ? (
                              <BookmarkSolidIcon className="w-5 h-5 mr-2 text-blue-600" />
                            ) : (
                              <BookmarkIcon className="w-5 h-5 mr-2" />
              )}
              Mark for Revision
            </Button>
          </div>
          {renderGuidePopover(guideSteps[5])}
          <div
            id="nextCard"
            className={`relative ${showGuide && guideSteps[currentGuideStep].target === "nextCard" ? "z-50" : ""}`}
          >
            <Button onClick={handleNext}>
              Next Card
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </div>
          {renderGuidePopover(guideSteps[6])}
        </CardFooter>
      </Card>
    </div>
  )
}

