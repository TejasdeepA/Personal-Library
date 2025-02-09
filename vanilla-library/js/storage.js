const STORAGE_KEY = 'book-library';

function getShelves() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SHELVES));
        return DEFAULT_SHELVES;
    }
    return JSON.parse(stored);
}

function addBookToShelf(book, shelfId) {
    const shelves = getShelves();
    const shelf = shelves.find(s => s.id === shelfId);
    if (shelf && !shelf.books.some(b => b.id === book.id)) {
        const bookWithProgress = {
            ...book,
            progress: shelfId === SHELF_TYPES.FINISHED ? 100 : 
                     (shelfId === SHELF_TYPES.READING ? 0 : undefined)
        };
        shelf.books.push(bookWithProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shelves));
    }
    return shelves;
}

function moveBook(bookId, fromShelf, toShelf) {
    const shelves = getShelves();
    const sourceShelf = shelves.find(s => s.id === fromShelf);
    const targetShelf = shelves.find(s => s.id === toShelf);
    
    if (sourceShelf && targetShelf) {
        const bookIndex = sourceShelf.books.findIndex(b => b.id === bookId);
        if (bookIndex !== -1) {
            const book = sourceShelf.books[bookIndex];
            const updatedBook = {
                ...book,
                progress: toShelf === SHELF_TYPES.FINISHED ? 100 : 
                         (toShelf === SHELF_TYPES.READING ? 0 : undefined)
            };
            sourceShelf.books.splice(bookIndex, 1);
            targetShelf.books.push(updatedBook);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(shelves));
        }
    }
    return shelves;
}

function updateBookProgress(bookId, shelfId, progress) {
    const shelves = getShelves();
    const shelf = shelves.find(s => s.id === shelfId);
    if (shelf) {
        const book = shelf.books.find(b => b.id === bookId);
        if (book) {
            book.progress = progress;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(shelves));
        }
    }
    return shelves;
}

function removeBook(bookId, shelfId) {
    const shelves = getShelves();
    const shelf = shelves.find(s => s.id === shelfId);
    if (shelf) {
        shelf.books = shelf.books.filter(b => b.id !== bookId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shelves));
    }
    return shelves;
}