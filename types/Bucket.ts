export class Bucket {
  id: number;
  revisionCards: Set<number>;
  revisionCurrentCardID: number;
  seenCards: Set<number>;
  lastScore: number | null;
  isCompleted: Boolean;

  constructor(
    id: number,
    revisionCards: Set<number> = new Set(),
    revisionCurrentCardID: number = 0,
    seenCards: Set<number> = new Set(),
    lastScore: number | null = null,
    isCompleted: boolean = false
  ) {
    this.id = id;
    this.revisionCards = revisionCards;
    this.revisionCurrentCardID = revisionCurrentCardID;
    this.seenCards = seenCards;
    this.lastScore = lastScore;
    this.isCompleted = isCompleted;
  }

  restart(): void {
    this.isCompleted = false;
  }

  // Setter for revisionCards
  setRevisionCards(newCards: number[]): void {
    this.revisionCards = new Set(newCards); // Convert array of numbers to Set
  }

  // Add a single card ID to the revisionCards set
  addRevisionCard(cardID: number): void {
    console.log("Card marked for revision: ", cardID);
    this.revisionCards.add(cardID);
  }

  deleteRevisionCard(cardID: number): void {
    console.log("Card unMarked for revision: ", cardID);
    this.revisionCards.delete(cardID);
  }

  setSeenCards(newSeenCards: number[]): void {
    this.seenCards = new Set(newSeenCards);
  }

  clearSeenCards(): void {
    this.seenCards = new Set();
    console.log("cleared seenCards for Bucket: ", this.id);
  }

  complete(): void {
    this.clearSeenCards();
    this.lastScore = 100 - this.revisionCards.size;
    this.isCompleted = true;
  }

  // Add a single seen card ID to the seenCards set
  addSeenCard(cardID: number): void {
    console.log("add seen card: ", cardID);
    console.log("print seenCards before: ", this.seenCards);
    this.seenCards.add(cardID); // Add seen card ID to the Set (ensures uniqueness)
    console.log("print seenCards after: ", this.seenCards);
  }

  // Static method to create a Bucket from JSON data
  static fromJSON(data: any): Bucket {
    return new Bucket(
      data.id,
      Array.isArray(data.revisionCards) ? new Set(data.revisionCards) : new Set(),
      data.revisionCurrentCardID || 0,
      Array.isArray(data.seenCards) ? new Set(data.seenCards) : new Set(),
      data.lastScore || null,
      data.isCompleted
    );
  }

  // Method to convert Bucket instance to a plain object for serialization
  toJSON(): any {
    const json: any = {
      id: this.id,
      revisionCards: Array.from(this.revisionCards),
      revisionCurrentCardID: this.revisionCurrentCardID,
      seenCards: Array.from(this.seenCards),
      isCompleted: this.isCompleted
    };

    // Only include lastScore if it's not null
    if (this.lastScore !== null) {
      json.lastScore = this.lastScore;
    }

    return json;
  }
}
