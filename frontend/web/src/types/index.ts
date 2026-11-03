// Matches our backend DTOs exactly
export enum ReadingStatus {
    PlanToRead = 0,
    Reading = 1,
    Completed = 2,
    Dropped = 3
}

export interface Book {
    id: number;
    title: string;
    author: string;
    totalPages: number;
    coverImageUrl?: string;
    createdAt: string;
}

export interface ReadingLog {
    id: number;
    bookId: number;
    bookTitle: string;
    status: ReadingStatus;
    currentPage: number;
    rating?: number;
    keyTakeaways?: string;
    personalNotes?: string;
    startDate?: string;
    finishDate?: string;
    lastUpdated: string;
}