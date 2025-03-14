import { Bucket } from './Bucket';

export class UserProgression {
  lang: string;
  progression: Bucket[];
  currentBucketID: number;
  currentRevisionCardID: number | null = null;

  constructor(lang: string = "FR", progression: Bucket[] = [new Bucket(1)], currentBucketID: number = 1, currentRevisionCardID) {
    this.lang = lang;
    this.progression = progression
    this.currentBucketID = currentBucketID;
    this.currentRevisionCardID = currentRevisionCardID;
  }

  // Deserialization: Convert a raw JSON object into a UserProgression instance
  static fromJSON(data: any): UserProgression {
    const progression = data.progression.map((bucket: any) => Bucket.fromJSON(bucket));
    return new UserProgression(data.lang, progression, data.currentBucketID, data.currentRevisionCardID);
  }

  // Serialization: Convert the UserProgression instance into a plain object for storage
  toJSON(): any {
    return {
      lang: this.lang,
      progression: this.progression.map((bucket) => bucket.toJSON()),
      currentBucketID: this.currentBucketID,
      currentRevisionCardID: this.currentRevisionCardID
    };
  }

  setCurrentRevisionCardID(cardID: number) {
    this.currentRevisionCardID = cardID;
  }

  setCurrentBucket(bucketID: number) {
    this.currentBucketID = bucketID;
    console.log("currentBucketID has been set to ", bucketID);
  }

  getCurrentBucket(): Bucket {
    return this.progression[this.currentBucketID - 1];
  }

  getBucket(bucketID: number): Bucket {
    return this.progression[bucketID - 1];
  }

  moveToNextBucket(): number {
    // TODO: Handle the case when currentBucketID = 34
    this.progression[this.currentBucketID - 1].complete();

    this.currentBucketID += 1;

    // Add next bucket in progression
    this.progression[this.currentBucketID - 1] = new Bucket(this.currentBucketID);

    return this.currentBucketID;
  }

  getCountCompletedBuckets(): number {
    console.log("this.progression.length - 1: ", this.progression.length - 1);
    return this.progression.length - 1;
  }

  getAllRevisionCards(): Set<number> {
    const allRevisionCards: number[] = [];

    // Loop through each bucket and accumulate its revision cards
    this.progression.forEach((bucket) => {
      // Use Set's add method to accumulate unique revision cards
      bucket.revisionCards.forEach((cardID) => {
        allRevisionCards.push(cardID);
      });
    });

    return new Set(allRevisionCards);
  }

  getBucketID(revisionCard: number): number {
    return Math.floor(revisionCard / 100) + 1;
  }

  static saveToStorage(userProgression: UserProgression): void {
    console.log("save userProgression to localStorage: ", userProgression);
    UserProgression.saveToLocalStorage(userProgression);
  }

  static saveToLocalStorage(userProgression: UserProgression): void {
    const serializedData = JSON.stringify(userProgression.toJSON());
    localStorage.setItem('userProgression', serializedData);
  }

  static loadFromStorage(): UserProgression | null {
    return UserProgression.loadFromLocalStorage();
  }

  static loadFromLocalStorage(): UserProgression | null {
    const savedData = localStorage.getItem('userProgression');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const deserializedUserProgression = UserProgression.fromJSON(parsedData);
      console.log("Loaded UserProgression from LocalStorage: ", deserializedUserProgression);
      return deserializedUserProgression;
    } else {
      const getOldModelFromLocalStorage = () => {
        const currentBucket = JSON.parse(localStorage.getItem('currentBucket'));
        const repetitionCards = JSON.parse(localStorage.getItem('repetitionCards'));
        const revisionCurrentCard = JSON.parse(localStorage.getItem('revision.currentCard'));
        const seenCards = JSON.parse(localStorage.getItem('seenCards'));

        // If any of the old model fields are missing, log an error and return null
        if (currentBucket === null || repetitionCards === null || revisionCurrentCard === null || seenCards === null) {
          console.error("Some fields of the old model are missing in localStorage.");
          return null;
        }

        // Return the combined old model
        return {
          currentBucket: currentBucket,
          repetitionCards: repetitionCards,
          revisioncurrentCard: revisionCurrentCard,
          seenCards: seenCards
        };
      };

      // Get the old model from localStorage
      const oldModel = getOldModelFromLocalStorage();
      if (!oldModel) {
        console.log("Exit if the old model doesn't exist");
        return;
      } else {
        console.log("Old model exists: ", oldModel);
      }

      // Initialize the new model structure
      const newModel: UserProgression = new UserProgression(
        "FR",
        [],
        oldModel.currentBucket,
        oldModel.revisioncurrentCard
      );

      // Function to create a bucket
      const createBucket = (bucketId, cards = [], seenCards = [], isCompleted = false, lastScore = 100) => {
        return new Bucket(
          bucketId,
          new Set(cards),
          0,
          new Set(seenCards),
          lastScore,
          isCompleted
        );
      };

      // Distribute repetitionCards into buckets based on card number ranges (1-100, 101-200, etc.)
      const distributeCardsIntoBuckets = (repetitionCards, numBuckets) => {
        const buckets = [];

        // Loop through each bucket (1 to numBuckets)
        for (let i = 1; i <= numBuckets; i++) {
          const start = (i - 1) * 100 + 1;
          const end = i * 100;

          // Get all cards that fit within this bucket range
          const cardsInBucket = repetitionCards.filter(card => card >= start && card <= end);

          // Push the bucket with its respective cards
          buckets.push({ bucketId: i, cards: cardsInBucket });
        }

        return buckets;
      };

      // Distribute the repetitionCards into the buckets
      const buckets = distributeCardsIntoBuckets(oldModel.repetitionCards, oldModel.currentBucket);

      // Loop through each bucket and create the new model
      for (let i = 1; i <= oldModel.currentBucket; i++) {
        const bucket = buckets[i - 1]; // Get the cards for the current bucket

        // If it's the last bucket, include seenCards
        if (i === oldModel.currentBucket) {
          newModel.progression.push(createBucket(i, bucket.cards, oldModel.seenCards, false, null));
        } else {
          // Otherwise, create empty buckets with no seenCards
          newModel.progression.push(createBucket(i, bucket.cards, [], true, 100));
        }
      }

      // Output the new model
      console.log(JSON.stringify(newModel, null, 2));

      localStorage.removeItem('currentBucket');
      localStorage.removeItem('repetitionCards');
      localStorage.removeItem('revision.currentCard');
      localStorage.removeItem('seenCards');

      // Store the new model in localStorage
      return newModel; //localStorage.setItem('userProgression', JSON.stringify(newModel));

    }
    console.log("UserProgression from LocalStorage is empty !");
    return null;
  }
}
