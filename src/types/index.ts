export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  genre: string[];
  progress?: number;
}

export type ShelfType = 'wishlist' | 'reading' | 'finished';

export interface BookShelf {
  id: ShelfType;
  title: string;
  books: Book[];
}