"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, LightBulbIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/outline"

const messages = [
  "3 pratiques essentielles pour maitriser une langue : Apprendre le Vocabulaire / Pratiquer / Répéter",
  "Parler couramment ? C'est notre promesse si vous allez jusqu'au bout des buckets.",
  "Pas de perte de temps, le vocabulaire essentiel à apprendre pour parler couramment.",
  "Adoptez les bonnes habitudes : 15 min/jour suffisent, choisissez juste le bon timing ."
];

export function SlidingMessages() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const changeMessage = useCallback((direction: "next" | "prev") => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentMessageIndex((prevIndex) => {
        if (direction === "next") {
          return (prevIndex + 1) % messages.length
        } else {
          return (prevIndex - 1 + messages.length) % messages.length
        }
      })
      setIsTransitioning(false)
    }, 300) // This should match the transition duration in the CSS
  }, [])

  const nextMessage = useCallback(() => changeMessage("next"), [changeMessage])
  const prevMessage = useCallback(() => changeMessage("prev"), [changeMessage])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!isPaused) {
      timer = setInterval(() => {
        nextMessage()
      }, 10000)
    }
    return () => clearInterval(timer)
  }, [isPaused, nextMessage])

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <LightBulbIcon className="w-6 h-6 mr-2" />
            <span>App Tips</span>
            <span className="text-sm font-normal ml-2"> {currentMessageIndex + 1}/{messages.length}</span>
          </div>
          <span className="text-sm font-normal">
            <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={prevMessage}
                aria-label="Previous tip"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={togglePause}
                aria-label={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <PlayIcon className="h-6 w-6" /> : <PauseIcon className="h-6 w-6" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={nextMessage}
                aria-label="Next tip"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </Button>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="relative min-h-[4rem] flex items-center">
          <p
            className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {messages[currentMessageIndex]}
          </p>
        </div>
        <div className="flex justify-center space-x-2">

        </div>
      </CardContent>
    </Card>
  )
}

