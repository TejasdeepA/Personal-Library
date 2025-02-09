class BookShelf {
    constructor(shelf, options = {}) {
        this.shelf = shelf;
        this.options = options;
    }

    render() {
        const shelfElement = document.createElement('div');
        shelfElement.className = 'shelf';
        
        const titleElement = document.createElement('h2');
        titleElement.className = 'shelf-title';
        titleElement.textContent = this.shelf.title;
        shelfElement.appendChild(titleElement);

        const booksGrid = document.createElement('div');
        booksGrid.className = 'books-grid';

        if (this.shelf.books.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-shelf';
            emptyMessage.textContent = 'No books in this shelf yet';
            shelfElement.appendChild(emptyMessage);
        } else {
            this.shelf.books.forEach(book => {
                const bookCard = new BookCard(book, this.shelf.id, {
                    onMove: (targetShelf) => this.options.onMoveBook?.(book.id, targetShelf),
                    onRemove: () => this.options.onRemoveBook?.(book.id),
                    onProgressChange: (progress) => this.options.onProgressChange?.(book.id, progress)
                });
                booksGrid.appendChild(bookCard.createFromTemplate());
            });
            shelfElement.appendChild(booksGrid);
        }

        return shelfElement;
    }
}