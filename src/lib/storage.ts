import { Book, BookShelf, ShelfType } from '../types';

const STORAGE_KEY = 'book-library';

export function getShelves(): BookShelf[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaultShelves: BookShelf[] = [
      { id: 'wishlist', title: 'Wishlist', books: [] },
      { id: 'reading', title: 'Currently Reading', books: [] },
      { id: 'finished', title: 'Finished', books: [] }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultShelves));
    return defaultShelves;
  }
  return JSON.parse(stored);
}

export function addBookToShelf(book: Book, shelfId: ShelfType): void {
  const shelves = getShelves();
  const shelf = shelves.find(s => s.id === shelfId);
  if (shelf && !shelf.books.some(b => b.id === book.id)) {
    const bookWithProgress = {
      ...book,
      progress: shelfId === 'finished' ? 100 : (shelfId === 'reading' ? 0 : undefined)
    };
    shelf.books.push(bookWithProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shelves));
  }
}

export function moveBook(bookId: string, fromShelf: ShelfType, toShelf: ShelfType): void {
  const shelves = getShelves();
  const sourceShelf = shelves.find(s => s.id === fromShelf);
  const targetShelf = shelves.find(s => s.id === toShelf);
  
  if (sourceShelf && targetShelf) {
    const bookIndex = sourceShelf.books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
      const book = sourceShelf.books[bookIndex];
      const updatedBook = {
        ...book,
        progress: toShelf === 'finished' ? 100 : (toShelf === 'reading' ? 0 : undefined)
      };
      sourceShelf.books.splice(bookIndex, 1);
      targetShelf.books.push(updatedBook);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shelves));
    }
  }
}

export function updateBookProgress(bookId: string, shelfId: ShelfType, progress: number): void {
  const shelves = getShelves();
  const shelf = shelves.find(s => s.id === shelfId);
  if (shelf) {
    const book = shelf.books.find(b => b.id === bookId);
    if (book) {
      book.progress = progress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shelves));
    }
  }
}

export function removeBook(bookId: string, shelfId: ShelfType): void {
  const shelves = getShelves();
  const shelf = shelves.find(s => s.id === shelfId);
  if (shelf) {
    shelf.books = shelf.books.filter(b => b.id !== bookId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shelves));
  }
}