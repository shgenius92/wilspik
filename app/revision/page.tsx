"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpeakerWaveIcon, BookmarkIcon, ChevronRightIcon, ChevronLeftIcon, EyeIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"
import type { Card as CardType, GuideStep } from "@/types/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Badge } from "@/components/ui/badge"



function getCardPosition(cardsSet: Set<number>, revisionCurrentCard: number): number {
  const cardsArray = Array.from(cardsSet);
  const position = cardsArray.indexOf(revisionCurrentCard);

  return position;
}

function computeNextPosition(cardsSet: Set<number>, position: number): number {
      if (position === cardsSet.size - 1) {
        return 0;
      }
      return position + 1;
}

function computePreviousPosition(cardsSet: Set<number>, position: number): number {
      if (position === 0) {
        return cardsSet.size - 1;
      }
      return position - 1;
}

export default function CardPage() {
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [repetitionCards, setRepetitionCards] = useState(new Set<number>());
  const [currentPosition, setCurrentPosition] = useState<number>(0);

  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isBlurred, setIsBlurred] = useState(true)
  const [isMarkedForRevision, setIsMarkedForRevision] = useState(false)

  useEffect(() => {
    const storedRepetitionCards = new Set<number>(JSON.parse(localStorage.getItem('repetitionCards') || '[]'));

    // TODO rename RevisionCurrentCard to CurrentCardId
    const storedRevisionCurrentCard = localStorage.getItem('revision.currentCard');

    let parsedRevisionCurrentCard = null;
    let newCurrentPosition: Int = null;
    // case when storedRevisionCurrentCard == null and storedRepetitionCards == null => null (default) value
      // no currentPosition == null (default) value
    // case when storedRevisionCurrentCard == null and storedRepetitionCards !== null => possible at the beginning
      // currentPosition == 0
    // case when storedRevisionCurrentCard !== null and storedRepetitionCards == null => not possible
    // case when storedRevisionCurrentCard !== null and storedRepetitionCards !== null => possible
      // currentPosition == getCardPosition(storedRepetitionCards, parsedRevisionCurrentCard);

    if (storedRevisionCurrentCard && storedRevisionCurrentCard !== "null" && storedRepetitionCards) {
        console.log('case when storedRevisionCurrentCard !== null and storedRepetitionCards !== null');
        parsedRevisionCurrentCard = parseInt(storedRevisionCurrentCard, 10);
        newCurrentPosition = getCardPosition(storedRepetitionCards, parsedRevisionCurrentCard);
    } else {
        if (storedRepetitionCards) {
            console.log('case when storedRevisionCurrentCard == null and storedRepetitionCards !== null');
            newCurrentPosition = 0;
            parsedRevisionCurrentCard = Array.from(storedRepetitionCards)[newCurrentPosition];
        } else {
            console.log('case when storedRevisionCurrentCard == null and storedRepetitionCards == null');
        }
    }

    console.log('parsedRevisionCurrentCard: ', parsedRevisionCurrentCard);
    console.log('newCurrentPosition: ', newCurrentPosition);

    if (newCurrentPosition != null && parsedRevisionCurrentCard != null)
        firstLoad(parsedRevisionCurrentCard, newCurrentPosition, storedRepetitionCards);

    setRepetitionCards(storedRepetitionCards);
    setCurrentPosition(newCurrentPosition);

    handleBlurred();
  }, [])

  const firstLoad = async (cardId: Int, currentPosition: Int, repetitionCards: Set<number>) => {
    let data = await fetchCard(cardId);
    display(data, currentPosition, repetitionCards);
  }

  const display = (data, currentPosition, repetitionCards) => {
    // TODO - to delete the progress from the server response
    if (data) {  // Only proceed if data is not null (e.g., all cards read scenario)
      setCurrentCard(data.card);  // Set the current card in state

      // check if the card is marked for revision or not
      repetitionCards.has(data.card.id) ? setIsMarkedForRevision(true) : setIsMarkedForRevision(false);

      setIsBlurred(true);
    }
  }

  const handlePhraseClick = () => {
    setIsBlurred(!isBlurred);
  }

  const handleBlurred = () => {
    // Set the card as blurred before the 6-second timer
    setIsBlurred(true);

    // Clear any existing timer if present
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }

    // Set the blur to false after 6 seconds
    blurTimeoutRef.current = setTimeout(() => {
      setIsBlurred(false);
    }, 6000);
  }

  const nextCard = async () => {
    // if currentPosition is last of seenCards => fetch random card
    // else currentPosition + 1 + fetchCard + display

    console.log('nextCard - repetitionCards: ', repetitionCards);
    console.log('nextCard - currentPosition: ', currentPosition);
    console.log('nextCard - computeNextPosition(repetitionCards, currentPosition): ', computeNextPosition(repetitionCards, currentPosition));

    if (currentCard) {
      const nextPosition = computeNextPosition(repetitionCards, currentPosition);
      const nextCardId = Array.from(repetitionCards)[nextPosition];
      const data = await fetchCard(nextCardId);


      display(data, nextPosition, repetitionCards);

      setCurrentPosition(nextPosition);

      localStorage.setItem('revision.currentCard', JSON.stringify(nextCardId));
      handleBlurred();
    }
  }

  const previousCard = async () => {
    // currentPosition - 1 + fetchCard + display
    const newCardPosition = computePreviousPosition(repetitionCards, currentPosition);
    const nextCardId = Array.from(repetitionCards)[newCardPosition];

    const data = await fetchCard(nextCardId);
    display(data, newCardPosition, repetitionCards);

    setCurrentPosition(newCardPosition);
    localStorage.setItem('revision.currentCard', JSON.stringify(nextCardId));
    handleBlurred();
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

  const unMarkForRepetition = async () => {
      // delete the currentCard from repetitionCards
      if (currentCard) {
          const updatedRepetitionCards = new Set(repetitionCards);
          updatedRepetitionCards.delete(currentCard.id);
          console.log('unMarkForRepetition - repetitionCards - before: ', repetitionCards);
          console.log('unMarkForRepetition - repetitionCards - after: ', updatedRepetitionCards);

          // compute the nextPosition
          let nextPosition = currentPosition;
          if (updatedRepetitionCards.size === 0) {
            nextPosition = null;
          } else {
            if (nextPosition !== null && nextPosition >= updatedRepetitionCards.size) {
              nextPosition = 0;
            }
          }

          console.log('unMarkForRepetition - currentPosition: ', currentPosition);
          console.log('unMarkForRepetition - nextPosition: ', nextPosition);

          // fetch card
          let nextCardId = null;
          if (nextPosition != null) {
            nextCardId = Array.from(updatedRepetitionCards)[nextPosition];
            const data = await fetchCard(nextCardId);
            display(data, nextPosition, updatedRepetitionCards);
          } else {
            setCurrentCard(null);
          }

          // Update states
          setRepetitionCards(updatedRepetitionCards);
          setCurrentPosition(nextPosition);

          // Store in localStorage: repetitionCards / revision.currentCard
          localStorage.setItem('repetitionCards', JSON.stringify(Array.from(updatedRepetitionCards)));
          localStorage.setItem('revision.currentCard', JSON.stringify(nextCardId));
      }
    };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 relative">
        <Card className="w-full max-w-sm relative border-yellow-500 border-2">
          <div className="absolute top-2 left-2 bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
            {(repetitionCards.size > 0) ? currentPosition + 1 : 0 } / {repetitionCards.size}
          </div>
          <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
              Revision
          </Badge>
          {/* Conditionally render CardHeader if currentCard is available */}
          {currentCard ? (
            <>
              <CardHeader className="text-center space-y-2 mt-8">
                <h2
                  className={`text-2xl font-bold text-gray-900 relative`}
                  id="englishWord"
                >
                  {currentCard.word} {currentCard.type}
                </h2>
                <div
                  className={`flex items-center justify-center space-x-2 text-gray-600 relative`}
                  id="pronunciation"
                >
                  <SpeakerWaveIcon className="w-5 h-5" />
                  <span className="text-sm">{currentCard.ipa}</span>
                </div>

                <p
                  className={`text-lg text-gray-700 relative`}
                  id="frenchTranslation"
                >
                  {currentCard.vi}
                </p>
              </CardHeader>

              {/* Conditionally render CardContent if currentCard is available */}
              <CardContent className="space-y-4">
                <div
                  className={`bg-blue-50 p-3 rounded-lg relative`}
                  id="frenchPhrase"
                >
                  <p className="text-base text-blue-800">{currentCard.example_vi}</p>
                </div>
                <div
                  className={`bg-green-50 p-3 rounded-lg space-y-2 relative`}
                  id="englishPhrase"
                  onClick={handlePhraseClick}
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
              </CardContent>
            </>
          ) : (
            // Display this message if no card is available
            <div className="text-center text-xl font-semibold text-gray-600 p-8">No card is available.</div>
          )}

          <CardFooter className="flex justify-between items-center mt-4">
            <div
              id="previousCard"
              className={`relative`}
            >
              <Button variant="outline" size="sm" onClick={previousCard} disabled={repetitionCards && repetitionCards.size <= 1}>
                <ChevronLeftIcon />
              </Button>
            </div>

            <div
              id="markRevision"
              className={`relative`}
            >
              <Button variant="outline" size="sm" className="flex-1 mx-2" onClick={unMarkForRepetition} disabled={!currentCard}>
                {isMarkedForRevision ? (
                  <BookmarkSolidIcon className="w-5 h-5 mr-2 text-blue-600" />
                ) : (
                  <BookmarkIcon className="w-5 h-5 mr-2" />
                )}
                Mark for Revision
              </Button>
            </div>

            <div
              id="nextCard"
              className={`relative`}
            >
              <Button onClick={nextCard} disabled={repetitionCards && repetitionCards.size <= 1}>
                Next
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
