class App {
    constructor() {
        this.shelves = getShelves();
        this.searchForm = document.getElementById('searchForm');
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.searchResultsGrid = document.getElementById('searchResultsGrid');
        this.loading = document.getElementById('loading');
        this.shelvesContainer = document.getElementById('shelves');

        this.init();
    }

    init() {
        // Initialize Lucide icons
        lucide.createIcons();

        // Setup event listeners
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        // Initial render
        this.renderShelves();
    }

    async handleSearch() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.loading.classList.remove('hidden');
        this.searchResults.classList.add('hidden');

        const results = await searchBooks(query);
        
        this.loading.classList.add('hidden');
        this.searchResultsGrid.innerHTML = '';

        if (results.length > 0) {
            results.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.className = 'book-card';
                bookElement.innerHTML = `
                    <img src="${book.coverUrl}" alt="${book.title}" class="w-full h-64 object-cover rounded-lg shadow-md">
                    <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div class="space-y-2">
                            ${Object.values(DEFAULT_SHELVES).map(shelf => `
                                <button class="block w-full px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded"
                                        data-shelf="${shelf.id}">
                                    Add to ${shelf.title}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;

                bookElement.querySelectorAll('button').forEach(button => {
                    button.addEventListener('click', () => {
                        const shelfId = button.dataset.shelf;
                        this.shelves = addBookToShelf(book, shelfId);
                        this.searchInput.value = '';
                        this.searchResults.classList.add('hidden');
                        this.renderShelves();
                    });
                });

                this.searchResultsGrid.appendChild(bookElement);
            });

            this.searchResults.classList.remove('hidden');
        }
    }

    renderShelves() {
        this.shelvesContainer.innerHTML = '';
        this.shelves.forEach(shelf => {
            const bookShelf = new BookShelf(shelf, {
                onMoveBook: (bookId, targetShelf) => {
                    this.shelves = moveBook(bookId, shelf.id, targetShelf);
                    this.renderShelves();
                },
                onRemoveBook: (bookId) => {
                    this.shelves = removeBook(bookId, shelf.id);
                    this.renderShelves();
                },
                onProgressChange: (bookId, progress) => {
                    this.shelves = updateBookProgress(bookId, shelf.id, progress);
                    this.renderShelves();
                }
            });
            this.shelvesContainer.appendChild(bookShelf.render());
        });
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});