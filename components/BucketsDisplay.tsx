import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lock, Unlock } from "lucide-react"
import Link from "next/link"

interface BucketProps {
  number: number
  completedCards: number
  totalCards: number
  score: number | null
  isUnlocked: boolean
}

const Bucket: React.FC<BucketProps> = ({ number, completedCards, totalCards, score, isUnlocked }) => (
  <Link href="#" className="block">
    <Button
      variant="outline"
      className="w-full py-4 flex flex-col items-start justify-between px-4 hover:bg-gray-100 h-auto"
    >
      <div className="flex justify-between items-center w-full mb-2">
        <span className="text-lg font-semibold">Bucket {number}</span>
        <div className="flex items-center space-x-2">
          {isUnlocked ? <Unlock className="w-5 h-5 text-green-500" /> : <Lock className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
      <Progress value={(completedCards / totalCards) * 100} className="w-full mb-2" />
      <div className="flex justify-between items-center w-full text-sm">
        <span>
          {completedCards} of {totalCards} cards
        </span>
        {score !== null && <Badge variant="secondary">Score: {score}/100</Badge>}
      </div>
    </Button>
  </Link>
)

interface BucketsDisplayProps {
  isOpen: boolean
  onClose: () => void
}

export const BucketsDisplay: React.FC<BucketsDisplayProps> = ({ isOpen, onClose }) => {
  // This would typically come from your app's state or an API
  const [buckets, setBuckets] = useState<BucketProps[]>(
    Array.from({ length: 34 }, (_, i) => ({
      number: i + 1,
      completedCards: i === 0 ? 100 : 0, // Only the first bucket has completed cards
      totalCards: 100,
      score: i === 0 ? 100 : null, // Only the first bucket has a score
      isUnlocked: i === 0, // Only the first bucket is unlocked
    })),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your Learning Buckets</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-4">
            {buckets.map((bucket) => (
              <Bucket key={bucket.number} {...bucket} />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

