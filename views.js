import { triggerHapticFeedback } from './utils.js';

const translations = {
    en: {
        continueReading: 'Continue Reading',
        theBible: 'The Bible',
        read: 'Read',
        path: 'Path',
        loading: 'Loading...',
        selectLanguage: 'Select Language',
        cancel: 'Cancel',
        settings: 'Settings',
        darkMode: 'Dark Mode',
        moments: {
            Genesis: 'You began your journey.',
            Exodus: 'You found freedom in the wilderness.',
            Leviticus: 'You learned the sacred laws.',
            Numbers: 'You journeyed through the desert.',
            Deuteronomy: 'You remembered the covenant.',
            Joshua: 'You entered the promised land.',
            Judges: 'You witnessed the cycles of faith.',
            Ruth: 'You found loyalty and love.',
            '1 Samuel': 'You saw the rise of kings.',
            '2 Samuel': 'You walked with King David.',
            '1 Kings': 'You saw the kingdom divide.',
            '2 Kings': 'You witnessed the fall of nations.',
            '1 Chronicles': 'You traced the lineage of faith.',
            '2 Chronicles': 'You saw the temple restored.',
            Ezra: 'You rebuilt the house of God.',
            Nehemiah: 'You restored the city walls.',
            Esther: 'You found courage in the palace.',
            Job: 'You endured with patience.',
            Psalms: 'You found peace in Psalms.',
            Proverbs: 'You gained wisdom for life.',
            Ecclesiastes: 'You pondered life\'s meaning.',
            'Song of Solomon': 'You celebrated divine love.',
            Isaiah: 'You heard the prophet\'s call.',
            Jeremiah: 'You wept with the prophet.',
            Lamentations: 'You mourned with a broken heart.',
            Ezekiel: 'You saw visions of glory.',
            Daniel: 'You stood firm in faith.',
            Hosea: 'You knew God\'s enduring love.',
            Joel: 'You witnessed God\'s power.',
            Amos: 'You heard the call for justice.',
            Obadiah: 'You saw justice prevail.',
            Jonah: 'You learned of God\'s compassion.',
            Micah: 'You walked humbly with God.',
            Nahum: 'You saw God\'s vengeance.',
            Habakkuk: 'You questioned, then trusted.',
            Zephaniah: 'You awaited the day of the Lord.',
            Haggai: 'You rebuilt with purpose.',
            Zechariah: 'You saw visions of hope.',
            Malachi: 'You returned to the Lord.',
            Matthew: 'You met the King of Kings.',
            Mark: 'You followed the Servant.',
            Luke: 'You discovered the Son of Man.',
            John: 'You believed in the Son of God.',
            Acts: 'You witnessed the Spirit\'s power.',
            Romans: 'You understood grace and faith.',
            '1 Corinthians': 'You learned of unity in Christ.',
            '2 Corinthians': 'You found strength in weakness.',
            Galatians: 'You embraced freedom in Christ.',
            Ephesians: 'You discovered your identity in Christ.',
            Philippians: 'You rejoiced in the Lord.',
            Colossians: 'You found fullness in Christ.',
            '1 Thessalonians': 'You hoped for His return.',
            '2 Thessalonians': 'You stood firm in truth.',
            '1 Timothy': 'You led with integrity.',
            '2 Timothy': 'You persevered in faith.',
            Titus: 'You lived a godly life.',
            Philemon: 'You extended forgiveness.',
            Hebrews: 'You saw Christ, our High Priest.',
            James: 'You lived out your faith.',
            '1 Peter': 'You stood firm in suffering.',
            '2 Peter': 'You grew in grace and knowledge.',
            '1 John': 'You knew God\'s love.',
            '2 John': 'You walked in truth and love.',
            '3 John': 'You supported the truth.',
            Jude: 'You contended for the faith.',
            Revelation: 'You saw the triumph of God.'
        }
    },
    de: {
        continueReading: 'Weiterlesen',
        theBible: 'Die Bibel',
        read: 'Lesen',
        path: 'Pfad',
        loading: 'Laden...',
        selectLanguage: 'Sprache auswählen',
        cancel: 'Abbrechen',
        settings: 'Einstellungen',
        darkMode: 'Dunkelmodus',
        moments: {
            '1 Mose': 'Du hast deine Reise begonnen.',
            '2 Mose': 'Du hast Freiheit in der Wildnis gefunden.',
            '3 Mose': 'Du hast die heiligen Gesetze gelernt.',
            '4 Mose': 'Du bist durch die Wüste gezogen.',
            '5 Mose': 'Du hast den Bund in Erinnerung gerufen.',
            Josua: 'Du hast das gelobte Land betreten.',
            Richter: 'Du hast die Zyklen des Glaubens miterlebt.',
            Rut: 'Du hast Loyalität und Liebe gefunden.',
            '1 Samuel': 'Du hast den Aufstieg der Könige gesehen.',
            '2 Samuel': 'Du bist mit König David gegangen.',
            '1 Koenige': 'Du hast das geteilte Königreich gesehen.',
            '2 Koenige': 'Du hast den Fall der Nationen miterlebt.',
            '1 Chronik': 'Du hast die Abstammung des Glaubens verfolgt.',
            '2 Chronik': 'Du hast den Tempel wiederhergestellt gesehen.',
            Esra: 'Du hast das Haus Gottes wieder aufgebaut.',
            Nehemia: 'Du hast die Stadtmauern wiederhergestellt.',
            Ester: 'Du hast Mut im Palast gefunden.',
            Job: 'Du hast mit Geduld ausgeharrt.',
            Psalm: 'Du hast Frieden in den Psalmen gefunden.',
            Sprueche: 'Du hast Weisheit für das Leben gewonnen.',
            Prediger: 'Du hast über den Sinn des Lebens nachgedacht.',
            Hohelied: 'Du hast die göttliche Liebe gefeiert.',
            Jesaja: 'Du hast den Ruf des Propheten gehört.',
            Jeremia: 'Du hast mit dem Propheten geweint.',
            Klagelieder: 'Du hast mit gebrochenem Herzen getrauert.',
            Hesekiel: 'Du hast Visionen der Herrlichkeit gesehen.',
            Daniel: 'Du bist fest im Glauben geblieben.',
            Hosea: 'Du hast Gottes unvergängliche Liebe gekannt.',
            Joel: 'Du hast Gottes Macht miterlebt.',
            Amos: 'Du hast den Ruf nach Gerechtigkeit gehört.',
            Obadja: 'Du hast Gerechtigkeit siegen sehen.',
            Jona: 'Du hast von Gottes Barmherzigkeit gelernt.',
            Mica: 'Du bist demütig mit Gott gegangen.',
            Nahum: 'Du hast Gottes Rache gesehen.',
            Habakuk: 'Du hast gefragt, dann vertraut.',
            Zephanja: 'Du hast den Tag des Herrn erwartet.',
            Haggai: 'Du hast mit Absicht wieder aufgebaut.',
            Sacharja: 'Du hast Visionen der Hoffnung gesehen.',
            Maleachi: 'Du bist zum Herrn zurückgekehrt.',
            Matthaeus: 'Du hast den König der Könige getroffen.',
            Markus: 'Du bist dem Diener gefolgt.',
            Lukas: 'Du hast den Menschensohn entdeckt.',
            Johannes: 'Du hast an den Sohn Gottes geglaubt.',
            Apostelgeschichte: 'Du hast die Kraft des Geistes miterlebt.',
            Roemers: 'Du hast Gnade und Glauben verstanden.',
            '1 Korinther': 'Du hast von der Einheit in Christus gelernt.',
            '2 Korinther': 'Du hast Stärke in Schwachheit gefunden.',
            Galater: 'Du hast die Freiheit in Christus angenommen.',
            Epheser: 'Du hast deine Identität in Christus entdeckt.',
            Philipper: 'Du hast dich im Herrn gefreut.',
            Kolosser: 'Du hast Fülle in Christus gefunden.',
            '1 Thessalonicher': 'Du hast auf Seine Wiederkunft gehofft.',
            '2 Thessalonicher': 'Du bist fest in der Wahrheit geblieben.',
            '1 Timotheus': 'Du hast mit Integrität geführt.',
            '2 Timotheus': 'Du hast im Glauben ausgeharrt.',
            Titus: 'Du hast ein gottgefälliges Leben geführt.',
            Philemon: 'Du hast Vergebung gewährt.',
            Hebraeer: 'Du hast Christus, unseren Hohenpriester, gesehen.',
            Jakobus: 'Du hast deinen Glauben gelebt.',
            '1 Petrus': 'Du bist im Leiden standhaft geblieben.',
            '2 Petrus': 'Du bist in Gnade und Erkenntnis gewachsen.',
            '1 Johannes': 'Du hast Gottes Liebe gekannt.',
            '2 Johannes': 'Du bist in Wahrheit und Liebe gewandelt.',
            '3 Johannes': 'Du hast die Wahrheit unterstützt.',
            Judas: 'Du hast für den Glauben gekämpft.',
            Offenbarung: 'Du hast den Triumph Gottes gesehen.'
        }
    }
};

export class ViewManager {
    constructor() {
        this.domElements = {
            mainView: document.querySelector('.view-main'),
            readingView: document.querySelector('.view-reading'),
            pathView: document.querySelector('.view-path'),
            readingMain: document.querySelector('.view-reading main'),
            pathBookListSection: document.getElementById('path-book-list'),
            pathNotification: document.getElementById('path-notification'),
            backToMainButton: document.querySelector('.view-reading header a'),
            settingsButton: document.getElementById('settings-button'),
            settingsButtonPath: document.getElementById('settings-button-path'), // New settings button for path view
            readTabPathView: document.querySelector('.view-path .liquidGlass-text .flex.items-center a[href="#bible-app"]'), // Read tab in path view
            pathTabPathView: document.querySelector('.view-path .liquidGlass-text .flex.items-center a[href="#path-view"]'), // Path tab in path view
            pathNotificationHeader: document.getElementById('path-notification-header'), // Notification in path view header
            bookListSection: document.getElementById('book-list'),
            continueReadingLink: document.querySelector('a[href="#reading-view"]'),
            continueReadingProgressBar: document.getElementById('continue-reading-progress-bar'),
            prevChapterButton: document.querySelector('.view-reading footer a:first-child'),
            nextChapterButton: document.querySelector('.view-reading footer a:last-child'),
            readingHeader: document.querySelector('.view-reading h1'),
            prevChapterLabel: document.querySelector('.view-reading footer a:first-child span:last-child'),
            nextChapterLabel: document.querySelector('.view-reading footer a:last-child span:first-child'),
            loadingOverlay: document.getElementById('loading-overlay'),
            settingsModal: document.getElementById('settings-modal'),
            closeModalButton: document.getElementById('close-modal'),
            langEnButton: document.getElementById('lang-en'),
            langDeButton: document.getElementById('lang-de'),
            darkModeSwitch: document.getElementById('dark-mode-switch')
        };

        // Swipe properties
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.swipeThreshold = 50; // Minimum pixels to register a swipe
        this.isSwiping = false;
    }

    _transitionTimeout = null;

    _showView(activeView) {
        const views = [this.domElements.mainView, this.domElements.readingView, this.domElements.pathView];
        views.forEach(view => {
            if (view === activeView) {
                view.style.display = 'flex';
                // Ensure pointer events are enabled immediately
                view.style.pointerEvents = 'auto';
            } else {
                view.style.display = 'none';
                // Ensure pointer events are disabled immediately
                view.style.pointerEvents = 'none';
            }
        });
    }

    showMainView() {
        this._showView(this.domElements.mainView);
    }

    showReadingView() {
        this._showView(this.domElements.readingView);
    }

    showPathView() {
        this._showView(this.domElements.pathView);
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
            <div class="mt-4 h-1.5 w-full rounded-full bg-black/5 dark:bg-dark-divider-faint overflow-hidden">
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

    updateNavigation(book, chapter, totalChapters, language, bibleData = {}, canonicalBookOrder = {}) {
        const currentChapter = parseInt(chapter, 10);
        const prevChapterIcon = this.domElements.prevChapterButton.querySelector('span:first-child');
        const nextChapterIcon = this.domElements.nextChapterButton.querySelector('span:last-child');

        const bookOrder = canonicalBookOrder;
        const currentBookIndex = bookOrder.indexOf(book);

        if (currentChapter > 1) {
            // Normal previous chapter navigation
            this.domElements.prevChapterButton.style.pointerEvents = 'auto';
            this.domElements.prevChapterButton.style.opacity = '1';
            prevChapterIcon.style.display = 'inline';
            this.domElements.prevChapterLabel.innerHTML = language === 'de' ? `<span class="book-chapter-label">${book}<br><span class="chapter-label">Kapitel ${currentChapter - 1}</span></span>` : `<span class="book-chapter-label">${book}<br><span class="chapter-label">Chapter ${currentChapter - 1}</span></span>`;
        } else if (currentBookIndex > 0) {
            // At first chapter but can navigate to previous book
            this.domElements.prevChapterButton.style.pointerEvents = 'auto';
            this.domElements.prevChapterButton.style.opacity = '1';
            prevChapterIcon.style.display = 'inline';
            const prevBook = bookOrder[currentBookIndex - 1];
            // Get the total chapters in the previous book
            const prevBookTotalChapters = Object.keys(bibleData[prevBook] || {}).length;
            this.domElements.prevChapterLabel.innerHTML = language === 'de' ? `<span class="book-chapter-label">${prevBook}<br><span class="chapter-label">Kapitel ${prevBookTotalChapters}</span></span>` : `<span class="book-chapter-label">${prevBook}<br><span class="chapter-label">Chapter ${prevBookTotalChapters}</span></span>`;
        } else {
            // At first chapter of first book - show inspirational start message
            this.domElements.prevChapterButton.style.pointerEvents = 'none';
            this.domElements.prevChapterButton.style.opacity = '0.5';
            this.domElements.prevChapterLabel.textContent = language === 'de' ? 'Reise beginnt' : 'Journey begins';
        }

        if (currentChapter < totalChapters) {
            // Normal next chapter navigation
            this.domElements.nextChapterButton.style.pointerEvents = 'auto';
            this.domElements.nextChapterButton.style.opacity = '1';
            nextChapterIcon.style.display = 'inline';
            this.domElements.nextChapterLabel.innerHTML = language === 'de' ? `<span class="book-chapter-label">${book}<br><span class="chapter-label">Kapitel ${currentChapter + 1}</span></span>` : `<span class="book-chapter-label">${book}<br><span class="chapter-label">Chapter ${currentChapter + 1}</span></span>`;
        } else if (currentBookIndex < bookOrder.length - 1) {
            // At last chapter but can navigate to next book
            this.domElements.nextChapterButton.style.pointerEvents = 'auto';
            this.domElements.nextChapterButton.style.opacity = '1';
            nextChapterIcon.style.display = 'inline';
            const nextBook = bookOrder[currentBookIndex + 1];
            this.domElements.nextChapterLabel.innerHTML = language === 'de' ? `<span class="book-chapter-label">${nextBook}<br><span class="chapter-label">Kapitel 1</span></span>` : `<span class="book-chapter-label">${nextBook}<br><span class="chapter-label">Chapter 1</span></span>`;
        } else {
            // At last chapter of last book - show inspirational end message
            this.domElements.nextChapterButton.style.pointerEvents = 'none';
            this.domElements.nextChapterButton.style.opacity = '0.5';
            this.domElements.nextChapterLabel.textContent = language === 'de' ? 'Reise endet' : 'Journey ends';
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

    setDarkModeToggle(isDarkMode) {
        if (this.domElements.darkModeSwitch) {
            this.domElements.darkModeSwitch.checked = isDarkMode;
        }
    }

    showSettingsModal() {
        this.domElements.settingsModal.classList.remove('hidden');
        this.domElements.settingsModal.classList.add('flex');
    }

    hideSettingsModal() {
        this.domElements.settingsModal.classList.add('hidden');
        this.domElements.settingsModal.classList.remove('flex');
    }

    updateSettingsModal(currentLanguage) {
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

    bindSettingsModal(openHandler, closeHandler, langSelectHandler, darkModeToggleHandler) {
        this.domElements.settingsButton.addEventListener('click', () => { triggerHapticFeedback(); openHandler(); });
        this.domElements.closeModalButton.addEventListener('click', () => { triggerHapticFeedback(); closeHandler(); });
        this.domElements.langEnButton.addEventListener('click', () => { triggerHapticFeedback(); langSelectHandler('en'); });
        this.domElements.langDeButton.addEventListener('click', () => { triggerHapticFeedback(); langSelectHandler('de'); });
        this.domElements.darkModeSwitch.addEventListener('change', (e) => {
            triggerHapticFeedback();
            darkModeToggleHandler(e.target.checked);
        });
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
                    setTimeout(prevChapterHandler, 150);
                } else {
                    direction = 'left';
                    setTimeout(nextChapterHandler, 150);
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

    renderPathView(bibleData, bookProgress, language = 'en') {
        const t = translations[language];
        const bookArray = Object.keys(bibleData);
        let html = '';

        bookArray.forEach((bookName) => {
            const chaptersInBook = Object.keys(bibleData[bookName]).length;
            const chaptersRead = bookProgress[bookName] || 0;
            const isCompleted = chaptersRead === chaptersInBook && chaptersInBook > 0;
            const momentText = t.moments[bookName] || '';

            html += `
                <div class="path-book-card liquidGlass-wrapper rounded-xl ${isCompleted ? 'completed' : 'uncompleted'}" data-book="${bookName}">
                    <div class="liquidGlass-effect rounded-xl"></div>
                    <div class="liquidGlass-tint rounded-xl"></div>
                    <div class="liquidGlass-shine rounded-xl"></div>
                    <div class="liquidGlass-text p-4 flex flex-col items-center justify-center text-center h-full">
                        <h3 class="text-lg font-semibold text-text-primary truncate">${bookName}</h3>
                        ${isCompleted ? `<p class="text-sm text-gold-accent mt-2">${momentText}</p>` : `<p class="text-sm text-text-secondary mt-1">${chaptersRead} / ${chaptersInBook} ${language === 'de' ? 'Kapitel' : 'Chapters'}</p>`}
                    </div>
                </div>
            `;
        });
        this.domElements.pathBookListSection.innerHTML = html;
        this.domElements.pathBookListSection.setAttribute('lang', language);

        // Animate book cards on render
        const bookCards = this.domElements.pathBookListSection.querySelectorAll('.path-book-card');
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

    showPathNotification() {
        if (this.domElements.pathNotification) {
            this.domElements.pathNotification.classList.remove('hidden');
        }
        if (this.domElements.pathNotificationHeader) {
            this.domElements.pathNotificationHeader.classList.remove('hidden');
        }
    }

    hidePathNotification() {
        if (this.domElements.pathNotification) {
            this.domElements.pathNotification.classList.add('hidden');
        }
        if (this.domElements.pathNotificationHeader) {
            this.domElements.pathNotificationHeader.classList.add('hidden');
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
        // Update Path tab in main view
        const pathBtn = document.querySelector('a[href="#path-view"] span:first-child');
        if (pathBtn) pathBtn.textContent = t.path;
        // Update Read tab in path view
        if (this.domElements.readTabPathView) this.domElements.readTabPathView.querySelector('span').textContent = t.read;
        // Update Path tab in path view
        if (this.domElements.pathTabPathView) this.domElements.pathTabPathView.querySelector('span').textContent = t.path;
        // Update loading message (only if default)
        const loadingMsg = document.querySelector('.loading-message');
        if (loadingMsg && loadingMsg.textContent === translations.en.loading) loadingMsg.textContent = t.loading;

        // Update modal texts
        const modalTitle = this.domElements.settingsModal.querySelector('#modal-title-settings');
        if (modalTitle) modalTitle.textContent = t.settings;
        if (this.domElements.closeModalButton) this.domElements.closeModalButton.textContent = t.cancel;
        const selectLanguageTitle = this.domElements.settingsModal.querySelector('h3');
        if (selectLanguageTitle) selectLanguageTitle.textContent = t.selectLanguage;
        const darkModeLabel = this.domElements.settingsModal.querySelector('div.flex.items-center.justify-between span');
        if (darkModeLabel) darkModeLabel.textContent = t.darkMode;
    }
}
