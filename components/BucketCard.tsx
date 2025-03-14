"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  LockClosedIcon,
  LockOpenIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BucketCardProps {
  id: number
  isUnlocked: boolean
  totalCards: number
  completedCards: number
  lastScore?: number | null
  markedForRevision?: number
  isCompleted: boolean
  isCurrentBucket: boolean
  restartClickHandler: (bucketID: number) => void;
  resumeClickHandler: (bucketID: number) => void;
}

export function BucketCard({
  id,
  isUnlocked,
  totalCards = 100,
  completedCards,
  lastScore = null,
  markedForRevision = 0,
  isCompleted = false,
  isCurrentBucket = false,
  restartClickHandler,
  resumeClickHandler
}: BucketCardProps) {
  const progress = (completedCards / totalCards) * 100

  const handleRestart = () => {
    if (restartClickHandler) {
      restartClickHandler(id);
    }
  };

  const handleRevisionClick = (bucketId: number) => {
  }

  const handleResume = () => {
    if (resumeClickHandler) {
      resumeClickHandler(id);
    }
  };

  return (
      <Card
                className={cn(
                  "w-48 h-48 flex flex-col justify-between relative transition-all duration-300",
                  isCurrentBucket
                    ? "bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg border-theme-primary z-10"
                    : "hover:shadow-md",
                  isCurrentBucket && "shadow-xl",
                )}
              >

      {/* Highlight effect for current bucket */}
                {isCurrentBucket && (
                  <>
                    <div className="absolute inset-0 border-2 border-theme-primary rounded-lg pointer-events-none"></div>
                    <div className="absolute -inset-1 bg-theme-primary opacity-10 rounded-lg blur-sm pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                      <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 rotate-45 bg-theme-primary text-white shadow-md w-12 h-12"></div>
                      <SparklesIcon className="absolute top-1 right-1 w-4 h-4 text-white" />
                    </div>
                  </>
                )}
        {/* Bucket ID with "Bucket" text */}
        <div className="absolute top-2 left-2 bg-gray-200 rounded-lg px-2 py-0.5 flex items-center">
          <span className="text-xs font-bold">Bucket {id}</span>
        </div>

        {/* Lock/Unlock Status */}
                  <div className="absolute top-2 right-2">
                    {isUnlocked ? (
                      isCompleted ? (
                        <CheckCircleIcon className="w-5 h-5 text-theme-success" />
                      ) : (
                        <LockOpenIcon
                          className={cn("w-5 h-5", isCurrentBucket ? "text-theme-primary" : "text-theme-success")}
                        />
                      )
                    ) : (
                      <LockClosedIcon className="w-5 h-5 text-theme-text-muted" />
                    )}
                  </div>

        <CardContent className="flex flex-col items-center justify-center h-full pt-6">
          {/* Content area - removed the bucket name/number from here */}
          <div className="w-full space-y-4 mt-4">
            {isCompleted ? (
              // Completed bucket display
              <>
                <div className="flex justify-center">
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs px-2 py-0.5">
                    Score: {lastScore}/100
                  </Badge>
                </div>

                {markedForRevision > 0 && (
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center space-x-1 text-amber-600 hover:bg-amber-50 hover:text-amber-700 p-0.5 h-auto min-h-0"
                    onClick={handleRevisionClick}
                  >
                    <BookmarkIcon className="w-3 h-3" />
                    <span className="text-xs">{markedForRevision} marked for revision</span>
                  </Button>
                )}

                {/* Restart Button for completed buckets */}
                <div className="flex justify-center mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-300 hover:bg-blue-50 flex items-center space-x-1 h-7 text-xs"
                    onClick={() => handleRestart(id)}
                  >
                    <ArrowPathIcon className="w-3 h-3" />
                    <span>Restart</span>
                  </Button>
                </div>
              </>
            ) : (
              // In-progress bucket display
              <>
                <div>
                  <Progress value={progress} className="w-full mb-1" />
                  <p className="text-xs text-gray-500 text-center">
                    {completedCards}/{totalCards} cards
                  </p>
                </div>
                {/* Resume button for current bucket */}
                  {(isCurrentBucket || isUnlocked) && (
                    <div className="flex justify-center mt-3">
                      <Button
                        size="sm"
                        className={`${isCurrentBucket ? "bg-theme-primary hover:bg-theme-secondary" : "bg-theme-text-muted"} text-white flex items-center space-x-1 h-8 px-4 shadow-md hover:shadow-lg transition-all duration-300`}
                        onClick={() => handleResume(id)}
                      >
                        <PlayIcon className="w-3 h-3 mr-1" />
                        <span>Resume</span>
                      </Button>
                    </div>
                  )}
                {markedForRevision > 0 && (
                  <Button
                    variant="ghost"
                    className="absolute bottom-2 left-2 space-x-1 text-amber-600 hover:bg-amber-50 hover:text-amber-700 p-0.5 h-auto min-h-0"
                    onClick={handleRevisionClick}
                  >
                    <BookmarkIcon className="w-3 h-3" />
                    <span className="text-xs">{markedForRevision}</span>
                  </Button>
                )}

                <div className="absolute bottom-2 right-2">
                                    {lastScore !== null && (
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "ml-auto text-xs px-1.5 py-0.5",
                                          isCurrentBucket
                                            ? "bg-theme-muted text-theme-primary"
                                            : "bg-gray-100 text-theme-text-secondary",
                                        )}
                                      >
                                        Last score: {lastScore}/100
                                      </Badge>
                                    )}
                                  </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
  )
}

