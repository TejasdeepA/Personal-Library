import React from 'react';
import { BookShelf as BookShelfType, ShelfType } from '../types';
import { BookCard } from './BookCard';

interface BookShelfProps {
  shelf: BookShelfType;
  onMoveBook: (bookId: string, targetShelf: ShelfType) => void;
  onProgressChange: (bookId: string, progress: number) => void;
  onRemoveBook: (bookId: string) => void;
}

export function BookShelf({ shelf, onMoveBook, onProgressChange, onRemoveBook }: BookShelfProps) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">{shelf.title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shelf.books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            currentShelf={shelf.id}
            progress={shelf.id === 'finished' ? 100 : (shelf.id === 'reading' ? book.progress || 0 : 0)}
            onAction={(action, targetShelf) => {
              if (action === 'move' && targetShelf) onMoveBook(book.id, targetShelf);
              if (action === 'remove') onRemoveBook(book.id);
            }}
            onProgressChange={shelf.id === 'reading' ? 
              (progress) => onProgressChange(book.id, progress) : 
              undefined
            }
          />
        ))}
      </div>
      
      {shelf.books.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No books in this shelf yet
        </div>
      )}
    </div>
  );
}