// Lazy chapter rendering component
export class ChapterView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.versesPerBatch = 50; // Load 50 verses at a time for long chapters
        this.allVerses = [];
        this.renderedVerses = 0;
        this.language = 'en';
    }

    render(book, chapter, chapterData, language) {
        this.book = book;
        this.chapter = chapter;
        this.language = language;
        this.allVerses = Object.entries(chapterData || {});
        this.renderedVerses = 0;
        this.container.setAttribute('lang', language);

        // Clear and render header
        this.container.innerHTML = `<h1 class="text-2xl font-bold mb-6">${book} ${chapter}</h1>`;
        this.renderNextBatch();

        // Add scroll listener for infinite loading
        this.container.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }

    renderNextBatch() {
        const fragment = document.createDocumentFragment();
        const start = this.renderedVerses;
        const end = Math.min(start + this.versesPerBatch, this.allVerses.length);

        for (let i = start; i < end; i++) {
            const [verse, content] = this.allVerses[i];
            const p = document.createElement('p');
            p.className = 'mb-4 leading-relaxed';
            p.innerHTML = `<sup class="relative -top-1 mr-1 select-none text-xs font-semibold text-gold-accent">${verse}</sup>${content}`;
            fragment.appendChild(p);
        }

        this.container.appendChild(fragment);
        this.renderedVerses = end;

        // Remove scroll listener if all verses rendered
        if (this.renderedVerses >= this.allVerses.length) {
            this.container.removeEventListener('scroll', this.handleScroll);
        }
    }

    handleScroll() {
        if (this.renderedVerses >= this.allVerses.length) return;
        const { scrollTop, scrollHeight, clientHeight } = this.container;
        if (scrollTop + clientHeight >= scrollHeight - 200) { // Trigger 200px before bottom
            this.renderNextBatch();
        }
    }
}
