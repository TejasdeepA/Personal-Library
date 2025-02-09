import React, { useState, useRef, useEffect } from 'react';
import { Book, ShelfType } from '../types';
import { MoreHorizontal, Trash2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
  currentShelf: ShelfType;
  progress?: number;
  onAction: (action: 'move' | 'remove', targetShelf?: ShelfType) => void;
  onProgressChange?: (progress: number) => void;
}

export function BookCard({ book, currentShelf, progress = 0, onAction, onProgressChange }: BookCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shelves: { id: ShelfType; title: string }[] = [
    { id: 'wishlist', title: 'Wishlist' },
    { id: 'reading', title: 'Currently Reading' },
    { id: 'finished', title: 'Finished' }
  ];

  return (
    <div className="group relative bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl">
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
        <img
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        
        {currentShelf !== 'wishlist' && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        {currentShelf === 'reading' && onProgressChange && (
          <input
            type="range"
            min="1"
            max="99"
            value={progress}
            onChange={(e) => onProgressChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        )}
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                {shelves
                  .filter(shelf => shelf.id !== currentShelf)
                  .map(shelf => (
                    <button
                      key={shelf.id}
                      onClick={() => {
                        onAction('move', shelf.id);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Move to {shelf.title}
                    </button>
                  ))}
                <button
                  onClick={() => {
                    onAction('remove');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                >
                  <div className="flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove from library
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}