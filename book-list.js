// Virtualized book list component to optimize rendering
export class BookList {
    constructor(containerId, onBookClick) {
        this.container = document.getElementById(containerId);
        this.onBookClick = onBookClick;
        this.books = [];
        this.bookProgress = {};
        this.language = 'en';
        this.renderStart = 0;
        this.renderEnd = 20; // Initial batch size
        this.loading = false;
    }

    setData(books, bookProgress, language) {
        this.books = Object.keys(books);
        this.bookProgress = bookProgress;
        this.language = language;
        this.renderBooks();
        this.container.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }

    renderBooks() {
        if (this.loading) return;
        this.loading = true;

        const fragment = document.createDocumentFragment();
        const batchSize = 10;
        const nextEnd = Math.min(this.renderEnd + batchSize, this.books.length);

        for (let i = this.renderEnd; i < nextEnd; i++) {
            const book = this.books[i];
            const chaptersInBook = Object.keys({}).length;
            const chaptersRead = this.bookProgress[book] || 0;
            const progressPercentage = chaptersInBook > 0 ? (chaptersRead / chaptersInBook) * 100 : 0;

            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.setAttribute('data-book', book);
            bookCard.innerHTML = `
        <div class="liquidGlass-wrapper rounded-xl cursor-pointer transition-transform hover:scale-105 active:scale-98">
          <div class="liquidGlass-effect rounded-xl"></div>
          <div class="liquidGlass-tint rounded-xl"></div>
          <div class="liquidGlass-shine rounded-xl"></div>
          <div class="liquidGlass-text p-4">
            <h3 class="text-lg font-semibold text-text-primary truncate">${book}</h3>
            <p class="text-sm text-text-secondary mt-1">${chaptersInBook} ${this.language === 'de' ? 'Kapitel' : 'Chapters'}</p>
            <div class="mt-3 h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
              <div class="h-1.5 rounded-full transition-all duration-300 ${progressPercentage === 100 ? 'finished-progress' : 'bg-gradient-to-r from-gold-accent to-gold-accent-light'}" style="width: ${progressPercentage}%"></div>
            </div>
          </div>
        </div>
      `;

            bookCard.addEventListener('click', (e) => {
                e.preventDefault();
                this.onBookClick(book);
            });

            fragment.appendChild(bookCard);
        }

        this.container.appendChild(fragment);
        this.renderEnd = nextEnd;
        this.loading = false;
    }

    handleScroll() {
        if (this.loading) return;
        const { scrollTop, scrollHeight, clientHeight } = this.container;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            this.renderBooks();
        }
    }

    clear() {
        this.container.innerHTML = '';
        this.renderStart = 0;
        this.renderEnd = 20;
        this.books = [];
    }
}
