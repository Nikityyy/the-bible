export class StateManager {
    constructor() {
        this.state = {
            language: 'en',
            currentPage: 'main',
            darkMode: false, // Default to light mode
            readingProgress: {
                en: {
                    lastRead: { book: 'Genesis', chapter: 1 },
                    books: { 'Genesis': 1 },
                    pathNotification: false // Language-specific path notification
                },
                de: {
                    lastRead: { book: '1. Mose', chapter: 1 },
                    books: { '1. Mose': 1 },
                    pathNotification: false // Language-specific path notification
                }
            }
        };
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    updateState(updates) {
        Object.assign(this.state, updates);
        this.saveToLocalStorage();
        this.notifyListeners();
    }

    updateReadingProgress(language, progress) {
        const langProgress = this.state.readingProgress[language];
        langProgress.lastRead = { book: progress.book, chapter: progress.chapter };
        langProgress.books[progress.book] = progress.chapter;
        this.saveToLocalStorage();
        this.notifyListeners();
    }

    switchLanguage(newLanguage) {
        this.updateState({ language: newLanguage });
    }

    setDarkMode(isDark) {
        this.updateState({ darkMode: isDark });
    }

    setCurrentPage(page) {
        this.updateState({ currentPage: page });
    }

    saveToLocalStorage() {
        localStorage.setItem('bibleAppState', JSON.stringify(this.state));
    }

    loadFromLocalStorage() {
        const savedState = localStorage.getItem('bibleAppState');
        if (savedState) {
            const loadedState = JSON.parse(savedState);

            // Handle backward compatibility: migrate global pathNotification to language-specific
            if (loadedState.pathNotification !== undefined) {
                // If there's a global pathNotification, apply it to the current language
                const currentLang = loadedState.language || this.state.language;
                if (this.state.readingProgress[currentLang]) {
                    this.state.readingProgress[currentLang].pathNotification = loadedState.pathNotification;
                }
                delete loadedState.pathNotification; // Remove the old global property
            }

            // Deep merge for readingProgress
            if (loadedState.readingProgress) {
                if (loadedState.readingProgress.en) {
                    this.state.readingProgress.en = { ...this.state.readingProgress.en, ...loadedState.readingProgress.en };
                }
                if (loadedState.readingProgress.de) {
                    this.state.readingProgress.de = { ...this.state.readingProgress.de, ...loadedState.readingProgress.de };
                }
                delete loadedState.readingProgress;
            }

            Object.assign(this.state, loadedState);
            // Ensure darkMode is initialized if not present in loadedState
            if (typeof loadedState.darkMode === 'undefined') {
                this.state.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
        } else {
            this.state.language = navigator.language.startsWith('de') ? 'de' : 'en';
            this.state.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener());
    }
}
