import { StateManager } from './state.js';
import { ViewManager } from './views.js';
import { bibleDB } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
    const stateManager = new StateManager();
    const viewManager = new ViewManager();

    let bibleData = {};

    // Debounce utility function
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    const textFiles = {
        en: 'texts/en/web.zst',
        de: 'texts/de/luther_1912.zst'
    };

    // Event Handlers
    function handleBookClick(book) {
        const state = stateManager.getState();
        const langProgress = state.readingProgress[state.language];
        const chapter = langProgress.books[book] || 1;
        stateManager.updateReadingProgress(state.language, { book, chapter });
        stateManager.setCurrentPage('reading');
        viewManager.showReadingView();
        renderChapter(book, chapter);
    }

    function handleNavigateChapter(direction) {
        const state = stateManager.getState();
        const { book, chapter } = state.readingProgress[state.language].lastRead;
        const newChapter = parseInt(chapter, 10) + direction;
        const totalChapters = Object.keys(bibleData[book]).length;
        if (newChapter >= 1 && newChapter <= totalChapters) {
            stateManager.updateReadingProgress(state.language, { book, chapter: newChapter });
            renderChapter(book, newChapter);
        }
    }

    function handleContinueReading() {
        const state = stateManager.getState();
        const { book, chapter } = state.readingProgress[state.language].lastRead;
        if (book && bibleData[book]) {
            stateManager.setCurrentPage('reading');
            viewManager.showReadingView();
            renderChapter(book, chapter);
        }
    }

    function handleBackToMain() {
        stateManager.setCurrentPage('main');
        viewManager.showMainView();
        const state = stateManager.getState();
        viewManager.renderBookList(bibleData, state.readingProgress[state.language].books, state.language);
        updateContinueReading();
    }

    async function handleLanguageSwitch(newLanguage) {
        const state = stateManager.getState();
        if (newLanguage === state.language) {
            viewManager.hideLanguageModal();
            return;
        }
        stateManager.switchLanguage(newLanguage);
        viewManager.setLanguageSwitcher(newLanguage);
        viewManager.hideLanguageModal();
        viewManager.showLoading('Loading Bible data...');
        try {
            await loadBibleData(newLanguage);
            viewManager.hideLoading();
            viewManager.renderBookList(bibleData, state.readingProgress[newLanguage].books, newLanguage);
            updateContinueReading();
        } catch (error) {
            viewManager.hideLoading();
            viewManager.showError(error);
        }
    }

    // Functions
    function renderChapter(book, chapter) {
        const chapterData = bibleData[book]?.[chapter];
        const state = stateManager.getState();
        viewManager.renderChapter(book, chapter, chapterData, state.language);
        const totalChapters = bibleData[book] ? Object.keys(bibleData[book]).length : 0;
        viewManager.updateNavigation(book, chapter, totalChapters, state.language);
    }

    function updateContinueReading() {
        const state = stateManager.getState();
        const { book, chapter } = state.readingProgress[state.language].lastRead;
        if (book && bibleData[book]) {
            const totalChapters = Object.keys(bibleData[book]).length;
            viewManager.updateContinueReading(book, chapter, totalChapters, state.language);
        } else {
            viewManager.updateContinueReading('', 0, 0, state.language);
        }
    }

    function loadBibleData(language) {
        return new Promise((resolve, reject) => {
            const cacheKey = `bible-${language}`;
            bibleDB.get(cacheKey).then(cachedData => {
                if (cachedData) {
                    bibleData = cachedData;
                    resolve();
                    return;
                }

                // Start worker
                const worker = new Worker('parser-worker.js');
                worker.postMessage({
                    url: textFiles[language],
                    language: language
                });

                worker.onmessage = function (e) {
                    if (e.data.type === 'progress') {
                        viewManager.updateLoading(e.data.message);
                    } else if (e.data.type === 'result') {
                        bibleData = e.data.bibleData;
                        bibleDB.set(cacheKey, bibleData); // Cache asynchronously
                        worker.terminate();
                        resolve();
                    } else if (e.data.type === 'error') {
                        worker.terminate();
                        reject(new Error(e.data.error));
                    }
                };

                worker.onerror = function (error) {
                    worker.terminate();
                    reject(error);
                };
            }).catch(reject);
        });
    }

    async function initializeApp() {
        stateManager.loadFromLocalStorage();
        const state = stateManager.getState();

        viewManager.setLanguageSwitcher(state.language);

        stateManager.subscribe(() => {
            updateContinueReading();
        });

        viewManager.showLoading('Loading Bible data...');
        try {
            await loadBibleData(state.language);
            viewManager.renderBookList(bibleData, state.readingProgress[state.language].books, state.language);

            // Validate stored progress
            let { book } = state.readingProgress[state.language].lastRead;
            if (!bibleData[book] && Object.keys(bibleData).length > 0) {
                const firstBook = Object.keys(bibleData)[0];
                stateManager.updateReadingProgress(state.language, { book: firstBook, chapter: 1 });
            }

            updateContinueReading();
            viewManager.hideLoading();

            if (state.currentPage === 'reading' && state.readingProgress[state.language].lastRead) {
                const { book, chapter } = state.readingProgress[state.language].lastRead;
                viewManager.showReadingView();
                renderChapter(book, chapter);
            } else {
                viewManager.showMainView();
            }
        } catch (error) {
            viewManager.hideLoading();
            viewManager.showError(error);
        }
    }

    // Bind Events
    viewManager.bindBookListClick(handleBookClick);
    const debouncedHandleNavigateChapter = debounce(handleNavigateChapter, 50);

    viewManager.bindNavigationClicks(
        () => debouncedHandleNavigateChapter(-1),
        () => debouncedHandleNavigateChapter(1),
        handleBackToMain
    );
    viewManager.bindSwipeNavigation(
        () => debouncedHandleNavigateChapter(-1),
        () => debouncedHandleNavigateChapter(1)
    );
    viewManager.bindContinueReading(handleContinueReading);
    viewManager.bindLanguageModal(
        () => viewManager.showLanguageModal(),
        () => viewManager.hideLanguageModal(),
        handleLanguageSwitch
    );

    initializeApp();
});
