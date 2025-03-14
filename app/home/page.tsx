"use client"

import { useState, useEffect} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AcademicCapIcon, PlayIcon, ArrowPathIcon, BookOpenIcon, SpeakerWaveIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { getUserProgress, getCurrentBucket } from "../lib/api"
import { getRandomPronunciationTip } from "../lib/pronunciationTips"
import { SlidingMessages } from "@/components/SlidingMessages"
import { Header } from "@/components/Header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HorizontalScroller } from "@/components/HorizontalScroller"
import { BucketCard } from "@/components/BucketCard"
import { UserProgression } from "@/types/UserProgression"
import { Bucket } from "@/types/Bucket"

export default function HomePage() {
  const [userProgression, setUserProgression] = useState<UserProgression>(new UserProgression());
  const [loading, setLoading] = useState<boolean>(true);

  const [refreshKey, setRefreshKey] = useState<number>(0); // Add refresh state to trigger re-render

  const totalBuckets = 34;
  // TODO: to move to Bucket model
  const totalCards = 100;

  useEffect(() => {
    const loadedUserProgression = UserProgression.loadFromLocalStorage();
    console.log("loadedUserProgression from home: ", loadedUserProgression);
    const initOrLoadedUserProgression = (loadedUserProgression) ? loadedUserProgression : userProgression;
    setUserProgression(initOrLoadedUserProgression);
    UserProgression.saveToStorage(initOrLoadedUserProgression);

    setLoading(false);
  }, [])

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

  const restartClickHandler = (bucketID: number) => {
      userProgression.setCurrentBucket(bucketID);
      userProgression.getCurrentBucket().restart();
      UserProgression.saveToStorage(userProgression);
      console.log("restart click handler on bucketID: ", bucketID);
      window.location.href = '/card';
  };

  const resumeClickHandler = (bucketID: number) => {
      userProgression.setCurrentBucket(bucketID);
      UserProgression.saveToStorage(userProgression);
      console.log("resume click handler on bucketID: ", bucketID);
      window.location.href = '/card';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Learn English by practice</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* App Tips */}
          <div className="col-span-full mb-4">
            <SlidingMessages />
          </div>
          {/* Overall Progress
          <Card className="border-t-4 border-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <AcademicCapIcon className="w-6 h-6 mr-2 text-indigo-500" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(userProgression.getCountCompletedBuckets() / totalBuckets) * 100} className="mb-2" />
              <p className="text-sm text-gray-600">
                {userProgression.getCountCompletedBuckets()} of {totalBuckets} buckets completed
              </p>
            </CardContent>
          </Card>*/}
          {/* Continue Learning */}
          <Link href={`/card`} className="block">
            <Card className="hover:shadow-lg transition-shadow border-t-4 border-green-500 h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <PlayIcon className="w-6 h-6 mr-2 text-green-500" />
                  {userProgression.getCurrentBucket().seenCards.size === 0 ? "Start" : "Continue"} Learning
                </CardTitle>
                <CardDescription>
                  Bucket {userProgression.currentBucketID}:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={(userProgression.getCurrentBucket().seenCards.size / totalCards) * 100} className="mb-2" />
                <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>
                          {userProgression.getCurrentBucket().seenCards.size} of {totalCards} cards completed
                        </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Pronunciation Tip
          <Card className="border-t-4 border-purple-500 col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <SpeakerWaveIcon className="w-6 h-6 mr-2 text-purple-500" />
                Pronunciation Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-2">
                {pronunciationTip.word} <span className="text-purple-600">{pronunciationTip.ipa}</span>
              </p>
              <p className="text-sm text-gray-600">{pronunciationTip.explanation}</p>
            </CardContent>
          </Card>*/}

          {/* Revision */}
          <Link href="/revision" className="block">
            <Card className="hover:shadow-lg transition-shadow border-t-4 border-yellow-500 h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <ArrowPathIcon className="w-6 h-6 mr-2 text-yellow-500" />
                  Revision
                </CardTitle>
                <CardDescription>Review marked cards</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{userProgression.getAllRevisionCards().size} cards marked for revision</p>
              </CardContent>
            </Card>
          </Link>

          {/* All Buckets */}
            <div className="col-span-full">
              <Card className="border-t-4 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900">
                    <div className="flex items-center">
                      <BookOpenIcon className="w-6 h-6 mr-2 text-blue-500" />
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span>All Buckets</span>
                        <span className="text-xs text-gray-500 font-normal sm:ml-2">
                          {userProgression.getCountCompletedBuckets()} of {totalBuckets} buckets completed
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" id="scrollLeft" aria-label="Scroll left">
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" id="scrollRight" aria-label="Scroll right">
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <HorizontalScroller>
                      {userProgression.progression.map((bucket) => (
                        <div key={bucket.id} className="px-1">
                          <BucketCard
                            id={bucket.id}
                            isUnlocked={true}
                            totalCards={100}
                            completedCards={bucket.seenCards.size}
                            lastScore={bucket.lastScore}
                            markedForRevision={bucket.revisionCards.size}
                            isCompleted={bucket.isCompleted}
                            isCurrentBucket={bucket.id == userProgression.currentBucketID}
                            restartClickHandler={restartClickHandler}
                            resumeClickHandler={resumeClickHandler}
                          />
                        </div>
                      ))}

                      {/* Remaining buckets */}
                      {Array.from({ length: 34 - userProgression.progression.length}, (_, index) => index + userProgression.progression.length + 1).map((bucketID) => (
                        <div key={bucketID} className="px-1">
                          <BucketCard
                            id={bucketID}
                            isUnlocked={false}
                            totalCards={100}
                            completedCards={0}
                          />
                        </div>
                      ))}
                    </HorizontalScroller>
                </CardContent>
              </Card>
            </div>
        </div>
      </main>
    </div>

  )
}

