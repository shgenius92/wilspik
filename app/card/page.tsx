"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpeakerWaveIcon, BookmarkIcon, ChevronRightIcon, ChevronLeftIcon,
  EyeIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"
import type { Card as CardType, GuideStep } from "@/types/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false })

const guideSteps: GuideStep[] = [
  { target: "", content: "Voici un guide pour vous accompagner et vous expliquer les règles ", placement: "bottom" },
  { target: "englishWord", content: "Le mot en Anglais à mémoriser ", placement: "bottom" },
  { target: "pronunciation", content: "Comment ça se prononce ?", placement: "bottom" },
  { target: "frenchTranslation", content: "La traduction en Français", placement: "bottom" },
  {
    target: "frenchPhrase",
    content: "Lisez cette phrase en français à haute voix et essayez de la traduire en anglais à haute voix également",
    placement: "bottom",
  },
  {
    target: "englishPhrase",
    content: "La traduction de la phrase en Anglais",
    placement: "bottom",
  },
  {
    target: "previousCard",
    content: "Retournez sur la carte précédente",
    placement: "bottom",
  },
  { target: "markRevision", content: "Marquez la phrase pour révision si vous n'avez pas réussi la traduction", placement: "bottom" },
  {
    target: "nextCard",
    content: "Passez à la prochaine carte",
    placement: "bottom",
  }
]

function CongratulationsPopup({ onClose }: { onClose: () => void }) {
      const router = useRouter()

      // update the current bucket => currentBucket + 1
      // seenCards to restore
      // Run the state update logic only once when the component is mounted
      useEffect(() => {
        // Get the current bucket from localStorage or state
        const currentBucketStored = parseInt(localStorage.getItem('currentBucket') || '1', 10);

        // Update bucket only if it's not already the next one

        const nextBucket = currentBucketStored + 1;
        console.log("CongratulationsPopup called, next bucket: ", nextBucket);

        localStorage.setItem('currentBucket', JSON.stringify(nextBucket));
        localStorage.setItem('seenCards', JSON.stringify([]));

      }, []); // The empty dependency array ensures this effect runs only once when the component mounts


      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ReactConfetti />
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="mb-4">You've completed this bucket successfully!</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => router.push("/home")}>Next bucket</Button>
            </div>
          </div>
        </div>
      )
    }

export default function CardPage() {
  const defaultLotSize = 100; // TODO: to be deleted

  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [seenCards, setSeenCards] = useState(new Set<number>());
  const [repetitionCards, setRepetitionCards] = useState(new Set<number>());
  const [progress, setProgress] = useState({ totalSeenCards: 0, totalCards: 0 });
  const [currentBucketVar, setCurrentBucketVar] = useState(1);
  const [currentPosition, setCurrentPosition] = useState<number>(0);

  const [showCongratulations, setShowCongratulations] = useState(false)

  const [currentGuideStep, setCurrentGuideStep] = useState(0)
  const [isBlurred, setIsBlurred] = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const elementRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const [isMarkedForRevision, setIsMarkedForRevision] = useState(false)

  useEffect(() => {
    const storedShowGuide = localStorage.getItem('showGuide');
    const storedCurrentBucket = parseInt(localStorage.getItem('currentBucket') || '1', 10);
    const storedSeenCards = new Set<number>(JSON.parse(localStorage.getItem('seenCards') || '[]'));
    const storedRepetitionCards = new Set<number>(JSON.parse(localStorage.getItem('repetitionCards') || '[]'));
    const initCurrentPosition = (storedSeenCards.size === 0) ? 0 : storedSeenCards.size - 1;
    if (!storedShowGuide || (storedShowGuide && storedShowGuide === "true")) {
      setCurrentGuideStep(0);
      setShowGuide(true);
    }

    console.log("storedCurrentBucket: ", storedCurrentBucket);
    console.log("storedSeenCards: ", storedSeenCards);
    console.log("currentPosition: ", initCurrentPosition);
    setSeenCards(storedSeenCards);
    setCurrentBucketVar(storedCurrentBucket);
    setRepetitionCards(storedRepetitionCards);
    setCurrentPosition(initCurrentPosition);

    firstLoad(storedSeenCards, storedCurrentBucket, initCurrentPosition, storedRepetitionCards);
  }, [])

  const firstLoad = async (seenCards: Set<number>, storedBucket: Int, currentPosition: Int, repetitionCards: Set<number>) => {
    let data = null
    if (seenCards.size > 0) {
      data = await fetchLastCard(seenCards);
    } else {
      data = await fetchRandomCard(seenCards, storedBucket);
    }
    display(data, currentPosition, seenCards, repetitionCards);
  }

  const display = (data, currentPosition, seenCards, repetitionCards) => {
    // TODO - to delete the progress from the server response
    if (data) {  // Only proceed if data is not null (e.g., all cards read scenario)
      setCurrentCard(data.card);  // Set the current card in state
      setProgress({ totalSeenCards: currentPosition + 1, totalCards: defaultLotSize });  // Update progress if available

      const updatedSeenCards = new Set(seenCards);  // Avoid mutating seenCards directly
      updatedSeenCards.add(data.card.id);  // Add the current card's ID to the seen cards set
      setSeenCards(updatedSeenCards);  // Update seenCards state
      localStorage.setItem('seenCards', JSON.stringify([...updatedSeenCards]));  // Save updated seen cards to localStorage

      // check if the card is marked for revision or not
      repetitionCards.has(data.card.id) ? setIsMarkedForRevision(true) : setIsMarkedForRevision(false);
      setIsBlurred(true);
    }
  }

  const handleResponseClick = () => {
    if (isBlurred) {
        setIsBlurred(!isBlurred);
    } else {
        textToSpeech(currentCard?.example_en);
    }
  }

  const textToSpeech = useCallback((text) => {
    // TODO - Check Speech synthesis support by the using browser
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US" // Set the language to English
      utterance.rate = 0.5 // Slightly slower rate for clarity
      window.speechSynthesis.speak(utterance);
    }
  }, [currentCard])

  const nextCard = async () => {
    // if currentPosition is last of seenCards => fetch random card
    // else currentPosition + 1 + fetchCard + display

    if (currentPosition === defaultLotSize - 1) {
        setShowCongratulations(true);
    } else if (currentPosition == seenCards.size - 1) {
        const data = await fetchRandomCard(seenCards, currentBucketVar, repetitionCards);

        const newCardPosition = currentPosition + 1;
        setCurrentPosition(newCardPosition);
        display(data, newCardPosition, seenCards, repetitionCards);
    } else {
        const newCardPosition = currentPosition + 1;
        setCurrentPosition(newCardPosition);
        const cardId = Array.from(seenCards)[newCardPosition];

        const data = await fetchCard(cardId, seenCards, repetitionCards);

        display(data, newCardPosition, seenCards, repetitionCards);
    }
  }

  const previousCard = async () => {
    // currentPosition - 1 + fetchCard + display
    const newCardPosition = currentPosition - 1;
    setCurrentPosition(newCardPosition);
    const cardId = Array.from(seenCards)[newCardPosition];

    const data = await fetchCard(cardId, seenCards, repetitionCards);

    display(data, newCardPosition, seenCards, repetitionCards);
  }

  const fetchLastCard = async (seenCards: Set<number>) => {
      const lastSeenCardId = Array.from(seenCards)[seenCards.size - 1];
      return await fetchCard(lastSeenCardId, seenCards);
  }

  const fetchCard = async (cardId: Int) => {
      console.log("fetchCard: id - ", cardId);
      const response = await fetch(`/api/getCard?id=${cardId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log('fetchcard: data - ', data);

      return data;
  }

  const fetchRandomCard = async (seenCards: Set<number>, currentBucket: number, repetitionCards: Set<number>) => {
      const response = await fetch('/api/getCard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seenCardIds: [...seenCards], currentBucket: currentBucket }),
      });
      const data = await response.json();
      console.log('fetchRandomCard: data: ', data);

      if (data.message === 'All cards read!') {
        alert('You have read all the cards!');
        return null;  // Return null if no more cards are available
      }

      return data;
    };

  const handleMarkForRevision = () => {

    // if !isMarkedForRevision => mark for revision + remove from the repetitionCards

    if (currentCard?.id) {

      if (isMarkedForRevision) {
        // if isMarkedForRevision => unmark for revision + remove from the repetitionCards
        const updatedRepetitionCards = new Set(repetitionCards);
        updatedRepetitionCards.delete(currentCard.id);
        setRepetitionCards(updatedRepetitionCards);
        localStorage.setItem('repetitionCards', JSON.stringify([...updatedRepetitionCards]));

        setIsMarkedForRevision(!isMarkedForRevision);
        console.log("Card unmarked for revision: ", currentCard.id);
      } else {
        const updatedRepetitionCards = new Set(repetitionCards);
        updatedRepetitionCards.add(currentCard.id);
        setRepetitionCards(updatedRepetitionCards);
        localStorage.setItem('repetitionCards', JSON.stringify([...updatedRepetitionCards]));

        setIsMarkedForRevision(!isMarkedForRevision);
        console.log("Card marked for revision: ", currentCard.id);
      }
    }
  }

  const handleGuideNext = () => {
    if (currentGuideStep < guideSteps.length - 1) {
      setCurrentGuideStep(currentGuideStep + 1)
    } else {
      setShowGuide(false);
      localStorage.setItem('showGuide', 'false');
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 relative">
        {showGuide && <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-40 pointer-events-none" />}
        <Card className="w-full max-w-sm relative">
          <div className="absolute top-2 left-2 bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
            {progress.totalSeenCards} / {progress.totalCards}
          </div>

          {/* Conditionally render CardHeader if currentCard is available */}
          {currentCard ? (
            <>
              <CardHeader className="text-center space-y-2 mt-8">
                <h2
                  className={`text-2xl font-bold text-gray-900 relative ${showGuide && guideSteps[currentGuideStep].target === "englishWord" ? "z-50 bg-blue-50 p-2 rounded" : ""}`}
                  id="englishWord"
                >
                  {currentCard.word} {currentCard.type}
                </h2>
                {renderGuidePopover(guideSteps[0])}
                {renderGuidePopover(guideSteps[1])}
                <div
                  className={`flex items-center justify-center space-x-2 text-gray-600 relative ${showGuide && guideSteps[currentGuideStep].target === "pronunciation" ? "z-50 bg-blue-50 p-2 rounded" : ""}`}
                  id="pronunciation"
                  onClick={() => textToSpeech(currentCard.word)}
                >
                  <SpeakerWaveIcon className="w-5 h-5" />
                  <span className="text-sm">{currentCard.ipa}</span>
                </div>

                {renderGuidePopover(guideSteps[2])}
                <p
                  className={`text-lg text-gray-700 relative ${showGuide && guideSteps[currentGuideStep].target === "frenchTranslation" ? "z-50 bg-blue-50 p-2 rounded" : ""}`}
                  id="frenchTranslation"
                >
                  {currentCard.vi}
                </p>
                {renderGuidePopover(guideSteps[3])}
              </CardHeader>

              {/* Conditionally render CardContent if currentCard is available */}
              <CardContent className="space-y-4">
                <div
                  className={`bg-blue-50 p-3 rounded-lg relative ${showGuide && guideSteps[currentGuideStep].target === "frenchPhrase" ? "z-50" : ""}`}
                  id="frenchPhrase"
                >
                  <p className="text-base text-blue-800">{currentCard.example_vi}</p>
                </div>
                {renderGuidePopover(guideSteps[4])}
                <div
                  className={`bg-green-50 p-3 rounded-lg space-y-2 relative ${showGuide && guideSteps[currentGuideStep].target === "englishPhrase" ? "z-50" : ""}`}
                  id="englishPhrase"
                  onClick={handleResponseClick}
                >
                  <div className="relative">
                                      <p className={`text-base text-green-800 transition-all duration-300 ${isBlurred ? "blur-sm" : ""}`}>
                                        {currentCard.example_en}
                                      </p>
                                      <div
                                        className={`flex items-center space-x-2 text-green-600 transition-all duration-300 ${
                                          isBlurred ? "blur-sm" : ""
                                        }`}
                                      >
                                        <SpeakerWaveIcon className="w-5 h-5" />
                                        <span className="text-xs">{currentCard.ipa_example}</span>
                                      </div>
                                      {isBlurred && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="bg-white bg-opacity-90 px-4 py-2 rounded-full flex items-center space-x-2">
                                            <EyeIcon className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-600">Tap to reveal</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                </div>
                {renderGuidePopover(guideSteps[5])}
              </CardContent>
            </>
          ) : (
            // Display this message if no card is available
            <div className="text-center text-xl font-semibold text-gray-600 p-8">No card is available.</div>
          )}

          <CardFooter className="flex justify-between items-center mt-4">
            <div
              id="previousCard"
              className={`relative ${showGuide && guideSteps[currentGuideStep].target === "previousCard" ? "z-50" : ""}`}
            >
              <Button variant="outline" size="sm" onClick={previousCard} disabled={currentPosition === 0 || showGuide === true}>
                <ChevronLeftIcon />
              </Button>
            </div>

            {renderGuidePopover(guideSteps[6])}
            <div
              id="markRevision"
              className={`relative ${showGuide && guideSteps[currentGuideStep].target === "markRevision" ? "z-50" : ""}`}
            >
              <Button variant="outline" size="sm" className="flex-1 mx-2" onClick={handleMarkForRevision} disabled={showGuide === true}>
                {isMarkedForRevision ? (
                  <BookmarkSolidIcon className="w-5 h-5 mr-2 text-blue-600" />
                ) : (
                  <BookmarkIcon className="w-5 h-5 mr-2" />
                )}
                Mark for Revision
              </Button>
            </div>
            {renderGuidePopover(guideSteps[7])}

            <div
              id="nextCard"
              className={`relative ${showGuide && guideSteps[currentGuideStep].target === "nextCard" ? "z-50" : ""}`}
            >
              <Button onClick={nextCard} disabled={showGuide === true}>
                {currentPosition === defaultLotSize - 1 ? "Finish" : "Next"}
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </div>
            {renderGuidePopover(guideSteps[8])}
          </CardFooter>
        </Card>
      </main>
      {showCongratulations && <CongratulationsPopup />}
    </div>
  )
}
