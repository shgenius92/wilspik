"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpeakerWaveIcon, BookmarkIcon, ChevronRightIcon, ChevronLeftIcon, EyeIcon, LightBulbIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"
import type { Card as CardType } from "@/types/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Badge } from "@/components/ui/badge"
import { UserProgression } from "@/types/UserProgression"

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
  const [userProgression, setUserProgression] = useState<UserProgression>(new UserProgression());
  const [loading, setLoading] = useState<boolean>(true);

  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [currentPosition, setCurrentPosition] = useState<number>(0);

  const [isBlurred, setIsBlurred] = useState(true)
  const [isMarkedForRevision, setIsMarkedForRevision] = useState(false)

  useEffect(() => {
    const loadedUserProgression = UserProgression.loadFromLocalStorage();
    if (loadedUserProgression) {
        setUserProgression(loadedUserProgression);
    }
    const initOrLoadedUserProgression = (loadedUserProgression) ? loadedUserProgression : userProgression;

    const storedRepetitionCards = initOrLoadedUserProgression.getAllRevisionCards();

    // TODO rename RevisionCurrentCard to CurrentCardId
    const storedRevisionCurrentCard: number | null = initOrLoadedUserProgression.currentRevisionCardID;

    let parsedRevisionCurrentCard = null;
    let newCurrentPosition: number = -1;
    // case when storedRevisionCurrentCard == null and storedRepetitionCards == null => null (default) value
      // no currentPosition == null (default) value
    // case when storedRevisionCurrentCard == null and storedRepetitionCards !== null => possible at the beginning
      // currentPosition == 0
    // case when storedRevisionCurrentCard !== null and storedRepetitionCards == null => not possible
    // case when storedRevisionCurrentCard !== null and storedRepetitionCards !== null => possible
      // currentPosition == getCardPosition(storedRepetitionCards, parsedRevisionCurrentCard);

    if (storedRevisionCurrentCard && storedRevisionCurrentCard !== null && storedRepetitionCards) {
        console.log('case when storedRevisionCurrentCard !== null and storedRepetitionCards !== null');
        parsedRevisionCurrentCard = storedRevisionCurrentCard;
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

    if (newCurrentPosition != -1 && parsedRevisionCurrentCard != null)
        firstLoad(parsedRevisionCurrentCard, newCurrentPosition, storedRepetitionCards);
    else
        setLoading(false);

    setCurrentPosition(newCurrentPosition);
  }, [])

  const firstLoad = async (cardId: number, currentPosition: number, repetitionCards: Set<number>) => {
    let data = await fetchCard(cardId);
    display(data.card, currentPosition, repetitionCards);
    setLoading(false);
  }

  const display = (card: CardType, currentPosition: number, repetitionCards: Set<number>) => {
    // TODO - to delete the progress from the server response
    if (card) {  // Only proceed if data is not null (e.g., all cards read scenario)
      setCurrentCard(card);  // Set the current card in state

      setIsMarkedForRevision(true);
      setIsBlurred(true);
    }
  }

  const textToSpeech = useCallback((text: string) => {
    // TODO - Check Speech synthesis support by the using browser
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US" // Set the language to English
      window.speechSynthesis.speak(utterance);
    }
  }, [currentCard])

  const handleResponseClick = () => {
    if (isBlurred) {
        setIsBlurred(!isBlurred);
    } else if (currentCard){
        textToSpeech(currentCard.example_en);
    }
  }

  const nextCard = async () => {
    // if currentPosition is last of seenCards => fetch random card
    // else currentPosition + 1 + fetchCard + display
    const repetitionCards = userProgression.getAllRevisionCards();

    console.log('nextCard - repetitionCards: ', repetitionCards);
    console.log('nextCard - currentPosition: ', currentPosition);
    console.log('nextCard - computeNextPosition(repetitionCards, currentPosition): ', computeNextPosition(repetitionCards, currentPosition));

    if (currentCard) {
      const nextPosition = computeNextPosition(repetitionCards, currentPosition);
      const nextCardId = Array.from(repetitionCards)[nextPosition];
      const data = await fetchCard(nextCardId);


      display(data.card, nextPosition, repetitionCards);

      setCurrentPosition(nextPosition);

      userProgression.setCurrentRevisionCardID(nextCardId);
      UserProgression.saveToStorage(userProgression);
    }
  }

  const previousCard = async () => {
    // currentPosition - 1 + fetchCard + display
    const repetitionCards = userProgression.getAllRevisionCards();

    const newCardPosition = computePreviousPosition(repetitionCards, currentPosition);
    const nextCardId = Array.from(repetitionCards)[newCardPosition];

    const data = await fetchCard(nextCardId);
    display(data.card, newCardPosition, repetitionCards);

    setCurrentPosition(newCardPosition);

    userProgression.setCurrentRevisionCardID(nextCardId);
    UserProgression.saveToStorage(userProgression);
  }

  const fetchCard = async (cardId: number) => {
      console.log("fetchCard: id - ", cardId);
      const response = await fetch(`/api/getCard?id=${cardId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log('fetchcard: data - ', data);

      return data;
  }

  const unMarkForRepetition = async () => {
      // delete the currentCard from repetitionCards


      if (currentCard) {
          const repetitionCards = userProgression.getAllRevisionCards();
          const revisionCardBucketID = userProgression.getBucketID(currentCard.id);
          userProgression.getBucket(revisionCardBucketID).revisionCards.delete(currentCard.id);
          const updatedRepetitionCards = userProgression.getAllRevisionCards();

          console.log('unMarkForRepetition - repetitionCards - before: ', repetitionCards);
          console.log('unMarkForRepetition - repetitionCards - after: ', updatedRepetitionCards);

          // compute the nextPosition
          let nextPosition = currentPosition;
          if (updatedRepetitionCards.size === 0) {
            nextPosition = -1;
          } else {
            if (nextPosition !== null && nextPosition >= updatedRepetitionCards.size) {
              nextPosition = 0;
            }
          }

          console.log('unMarkForRepetition - currentPosition: ', currentPosition);
          console.log('unMarkForRepetition - nextPosition: ', nextPosition);

          // fetch card
          let nextCardId = null;
          if (nextPosition != -1) {
            nextCardId = Array.from(updatedRepetitionCards)[nextPosition];
            const data = await fetchCard(nextCardId);
            display(data.card, nextPosition, updatedRepetitionCards);
            userProgression.setCurrentRevisionCardID(data.card.id);
          } else {
            setCurrentCard(null);
            userProgression.setCurrentRevisionCardID(null);
          }

          // Update states
          setCurrentPosition(nextPosition);

          // Store in localStorage: repetitionCards / revision.currentCard
          UserProgression.saveToStorage(userProgression);
      }
    };



  if (loading) {
    return (
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-70 z-50">
        <img
          src="Vanilla@1x-1.0s-280px-250px.svg"
          alt="Loading"
          className="max-w-full max-h-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 relative">
        <Card className="w-full max-w-sm relative border-yellow-500 border-2">
          <div className="absolute top-2 left-2 bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
            {(userProgression.getAllRevisionCards().size > 0) ? currentPosition + 1 : 0 } / {userProgression.getAllRevisionCards().size}
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
                              {/* New Translation Challenge Design */}
                              <div className="relative">
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-theme-primary text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm z-10">
                                  Your Challenge
                                </div>
                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 pt-5 border border-theme-primary/20 shadow-sm">
                                  <div className="flex flex-col items-start">
                                    <div className="flex items-center w-full mb-2">
                                      <div className="bg-theme-primary rounded-full p-2 mr-3">
                                        <LightBulbIcon className="w-5 h-5 text-white" />
                                      </div>
                                      <p className="text-theme-primary font-medium">Try to translate this phrase:</p>
                                    </div>
                                    <div className="w-full pl-2">
                                      <div
                                        className={`bg-white p-3 rounded-lg relative shadow-sm`}
                                        id="frenchPhrase"
                                      >
                                        <p className="text-base text-theme-text-primary">{currentCard.example_vi}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`bg-green-50 p-3 rounded-lg space-y-2 relative`}
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
                                                          <span className="text-sm font-medium text-green-600">Check your answer</span>
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
              <Button variant="outline" size="sm" onClick={previousCard} disabled={userProgression.getAllRevisionCards() && userProgression.getAllRevisionCards().size <= 1}>
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
              <Button onClick={nextCard} disabled={userProgression.getAllRevisionCards() && userProgression.getAllRevisionCards().size <= 1}>
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
