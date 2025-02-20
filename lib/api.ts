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

export function getCurrentBucket(): Int {
  // if no currentBucket is stored => 1
  const storedCurrentBucket = localStorage.getItem('currentBucket');
  if (storedCurrentBucket)
    return parseInt(storedCurrentBucket, 10);
  else 1;
}

