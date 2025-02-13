export interface Bucket {
  id: number
  name: string
  totalCards: number
  completedCards: number
  isUnlocked: boolean
}

export interface UserProgress {
  currentBucketId: number | null
  totalBuckets: number
  completedBuckets: number
  markedForRevision: number
}

