// Worker to load Bible data using unified parser
importScripts('https://cdn.jsdelivr.net/npm/fzstd@0.1.1/umd/index.js');
importScripts('./parser.js');

const parser = new BibleParser();

self.onmessage = async function (e) {
    const { url, language, metadataOnly, bookOnly, background } = e.data;

    try {
        if (metadataOnly) {
            // Load only book metadata for navigation
            self.postMessage({ type: 'progress', message: 'Loading book metadata...' });
            const text = await parser.fetchText(url);
            const metadata = parser.parseBookMetadata(text, language);
            self.postMessage({ type: 'result', metadata });
        } else if (bookOnly) {
            // Load specific book data
            self.postMessage({ type: 'progress', message: 'Loading book data...' });
            const text = await parser.fetchText(url);
            const bookData = parser.parseSpecificBook(text, language, bookOnly);
            self.postMessage({ type: 'result', bookData });
        } else {
            // Load full Bible data
            if (!background) {
                self.postMessage({ type: 'progress', message: 'Fetching and decompressing text...' });
            }
            const text = await parser.fetchText(url);

            if (!background) {
                self.postMessage({ type: 'progress', message: 'Parsing Bible data...' });
            }
            const bibleData = parser.parseBibleText(text, language);

            self.postMessage({ type: 'result', bibleData });
        }
    } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
    }
};
