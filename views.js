import { triggerHapticFeedback } from './utils.js';

const translations = {
    en: {
        continueReading: 'Continue Reading',
        theBible: 'The Bible',
        read: 'Read',
        ask: 'Ask',
        loading: 'Loading...',
        selectLanguage: 'Select Language',
        cancel: 'Cancel'
    },
    de: {
        continueReading: 'Weiterlesen',
        theBible: 'Die Bibel',
        read: 'Lesen',
        ask: 'Fragen',
        loading: 'Laden...',
        selectLanguage: 'Sprache auswählen',
        cancel: 'Abbrechen'
    }
};

export class ViewManager {
    constructor() {
        this.domElements = {
            mainView: document.querySelector('.view-main'),
            readingView: document.querySelector('.view-reading'),
            readingMain: document.querySelector('.view-reading main'),
            backToMainButton: document.querySelector('.view-reading header a'),
            languageSwitcher: document.getElementById('language-switcher'),
            bookListSection: document.getElementById('book-list'),
            continueReadingLink: document.querySelector('a[href="#reading-view"]'),
            continueReadingProgressBar: document.getElementById('continue-reading-progress-bar'),
            prevChapterButton: document.querySelector('.view-reading footer a:first-child'),
            nextChapterButton: document.querySelector('.view-reading footer a:last-child'),
            readingHeader: document.querySelector('.view-reading h1'),
            prevChapterLabel: document.querySelector('.view-reading footer a:first-child span:last-child'),
            nextChapterLabel: document.querySelector('.view-reading footer a:last-child span:first-child'),
            loadingOverlay: document.getElementById('loading-overlay'),
            languageModal: document.getElementById('language-modal'),
            closeModalButton: document.getElementById('close-modal'),
            langEnButton: document.getElementById('lang-en'),
            langDeButton: document.getElementById('lang-de')
        };

        // Swipe properties
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.swipeThreshold = 50; // Minimum pixels to register a swipe
        this.isSwiping = false;

        this.initOverscrollBounce();
    }

    showMainView() {
        this.domElements.mainView.classList.remove('transition-out');
        this.domElements.mainView.classList.add('transition-in');
        this.domElements.readingView.classList.remove('transition-in');
        this.domElements.readingView.classList.add('transition-out');

        this.domElements.mainView.style.display = 'flex';
        this.domElements.readingView.style.display = 'flex'; // Keep it flex during transition

        setTimeout(() => {
            this.domElements.readingView.style.display = 'none';
        }, 500); // Match transition duration
    }

    showReadingView() {
        this.domElements.mainView.classList.remove('transition-in');
        this.domElements.mainView.classList.add('transition-out');
        this.domElements.readingView.classList.remove('transition-out');
        this.domElements.readingView.classList.add('transition-in');

        this.domElements.mainView.style.display = 'flex'; // Keep it flex during transition
        this.domElements.readingView.style.display = 'flex';

        setTimeout(() => {
            this.domElements.mainView.style.display = 'none';
        }, 500); // Match transition duration
    }

    renderBookList(books, bookProgress, language = 'en') {
        const bookArray = Object.keys(books);
        let html = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">';
        bookArray.forEach((book, index) => {
            const chaptersInBook = Object.keys(books[book]).length;
            const chaptersRead = bookProgress[book] || 0;
            const progressPercentage = chaptersInBook > 0 ? (chaptersRead / chaptersInBook) * 100 : 0;

            html += `
                <div class="book-card liquidGlass-wrapper rounded-xl" data-book="${book}">
                    <div class="liquidGlass-effect rounded-xl"></div>
                    <div class="liquidGlass-tint rounded-xl"></div>
                    <div class="liquidGlass-shine rounded-xl"></div>
                    <a class="book-link liquidGlass-text block p-5 transition-transform active:scale-[0.98]" href="#">
            <h3 class="text-lg font-semibold text-text-primary truncate">${book}</h3>
            <p class="text-sm text-text-secondary mt-1">${chaptersInBook} ${language === 'de' ? 'Kapitel' : 'Chapters'}</p>
            <div class="mt-4 h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
                            <div class="h-1.5 rounded-full ${progressPercentage === 100 ? 'finished-progress' : 'bg-gradient-to-r from-gold-accent to-gold-accent-light'}" style="width: ${progressPercentage}%"></div>
                        </div>
                    </a>
                </div>
            `;
        });
        html += '</div>';
        this.domElements.bookListSection.innerHTML = html;
        this.domElements.bookListSection.setAttribute('lang', language);

        // Animate book cards on render
        const bookCards = this.domElements.bookListSection.querySelectorAll('.book-card');
        bookCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 50); // Staggered delay
        });
    }

    renderChapter(book, chapter, chapterData, language = 'en') {
        const article = this.domElements.readingView.querySelector('article');
        const fragment = document.createDocumentFragment();
        if (chapterData) {
            Object.entries(chapterData).forEach(([verse, content]) => {
                const p = document.createElement('p');
                p.className = 'mb-4';
                p.innerHTML = `<sup class="relative -top-1.5 select-none pr-2 text-xs font-semibold text-gold-accent">${verse}</sup>${content}`;
                fragment.appendChild(p);
            });
        } else {
            const p = document.createElement('p');
            p.textContent = 'Chapter not found.';
            fragment.appendChild(p);
        }
        article.innerHTML = '';
        article.appendChild(fragment);
        article.setAttribute('lang', language);
        this.domElements.readingMain.scrollTop = 0; // Scroll to top when rendering a chapter
        this.domElements.readingHeader.innerHTML = language === 'de' ? `<span class="book-chapter-label">${book}<br><span class="chapter-label">Kapitel ${chapter}</span></span>` : `<span class="book-chapter-label">${book}<br><span class="chapter-label">Chapter ${chapter}</span></span>`;
    }

    updateNavigation(book, chapter, totalChapters, language) {
        const currentChapter = parseInt(chapter, 10);
        const prevChapterIcon = this.domElements.prevChapterButton.querySelector('span:first-child');
        const nextChapterIcon = this.domElements.nextChapterButton.querySelector('span:last-child');

        if (currentChapter > 1) {
            this.domElements.prevChapterButton.style.pointerEvents = 'auto';
            this.domElements.prevChapterButton.style.opacity = '1';
            prevChapterIcon.style.display = 'inline';
            this.domElements.prevChapterLabel.innerHTML = language === 'de' ? `<span class="book-chapter-label">${book}<br><span class="chapter-label">Kapitel ${currentChapter - 1}</span></span>` : `<span class="book-chapter-label">${book}<br><span class="chapter-label">Chapter ${currentChapter - 1}</span></span>`;
        } else {
            this.domElements.prevChapterButton.style.pointerEvents = 'none';
            this.domElements.prevChapterButton.style.opacity = '0.5';
            this.domElements.prevChapterLabel.textContent = language === 'de' ? 'Erstes Kapitel' : 'First Chapter';
        }

        if (currentChapter < totalChapters) {
            this.domElements.nextChapterButton.style.pointerEvents = 'auto';
            this.domElements.nextChapterButton.style.opacity = '1';
            nextChapterIcon.style.display = 'inline';
            this.domElements.nextChapterLabel.innerHTML = language === 'de' ? `<span class="book-chapter-label">${book}<br><span class="chapter-label">Kapitel ${currentChapter + 1}</span></span>` : `<span class="book-chapter-label">${book}<br><span class="chapter-label">Chapter ${currentChapter + 1}</span></span>`;
        } else {
            this.domElements.nextChapterButton.style.pointerEvents = 'none';
            this.domElements.nextChapterButton.style.opacity = '0.5';
            this.domElements.nextChapterLabel.textContent = language === 'de' ? 'Letztes Kapitel' : 'Last Chapter';
        }
    }

    updateContinueReading(book, chapter, totalChapters, language) {
        const continueReadingTitle = this.domElements.continueReadingLink.querySelector('h2');
        if (continueReadingTitle) {
            continueReadingTitle.innerHTML = language === 'de' ? `<span class="book-chapter-label">${book}<br><span class="chapter-label">Kapitel ${chapter}</span></span>` : `<span class="book-chapter-label">${book}<br><span class="chapter-label">Chapter ${chapter}</span></span>`;

            const progress = (chapter / totalChapters) * 100;
            this.domElements.continueReadingProgressBar.style.width = `${progress}%`;
        }
    }

    setLanguageSwitcher(language) {
        this.domElements.languageSwitcher.innerHTML = `<span class="material-symbols-outlined text-2xl">language</span>`;
        document.documentElement.setAttribute('lang', language);
        this.updateUITexts(language);
        this.updateLanguageModal(language);
    }

    showLanguageModal() {
        this.domElements.languageModal.classList.remove('hidden');
        this.domElements.languageModal.classList.add('flex');
    }

    hideLanguageModal() {
        this.domElements.languageModal.classList.add('hidden');
        this.domElements.languageModal.classList.remove('flex');
    }

    updateLanguageModal(currentLanguage) {
        if (currentLanguage === 'en') {
            this.domElements.langEnButton.classList.add('bg-gold-accent/10');
            this.domElements.langEnButton.querySelector('span').classList.add('text-gold-accent');
            this.domElements.langDeButton.classList.remove('bg-gold-accent/10');
            this.domElements.langDeButton.querySelector('span').classList.remove('text-gold-accent');
        } else {
            this.domElements.langDeButton.classList.add('bg-gold-accent/10');
            this.domElements.langDeButton.querySelector('span').classList.add('text-gold-accent');
            this.domElements.langEnButton.classList.remove('bg-gold-accent/10');
            this.domElements.langEnButton.querySelector('span').classList.remove('text-gold-accent');
        }
    }

    showError(error) {
        this.domElements.bookListSection.innerHTML = `<p class="text-center text-red-500">Error: ${error.message}. Please try again later.</p>`;
    }

    bindBookListClick(handler) {
        this.domElements.bookListSection.addEventListener('click', (e) => {
            const bookCard = e.target.closest('.book-card');
            if (bookCard) {
                e.preventDefault();
                triggerHapticFeedback();
                const book = bookCard.dataset.book;
                handler(book);
            }
        });
    }

    bindNavigationClicks(prevHandler, nextHandler, backHandler) {
        this.domElements.prevChapterButton.addEventListener('click', (e) => { e.preventDefault(); triggerHapticFeedback(); prevHandler(); });
        this.domElements.nextChapterButton.addEventListener('click', (e) => { e.preventDefault(); triggerHapticFeedback(); nextHandler(); });
        this.domElements.backToMainButton.addEventListener('click', (e) => { e.preventDefault(); triggerHapticFeedback(); backHandler(); });
    }

    bindContinueReading(handler) {
        this.domElements.continueReadingLink.addEventListener('click', (e) => {
            e.preventDefault();
            triggerHapticFeedback();
            handler();
        });
    }

    bindLanguageModal(openHandler, closeHandler, langSelectHandler) {
        this.domElements.languageSwitcher.addEventListener('click', () => { triggerHapticFeedback(); openHandler(); });
        this.domElements.closeModalButton.addEventListener('click', () => { triggerHapticFeedback(); closeHandler(); });
        this.domElements.langEnButton.addEventListener('click', () => { triggerHapticFeedback(); langSelectHandler('en'); });
        this.domElements.langDeButton.addEventListener('click', () => { triggerHapticFeedback(); langSelectHandler('de'); });
    }

    bindSwipeNavigation(prevChapterHandler, nextChapterHandler) {
        const readingView = this.domElements.readingView;
        const article = readingView.querySelector('article');

        readingView.addEventListener('touchstart', (e) => {
            if (this.isSwiping) return;
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
            this.currentX = this.startX;
            this.currentY = this.startY;
        }, { passive: true });

        readingView.addEventListener('touchmove', (e) => {
            if (this.isSwiping) return;
            this.currentX = e.touches[0].clientX;
            this.currentY = e.touches[0].clientY;
        }, { passive: true });

        readingView.addEventListener('touchend', () => {
            if (this.isSwiping) return;

            const diffX = this.currentX - this.startX;
            const diffY = this.currentY - this.startY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.swipeThreshold) {
                this.isSwiping = true;
                let direction = '';
                if (diffX > 0) {
                    direction = 'right';
                    setTimeout(prevChapterHandler, 100);
                } else {
                    direction = 'left';
                    setTimeout(nextChapterHandler, 100);
                }

                article.classList.add(`swipe-out-${direction}`);
                article.addEventListener('animationend', () => {
                    article.classList.remove(`swipe-out-${direction}`);
                    article.classList.add(`swipe-in-${direction}`);
                    article.addEventListener('animationend', () => {
                        article.classList.remove(`swipe-in-${direction}`);
                        this.isSwiping = false;
                    }, { once: true });
                }, { once: true });
            }

            this.startX = 0;
            this.startY = 0;
            this.currentX = 0;
            this.currentY = 0;
        });
    }

    showLoading(message = 'Loading...') {
        if (this.domElements.loadingOverlay) {
            const messageEl = this.domElements.loadingOverlay.querySelector('.loading-message');
            if (messageEl) messageEl.textContent = message;
            this.domElements.loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.domElements.loadingOverlay) {
            this.domElements.loadingOverlay.style.display = 'none';
        }
    }

    updateLoading(message) {
        if (this.domElements.loadingOverlay) {
            const messageEl = this.domElements.loadingOverlay.querySelector('.loading-message');
            if (messageEl) messageEl.textContent = message;
        }
    }

    updateUITexts(language) {
        const t = translations[language];
        // Update Continue Reading label
        const continueReadingP = this.domElements.continueReadingLink.querySelector('p');
        if (continueReadingP) continueReadingP.textContent = t.continueReading;
        // Update The Bible title (only if no progress set it)
        const bibleTitleH2 = this.domElements.continueReadingLink.querySelector('h2');
        if (bibleTitleH2 && bibleTitleH2.textContent === translations.en.theBible) bibleTitleH2.textContent = t.theBible;
        // Update Read tab
        const readBtn = document.querySelector('a[href="#bible-app"] span');
        if (readBtn) readBtn.textContent = t.read;
        // Update Ask tab
        const askBtn = document.querySelector('a[href="#"] span');
        if (askBtn) askBtn.textContent = t.ask;
        // Update loading message (only if default)
        const loadingMsg = document.querySelector('.loading-message');
        if (loadingMsg && loadingMsg.textContent === translations.en.loading) loadingMsg.textContent = t.loading;

        // Update modal texts
        const modalTitle = this.domElements.languageModal.querySelector('#modal-title');
        if (modalTitle) modalTitle.textContent = t.selectLanguage;
        if (this.domElements.closeModalButton) this.domElements.closeModalButton.textContent = t.cancel;
    }

    initOverscrollBounce() {
        const scrollAreas = [
            this.domElements.mainView.querySelector('main'),
            this.domElements.readingMain
        ];

        scrollAreas.forEach(scrollContainer => {
            if (!scrollContainer) return;

            const wrapper = document.createElement('div');
            wrapper.classList.add('overscroll-wrapper');
            while (scrollContainer.firstChild) {
                wrapper.appendChild(scrollContainer.firstChild);
            }
            scrollContainer.appendChild(wrapper);

            let startY = 0;
            let isDragging = false;
            let rafId = null;

            scrollContainer.addEventListener('touchstart', (e) => {
                startY = e.touches[0].pageY;
                isDragging = true;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            }, { passive: true });

            scrollContainer.addEventListener('touchmove', (e) => {
                if (!isDragging) return;

                const currentY = e.touches[0].pageY;
                const deltaY = currentY - startY;

                const scrollTop = scrollContainer.scrollTop;
                const scrollHeight = scrollContainer.scrollHeight;
                const clientHeight = scrollContainer.clientHeight;

                if (
                    (scrollTop <= 0 && deltaY > 0) ||
                    (Math.abs(scrollHeight - clientHeight - scrollTop) < 1 && deltaY < 0)
                ) {
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                    const resistance = 2.5;
                    const pullDistance = deltaY / resistance;

                    rafId = requestAnimationFrame(() => {
                        wrapper.style.transform = `translateY(${pullDistance}px)`;
                    });
                }
            }, { passive: false });

            const release = () => {
                if (!isDragging) return;
                isDragging = false;

                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }

                const currentTransform = new DOMMatrix(getComputedStyle(wrapper).transform);
                if (currentTransform.m42 !== 0) {
                    // Custom spring animation
                    let velocity = 0;
                    let position = currentTransform.m42;
                    const target = 0;
                    const stiffness = 0.3; // Adjust for desired springiness
                    const damping = 0.8; // Adjust for desired damping

                    const animateSpring = () => {
                        const displacement = target - position;
                        const acceleration = stiffness * displacement - damping * velocity;
                        velocity += acceleration;
                        position += velocity;

                        if (Math.abs(displacement) < 0.1 && Math.abs(velocity) < 0.1) {
                            position = target;
                            wrapper.style.transform = `translateY(${position}px)`;
                            return;
                        }

                        wrapper.style.transform = `translateY(${position}px)`;
                        requestAnimationFrame(animateSpring);
                    };
                    requestAnimationFrame(animateSpring);
                }
            };

            scrollContainer.addEventListener('touchend', release);
            scrollContainer.addEventListener('touchcancel', release);
        });
    }
}
