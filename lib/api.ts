import type { Bucket, UserProgress } from "../types/learning"

export async function getUserProgress(): Promise<UserProgress> {
  // This is a mock function. Replace with actual API call.
  return {
    currentBucketId: 2,
    totalBuckets: 34,
    completedBuckets: 1,
    markedForRevision: 15,
  }
}

export async function getCurrentBucket(): Promise<Bucket | null> {
  // This is a mock function. Replace with actual API call.
  return {
    id: 2,
    name: "Common Phrases",
    totalCards: 100,
    completedCards: 25,
    isUnlocked: true,
  }
}

