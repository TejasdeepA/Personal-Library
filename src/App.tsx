import React, { useState, useEffect } from 'react';
import { Book, BookShelf as BookShelfType, ShelfType } from './types';
import { searchBooks } from './lib/googleBooks';
import { getShelves, addBookToShelf, moveBook, removeBook, updateBookProgress } from './lib/storage';
import { SearchBar } from './components/SearchBar';
import { BookShelf } from './components/BookShelf';
import { Library } from 'lucide-react';

function App() {
  const [shelves, setShelves] = useState<BookShelfType[]>([]);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShelves(getShelves());
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    const results = await searchBooks(query);
    setSearchResults(results);
    setLoading(false);
  };

  const handleAddToShelf = (book: Book, shelfId: ShelfType) => {
    addBookToShelf(book, shelfId);
    setShelves(getShelves());
    setSearchResults([]);
  };

  const handleMoveBook = (bookId: string, fromShelf: ShelfType, toShelf: ShelfType) => {
    moveBook(bookId, fromShelf, toShelf);
    setShelves(getShelves());
  };

  const handleProgressChange = (bookId: string, shelfId: ShelfType, progress: number) => {
    updateBookProgress(bookId, shelfId, progress);
    setShelves(getShelves());
  };

  const handleRemoveBook = (bookId: string, shelfId: ShelfType) => {
    removeBook(bookId, shelfId);
    setShelves(getShelves());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Library className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Personal Library</h1>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map(book => (
                <div key={book.id} className="relative group">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="space-y-2">
                      {(['wishlist', 'reading', 'finished'] as ShelfType[]).map(shelfId => (
                        <button
                          key={shelfId}
                          onClick={() => handleAddToShelf(book, shelfId)}
                          className="block w-full px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded"
                        >
                          Add to {shelves.find(s => s.id === shelfId)?.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-8">
          {shelves.map(shelf => (
            <BookShelf
              key={shelf.id}
              shelf={shelf}
              onMoveBook={(bookId, targetShelf) => handleMoveBook(bookId, shelf.id, targetShelf)}
              onProgressChange={(bookId, progress) => handleProgressChange(bookId, shelf.id, progress)}
              onRemoveBook={(bookId) => handleRemoveBook(bookId, shelf.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;