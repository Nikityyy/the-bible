import { StateManager } from './state.js';
import { ViewManager } from './views.js';
import { bibleDB } from './db.js';
import { triggerHapticFeedback } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const stateManager = new StateManager();
    const viewManager = new ViewManager();

    let bibleData = {};

    // Dark Mode Logic
    function applyDarkMode(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        stateManager.setDarkMode(isDark);
    }

    function handleDarkModeToggle(isDark) {
        applyDarkMode(isDark);
    }

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
        // Scroll reading view to top
        if (viewManager.domElements.readingMain) {
            viewManager.domElements.readingMain.scrollTop = 0;
        }
        
    }

    function getCanonicalBookOrder(bibleData) {
        return Object.keys(bibleData);
    }

    function handleNavigateChapter(direction) {
        const state = stateManager.getState();
        const { book, chapter } = state.readingProgress[state.language].lastRead;
        const currentChapter = parseInt(chapter, 10);
        const totalChapters = Object.keys(bibleData[book]).length;
        const newChapter = currentChapter + direction;

        // Check if we need to navigate to a different book
        if (newChapter < 1) {
            // Going back from first chapter - navigate to previous book
            const bookOrder = getCanonicalBookOrder(bibleData);
            const currentBookIndex = bookOrder.indexOf(book);
            if (currentBookIndex > 0) {
                const prevBook = bookOrder[currentBookIndex - 1];
                const prevBookTotalChapters = Object.keys(bibleData[prevBook]).length;
                stateManager.updateReadingProgress(state.language, { book: prevBook, chapter: prevBookTotalChapters });
                renderChapter(prevBook, prevBookTotalChapters);
                return;
            }
        } else if (newChapter > totalChapters) {
            // Going forward from last chapter - navigate to next book
            const bookOrder = getCanonicalBookOrder(bibleData);
            const currentBookIndex = bookOrder.indexOf(book);
            if (currentBookIndex < bookOrder.length - 1) {
                const nextBook = bookOrder[currentBookIndex + 1];
                stateManager.updateReadingProgress(state.language, { book: nextBook, chapter: 1 });
                renderChapter(nextBook, 1);
                return;
            }
        } else {
            // Normal chapter navigation within the same book
            stateManager.updateReadingProgress(state.language, { book, chapter: newChapter });
            renderChapter(book, newChapter);
        }

        // Check if the book is fully read after navigating
        if (newChapter === totalChapters) {
            const currentBookProgress = state.readingProgress[state.language].books[book] || 0;
            if (currentBookProgress === totalChapters) {
                const langProgress = state.readingProgress[state.language];
                langProgress.pathNotification = true;
                stateManager.updateState({}); // Trigger save and listeners
                viewManager.showPathNotification();
            }
        }
    }

    function handleContinueReading() {
        const state = stateManager.getState();
        const { book, chapter } = state.readingProgress[state.language].lastRead;
        if (book && bibleData[book]) {
            stateManager.setCurrentPage('reading');
            viewManager.showReadingView();
            renderChapter(book, chapter);
            // Scroll reading view to top
            if (viewManager.domElements.readingMain) {
                viewManager.domElements.readingMain.scrollTop = 0;
            }
        }
    }

    function handleBackToMain() {
        stateManager.setCurrentPage('main');
        viewManager.showMainView();
        const state = stateManager.getState();
        viewManager.renderBookList(bibleData, state.readingProgress[state.language].books, state.language);
        updateContinueReading();
        // Scroll main view to top
        const mainViewMain = viewManager.domElements.mainView?.querySelector('main');
        if (mainViewMain) {
            mainViewMain.scrollTop = 0;
        }
    }

    function handlePathClick() {
        stateManager.setCurrentPage('path');
        viewManager.showPathView();
        const state = stateManager.getState();
        viewManager.renderPathView(bibleData, state.readingProgress[state.language].books, state.language);
        if (state.readingProgress[state.language].pathNotification) {
            const langProgress = state.readingProgress[state.language];
            langProgress.pathNotification = false;
            stateManager.updateState({}); // Trigger save and listeners
            viewManager.hidePathNotification();
        }
        // Scroll path view to top
        const pathViewMain = viewManager.domElements.pathView?.querySelector('main');
        if (pathViewMain) {
            pathViewMain.scrollTop = 0;
        }
    }

    async function handleLanguageSwitch(newLanguage) {
        const state = stateManager.getState();
        if (newLanguage === state.language) {
            viewManager.hideSettingsModal();
            return;
        }

        // Hide path notification when switching languages
        viewManager.hidePathNotification();

        stateManager.switchLanguage(newLanguage);
        viewManager.hideSettingsModal();
        viewManager.showLoading('Loading Bible data...');
        try {
            await loadBibleData(newLanguage);
            viewManager.hideLoading();

            // Update UI texts (tab names, etc.) for the new language
            viewManager.updateUITexts(newLanguage);

            // Re-render content based on current view
            if (state.currentPage === 'main') {
                viewManager.renderBookList(bibleData, state.readingProgress[newLanguage].books, newLanguage);
            } else if (state.currentPage === 'path') {
                viewManager.renderPathView(bibleData, state.readingProgress[newLanguage].books, newLanguage);
            } else if (state.currentPage === 'reading') {
                const { book, chapter } = state.readingProgress[newLanguage].lastRead;
                if (book && chapter) {
                    renderChapter(book, chapter);
                }
            }

            // Check path notification for the new language (regardless of current view)
            if (state.readingProgress[newLanguage].pathNotification) {
                viewManager.showPathNotification();
            }

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
        viewManager.updateNavigation(book, chapter, totalChapters, state.language, bibleData, getCanonicalBookOrder(bibleData));
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

        // Apply dark mode preference from state
        applyDarkMode(state.darkMode);
        viewManager.setDarkModeToggle(state.darkMode);

        stateManager.subscribe(() => {
            updateContinueReading();
        });

        viewManager.showLoading('Loading Bible data...');
        try {
            await loadBibleData(state.language);

            // Update UI texts (tab names, etc.) for the current language
            viewManager.updateUITexts(state.language);

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

            // Check for path notification on load
            if (state.readingProgress[state.language].pathNotification) {
                viewManager.showPathNotification();
            }

        } catch (error) {
            viewManager.hideLoading();
            viewManager.showError(error);
        }
    }

    // Bind Events
    viewManager.bindBookListClick(handleBookClick);
    document.querySelector('a[href="#path-view"]').addEventListener('click', (e) => {
        e.preventDefault();
        handlePathClick();
    });

    viewManager.bindNavigationClicks(
        () => handleNavigateChapter(-1),
        () => handleNavigateChapter(1),
        handleBackToMain
    );
    viewManager.bindSwipeNavigation(
        () => handleNavigateChapter(-1),
        () => handleNavigateChapter(1)
    );
    viewManager.bindContinueReading(handleContinueReading);
    viewManager.bindSettingsModal(
        () => viewManager.showSettingsModal(),
        () => viewManager.hideSettingsModal(),
        handleLanguageSwitch,
        handleDarkModeToggle
    );

    // Bind settings button in path view
    if (viewManager.domElements.settingsButtonPath) {
        viewManager.domElements.settingsButtonPath.addEventListener('click', () => {
            triggerHapticFeedback();
            viewManager.showSettingsModal();
        });
    }

    // Bind navigation tabs in path view header
    if (viewManager.domElements.readTabPathView) {
        viewManager.domElements.readTabPathView.addEventListener('click', (e) => {
            e.preventDefault();
            handleBackToMain(); // Navigates to main view (Read tab)
        });
    }

    if (viewManager.domElements.pathTabPathView) {
        viewManager.domElements.pathTabPathView.addEventListener('click', (e) => {
            e.preventDefault();
            handlePathClick(); // Stays on path view
        });
    }

    initializeApp();
});
