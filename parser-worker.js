// Worker to load Bible data using unified parser
importScripts('https://cdn.jsdelivr.net/npm/fzstd@0.1.1/umd/index.js');
importScripts('/parser.js');

const parser = new BibleParser();

self.onmessage = async function (e) {
    const { url, language } = e.data;

    try {
        self.postMessage({ type: 'progress', message: 'Fetching and decompressing text...' });
        const text = await parser.fetchText(url);

        self.postMessage({ type: 'progress', message: 'Parsing Bible data...' });
        const bibleData = parser.parseBibleText(text, language);

        self.postMessage({ type: 'result', bibleData });
    } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
    }
};
