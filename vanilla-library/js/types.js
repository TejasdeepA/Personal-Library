// Shelf types
const SHELF_TYPES = {
    WISHLIST: 'wishlist',
    READING: 'reading',
    FINISHED: 'finished'
};

// Default shelves configuration
const DEFAULT_SHELVES = [
    { id: SHELF_TYPES.WISHLIST, title: 'Wishlist', books: [] },
    { id: SHELF_TYPES.READING, title: 'Currently Reading', books: [] },
    { id: SHELF_TYPES.FINISHED, title: 'Finished', books: [] }
];