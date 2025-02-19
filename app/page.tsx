import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AcademicCapIcon, PlayIcon, ArrowPathIcon, BookOpenIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { getUserProgress, getCurrentBucket } from "../lib/api"
import { getRandomPronunciationTip } from "../lib/pronunciationTips"
import { SlidingMessages } from "@/components/SlidingMessages"

export default async function HomePage() {
  const userProgress = await getUserProgress()
  const currentBucket = await getCurrentBucket()
  const pronunciationTip = getRandomPronunciationTip()

  const bucketToShow = currentBucket || {
    id: 1,
    name: "Basic Vocabulary",
    totalCards: 100,
    completedCards: 0,
    isUnlocked: true,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Learn English by practice</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* App Tips */}
          <div className="col-span-full mb-4">
            <SlidingMessages />
          </div>
          {/* Overall Progress */}
          <Card className="border-t-4 border-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <AcademicCapIcon className="w-6 h-6 mr-2 text-indigo-500" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={(userProgress.completedBuckets / userProgress.totalBuckets) * 100} className="mb-2" />
              <p className="text-sm text-gray-600">
                {userProgress.completedBuckets} of {userProgress.totalBuckets} buckets completed
              </p>
            </CardContent>
          </Card>

          {/* Continue Learning */}
          <Link href={`/card`} className="block">
            <Card className="hover:shadow-lg transition-shadow border-t-4 border-green-500 h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <PlayIcon className="w-6 h-6 mr-2 text-green-500" />
                  Continue Learning
                </CardTitle>
                <CardDescription>
                  Bucket {bucketToShow.id}: {bucketToShow.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={(bucketToShow.completedCards / bucketToShow.totalCards) * 100} className="mb-2" />
                <p className="text-sm text-gray-600">
                  {bucketToShow.completedCards} of {bucketToShow.totalCards} cards completed
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Pronunciation Tip */}
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
          </Card>

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
                <p className="text-sm text-gray-600">{userProgress.markedForRevision} cards marked for revision</p>
              </CardContent>
            </Card>
          </Link>

          {/* All Buckets */}
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
          </Link>
        </div>
      </main>
    </div>
  )
}

