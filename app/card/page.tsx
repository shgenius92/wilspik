"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpeakerWaveIcon, BookmarkIcon, ChevronRightIcon, ChevronLeftIcon,
  EyeIcon, LightBulbIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"
import type { Card as CardType } from "@/types/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { UserProgression } from "@/types/UserProgression"

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false })

function CongratulationsPopup({ onClose, userProgression }: { onClose: () => void, userProgression: UserProgression }) {
      const router = useRouter()

      // update the current bucket => currentBucket + 1
      // seenCards to restore
      // Run the state update logic only once when the component is mounted
      useEffect(() => {
        const nextBucket = userProgression.moveToNextBucket();
        console.log("CongratulationsPopup called, next bucket: ", nextBucket);

        UserProgression.saveToStorage(userProgression);

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
  const [userProgression, setUserProgression] = useState<UserProgression>(new UserProgression());
  const [loading, setLoading] = useState<boolean>(true);

  const defaultLotSize = 100; // TODO: to be deleted

  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [progress, setProgress] = useState({ totalSeenCards: 0, totalCards: 0 });
  const [currentPosition, setCurrentPosition] = useState<number>(0);

  const [showCongratulations, setShowCongratulations] = useState(false)

  const [isBlurred, setIsBlurred] = useState(true)
  const elementRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const [isMarkedForRevision, setIsMarkedForRevision] = useState(false)

  useEffect(() => {
    const loadedUserProgression = UserProgression.loadFromLocalStorage();
    if (loadedUserProgression) {
        setUserProgression(loadedUserProgression);
    }
    const initOrLoadedUserProgression = (loadedUserProgression) ? loadedUserProgression : userProgression;

    const initCurrentPosition = (initOrLoadedUserProgression.getCurrentBucket().seenCards.size === 0) ? 0 : initOrLoadedUserProgression.getCurrentBucket().seenCards.size - 1;

    console.log("currentPosition: ", initCurrentPosition);
    setCurrentPosition(initCurrentPosition);

    firstLoad(initOrLoadedUserProgression,
              initCurrentPosition);

    // load voices
    if (typeof window !== "undefined" && window.speechSynthesis)
      window.speechSynthesis.getVoices()
  }, [])

  const firstLoad = async (userProgression: UserProgression, currentPosition: number) => {
    let data = null
    if (userProgression.getCurrentBucket().seenCards.size > 0) {
      data = await fetchLastCard(userProgression.getCurrentBucket().seenCards);
    } else {
      data = await fetchRandomCard(userProgression.getCurrentBucket().seenCards, userProgression.currentBucketID, userProgression.getCurrentBucket().revisionCards);
      userProgression.getCurrentBucket().addSeenCard(data.card.id);
      UserProgression.saveToStorage(userProgression);
    }
    display(data.card, currentPosition, userProgression.getCurrentBucket().revisionCards);
    setLoading(false);
  }

  const display = (card: CardType, currentPosition: number, repetitionCards: Set<number>) => {
    // TODO - to delete the progress from the server response
    if (card) {  // Only proceed if data is not null (e.g., all cards read scenario)
      setCurrentCard(card);  // Set the current card in state
      setProgress({ totalSeenCards: currentPosition + 1, totalCards: defaultLotSize });  // Update progress if available

      // check if the card is marked for revision or not
      repetitionCards.has(card.id) ? setIsMarkedForRevision(true) : setIsMarkedForRevision(false);
      setIsBlurred(true);
    }
  }

  const handleResponseClick = () => {
    if (isBlurred) {
        setIsBlurred(!isBlurred);
    } else if (currentCard){
        textToSpeech(currentCard.example_en);
    }
  }

  const textToSpeech = useCallback((text: string) => {
      // List of preferred voices in order
      const preferredVoices = [
          "Emma", "Microsoft Ava", "Jenny", "Aria", "Michelle", "Ana", "Andrew", "Brian",
          "Guy", "Eric", "Steffan", "Christopher", "Roger", "Sonia", "Libby", "Maisie",
          "Ryan", "Thomas", "Natasha", "Hayley", "William", "Clara", "Heather", "Liam",
          "Neerja", "Prabhat", "Emily", "Connor", "Leah", "Luke", "Yan", "Sam", "Asilia",
          "Chilemba", "Molly", "Mitchell", "Ezinne", "Abeo", "Luna", "Wayne", "Imani",
          "Elimu", "Apple Ava", "Zoe", "Allison", "Nicky", "Samantha", "Joelle", "Evan",
          "Nathan", "Tom", "Alex", "Aaron", "Kate", "Stephanie", "Serena", "Martha",
          "Jamie", "Oliver", "Daniel", "Arthur", "Matilda", "Karen", "Catherine", "Lee",
          "Gordon", "Isha", "Sangeeta", "Rishi", "Moira", "Tessa", "Fiona", "Female Google voice (US)",
          "Female Google voice (UK)", "Male Google voice (UK)", "Zira", "David", "Mark", "Hazel",
          "Susan", "George", "Catherine", "James", "Linda", "Richard", "Heera", "Ravi", "Sean",
          "Female voice 1 (US)", "Female voice 2 (US)", "Female voice 3 (US)", "Female voice 4 (US)",
          "Female voice 5 (US)", "Female voice 6 (US)", "Male voice 1 (US)", "Male voice 2 (US)",
          "Male voice 3 (US)", "Female voice 1 (UK)", "Female voice 2 (UK)", "Female voice 3 (UK)",
          "Female voice 4 (UK)", "Male voice 1 (UK)", "Male voice 2 (UK)", "Male voice 3 (UK)",
          "Female voice 1 (Australia)", "Female voice 2 (Australia)", "Male voice 1 (Australia)",
          "Male voice 2 (Australia)", "Male voice 3 (Australia)", "Female voice 1 (India)",
          "Female voice 2 (India)", "Male voice 1 (India)", "Male voice 2 (India)"
      ];

      // Check if the browser supports speech synthesis
      if (typeof window !== "undefined" && window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US"; // Set the language to English
          utterance.pitch = 1;  // Set pitch (1 is normal)
          utterance.rate = 1;   // Set rate (1 is normal)
          utterance.volume = 1; // Set volume (1 is full)

          // Get available voices and filter by 'en-US'
          const voices = window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('en-US'));

          // Find the first preferred voice that exists in the available voices list
          const selectedVoice = voices.find(voice => preferredVoices.includes(voice.name));
          const defaultVoice = voices.find(voice => voice.default);
          console.log("selectedVoice: ", selectedVoice);
          console.log("defaultVoice: ", defaultVoice);
          console.log("voices[0]: ", voices[0]);

          if (selectedVoice) {
              utterance.voice = selectedVoice;
              console.log("Selected Voice:", selectedVoice.name);
          } else {
              console.log("No preferred voice found, using default.");
              // Fallback to a default voice if none found (optional)
              utterance.voice = voices[0]; // Fallback to the first voice in the list
          }

          // Speak the utterance
          window.speechSynthesis.speak(utterance);
      }
  }, [currentCard]);

  const nextCard = async () => {
    // if currentPosition is last of seenCards => fetch random card
    // else currentPosition + 1 + fetchCard + display
    console.log(currentPosition == userProgression.getCurrentBucket().seenCards.size - 1);
    console.log("currentPosition: ", currentPosition);
    console.log("userProgression.getCurrentBucket().seenCards.size: ", userProgression.getCurrentBucket().seenCards.size);

    if (currentPosition === defaultLotSize - 1) {
        setShowCongratulations(true);
    } else if (currentPosition == userProgression.getCurrentBucket().seenCards.size - 1) {
        const data = await fetchRandomCard(userProgression.getCurrentBucket().seenCards,
                                           userProgression.currentBucketID,
                                           userProgression.getCurrentBucket().revisionCards);

        const newCardPosition = currentPosition + 1;
        setCurrentPosition(newCardPosition);
        display(data.card, newCardPosition, userProgression.getCurrentBucket().revisionCards);

        userProgression.getCurrentBucket().addSeenCard(data.card.id);
        UserProgression.saveToStorage(userProgression);
    } else {
        const newCardPosition = currentPosition + 1;
        setCurrentPosition(newCardPosition);
        const cardId = Array.from(userProgression.getCurrentBucket().seenCards)[newCardPosition];

        const data = await fetchCard(cardId);

        display(data.card, newCardPosition, userProgression.getCurrentBucket().revisionCards);
    }
  }

  const previousCard = async () => {
    // currentPosition - 1 + fetchCard + display
    const newCardPosition = currentPosition - 1;
    setCurrentPosition(newCardPosition);
    const cardId = Array.from(userProgression.getCurrentBucket().seenCards)[newCardPosition];

    const data = await fetchCard(cardId);

    display(data.card, newCardPosition, userProgression.getCurrentBucket().revisionCards);

    UserProgression.saveToStorage(userProgression);
  }

  const fetchLastCard = async (seenCards: Set<number>) => {
      const lastSeenCardId = Array.from(seenCards)[seenCards.size - 1];
      return await fetchCard(lastSeenCardId);
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

  const onClosePopup = () => {
    setShowCongratulations(false);  // Hide the congratulations popup
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
        userProgression.getCurrentBucket().deleteRevisionCard(currentCard.id);
      } else {
        userProgression.getCurrentBucket().addRevisionCard(currentCard.id);
      }
      setIsMarkedForRevision(!isMarkedForRevision);
      UserProgression.saveToStorage(userProgression);
    }
  }

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
    <div className="bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 relative">
        <Card className="w-full max-w-sm relative">
          <div className="absolute top-2 left-2 bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-800">
            {progress.totalSeenCards} / {progress.totalCards}
          </div>

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
                  onClick={() => textToSpeech(currentCard.word)}
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
              <Button variant="outline" size="sm" onClick={previousCard} disabled={currentPosition === 0}>
                <ChevronLeftIcon />
              </Button>
            </div>

            <div
              id="markRevision"
              className={`relative`}
            >
              <Button variant="outline" size="sm" className="flex-1 mx-2" onClick={handleMarkForRevision}>
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
              <Button onClick={nextCard}>
                {currentPosition === defaultLotSize - 1 ? "Finish" : "Next"}
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
      {showCongratulations && <CongratulationsPopup onClose={onClosePopup} userProgression={userProgression}/>}
    </div>
  )
}
