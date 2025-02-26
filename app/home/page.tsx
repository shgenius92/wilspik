"use client"

import { useState, useEffect} from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AcademicCapIcon, PlayIcon, ArrowPathIcon, BookOpenIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { getUserProgress, getCurrentBucket } from "../lib/api"
import { getRandomPronunciationTip } from "../lib/pronunciationTips"
import { SlidingMessages } from "@/components/SlidingMessages"
import { Header } from "@/components/Header"
import { Badge } from "@/components/ui/badge"
import { BucketsDisplay } from "@/components/BucketsDisplay"

export default function HomePage() {
  const [currentBucket, setCurrentBucket] = useState(1);
  const [seenCards, setSeenCards] = useState(new Set<number>());
  const [repetitionCards, setRepetitionCards] = useState(new Set<number>());
  const [isBucketsDisplayOpen, setIsBucketsDisplayOpen] = useState(false)

  const totalBuckets = 34;
  const totalCards = 100;
  const completedBuckets = currentBucket - 1;

  useEffect(() => {
    const storedCurrentBucket = parseInt(localStorage.getItem('currentBucket') || '1', 10);
    const storedSeenCards = new Set<number>(JSON.parse(localStorage.getItem('seenCards') || '[]'));
    const storedRepetitionCards = new Set<number>(JSON.parse(localStorage.getItem('repetitionCards') || '[]'));

    setCurrentBucket(storedCurrentBucket);
    setSeenCards(storedSeenCards);
    setRepetitionCards(storedRepetitionCards);
  }, [])

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
          {/* Overall Progress */}
          <Card className="border-t-4 border-indigo-500" onClick={() => setIsBucketsDisplayOpen(true)}>
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <AcademicCapIcon className="w-6 h-6 mr-2 text-indigo-500" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(completedBuckets / totalBuckets) * 100} className="mb-2" />
              <p className="text-sm text-gray-600">
                {completedBuckets} of {totalBuckets} buckets completed
              </p>
            </CardContent>
          </Card>
          <BucketsDisplay isOpen={isBucketsDisplayOpen} onClose={() => setIsBucketsDisplayOpen(false)} />
          {/* Continue Learning */}
          <Link href={`/card`} className="block">
            <Card className="hover:shadow-lg transition-shadow border-t-4 border-green-500 h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <PlayIcon className="w-6 h-6 mr-2 text-green-500" />
                  {seenCards.size === 0 ? "Start" : "Continue"} Learning
                </CardTitle>
                <CardDescription>
                  Bucket {currentBucket}:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={(seenCards.size / totalCards) * 100} className="mb-2" />
                <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>
                          {seenCards.size} of {totalCards} cards completed
                        </span>
                        {true && (
                          <span>
                            Score: ?
                          </span>
                        )}
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
                <p className="text-sm text-gray-600">{repetitionCards.size} cards marked for revision</p>
              </CardContent>
            </Card>
          </Link>

          {/* All Buckets
          <Link href="/buckets" className="block">
            <Card className="hover:shadow-lg transition-shadow border-t-4 border-blue-500 h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <BookOpenIcon className="w-6 h-6 mr-2 text-blue-500" />
                  All Buckets
                </CardTitle>
                <CardDescription>View all vocabulary buckets</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{userProgress.totalBuckets} total buckets available</p>
              </CardContent>
            </Card>
          </Link>*/}
        </div>
      </main>
    </div>

  )
}

