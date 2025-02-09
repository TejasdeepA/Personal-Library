class BookCard {
    constructor(book, currentShelf, options = {}) {
        this.book = book;
        this.currentShelf = currentShelf;
        this.options = options;
        this.element = null;
        this.menuOpen = false;
    }

    createFromTemplate() {
        const template = document.getElementById('bookCardTemplate');
        const element = template.content.cloneNode(true).children[0];
        
        // Set book details
        element.querySelector('img').src = this.book.coverUrl;
        element.querySelector('img').alt = this.book.title;
        element.querySelector('.book-title').textContent = this.book.title;
        element.querySelector('.book-author').textContent = this.book.author;

        // Setup progress bar if not wishlist
        if (this.currentShelf !== SHELF_TYPES.WISHLIST) {
            const progressContainer = element.querySelector('.progress-container');
            const progressFill = element.querySelector('.progress-fill');
            const progressInput = element.querySelector('.progress-input');
            
            progressContainer.classList.remove('hidden');
            progressFill.style.width = `${this.book.progress || 0}%`;

            if (this.currentShelf === SHELF_TYPES.READING) {
                progressInput.classList.remove('hidden');
                progressInput.value = this.book.progress || 0;
                progressInput.addEventListener('input', (e) => {
                    const progress = Number(e.target.value);
                    progressFill.style.width = `${progress}%`;
                    this.options.onProgressChange?.(progress);
                });
            }
        }

        // Setup action menu
        const actionButton = element.querySelector('.action-button');
        const actionMenu = element.querySelector('.action-menu');
        const menuOptions = element.querySelector('.menu-options');
        
        // Add move options
        Object.values(DEFAULT_SHELVES)
            .filter(shelf => shelf.id !== this.currentShelf)
            .forEach(shelf => {
                const button = document.createElement('button');
                button.textContent = `Move to ${shelf.title}`;
                button.addEventListener('click', () => {
                    this.options.onMove?.(shelf.id);
                    this.closeMenu();
                });
                menuOptions.appendChild(button);
            });

        // Setup remove button
        const removeButton = element.querySelector('.remove-button');
        removeButton.addEventListener('click', () => {
            this.options.onRemove?.();
            this.closeMenu();
        });

        // Setup menu toggle
        actionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => this.closeMenu());
        actionMenu.addEventListener('click', e => e.stopPropagation());

        this.element = element;
        return element;
    }

    toggleMenu() {
        const menu = this.element.querySelector('.action-menu');
        this.menuOpen = !this.menuOpen;
        menu.classList.toggle('hidden', !this.menuOpen);
    }

    closeMenu() {
        if (this.menuOpen) {
            this.menuOpen = false;
            this.element.querySelector('.action-menu').classList.add('hidden');
        }
    }
}