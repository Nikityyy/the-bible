// Unified Bible Parser class (used by web worker)
class BibleParser {
    constructor() { }

    async fetchText(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            if (url.endsWith('.zst')) {
                const compressedBuf = await response.arrayBuffer();
                const compressed = new Uint8Array(compressedBuf);
                const decompressed = fzstd.decompress(compressed);
                const textDecoder = new TextDecoder('utf-8');
                return textDecoder.decode(decompressed);
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error(`Error fetching text from ${url}:`, error);
            throw error;
        }
    }

    async loadBibleText(url, language) {
        const text = await this.fetchText(url); // Await if promise, but since updated to async
        const rawBooks = this.parseBibleText(text, language);
        return language === 'de' ? this._combineGermanBooks(rawBooks) : rawBooks;
    }

    parseBibleText(text, language) {
        const lines = text.split('\n');
        const books = {};

        lines.forEach(line => {
            const match = line.match(/^(.+?)\s(\d+):(\d+)\s(.+)/);
            if (match) {
                let [, book, chapter, verse, content] = match.map(s => s.trim());

                if (!books[book]) books[book] = {};
                if (!books[book][chapter]) books[book][chapter] = {};
                books[book][chapter][verse] = content;
            }
        });

        return books;
    }

    _combineGermanBooks(germanBookChapterMap) {
        let combinedBooks = {};
        let currentChapterOffset = {};

        Object.keys(germanBookChapterMap).forEach(originalBookName => {
            const numberedBookMatch = originalBookName.match(/^(\d+)\s(.+)$/);
            let baseBookName = originalBookName;

            if (numberedBookMatch) {
                baseBookName = numberedBookMatch[2];
            }

            if (!combinedBooks[baseBookName]) {
                combinedBooks[baseBookName] = {};
                currentChapterOffset[baseBookName] = 0;
            }

            const chapters = germanBookChapterMap[originalBookName];
            const sortedChapters = Object.keys(chapters).map(Number).sort((a, b) => a - b);

            sortedChapters.forEach(originalChapterNum => {
                const newChapterNum = originalChapterNum + currentChapterOffset[baseBookName];
                combinedBooks[baseBookName][newChapterNum] = chapters[originalChapterNum];
            });

            if (sortedChapters.length > 0) {
                currentChapterOffset[baseBookName] += sortedChapters[sortedChapters.length - 1];
            }
        });
        return combinedBooks;
    }

    // Parse only book metadata for navigation (book names and chapter counts)
    parseBookMetadata(text, language) {
        const lines = text.split('\n');
        const metadata = {};

        lines.forEach(line => {
            const match = line.match(/^(.+?)\s(\d+):(\d+)\s(.+)/);
            if (match) {
                let [, book, chapter, verse, content] = match.map(s => s.trim());

                if (!metadata[book]) {
                    metadata[book] = { chapterCount: 0, verseCount: 0 };
                }

                // Update chapter count
                const chapterNum = parseInt(chapter, 10);
                if (chapterNum > metadata[book].chapterCount) {
                    metadata[book].chapterCount = chapterNum;
                }

                // Count verses in current chapter
                if (!metadata[book].versesPerChapter) {
                    metadata[book].versesPerChapter = {};
                }
                if (!metadata[book].versesPerChapter[chapter]) {
                    metadata[book].versesPerChapter[chapter] = 0;
                }
                const verseNum = parseInt(verse, 10);
                if (verseNum > metadata[book].versesPerChapter[chapter]) {
                    metadata[book].versesPerChapter[chapter] = verseNum;
                }
            }
        });

        // Convert to final format
        const finalMetadata = {};
        Object.keys(metadata).forEach(book => {
            finalMetadata[book] = metadata[book].chapterCount;
        });

        return language === 'de' ? this._combineGermanBookMetadata(finalMetadata) : finalMetadata;
    }

    // Parse specific book data only
    parseSpecificBook(text, language, targetBook) {
        const lines = text.split('\n');
        const bookData = {};

        lines.forEach(line => {
            const match = line.match(/^(.+?)\s(\d+):(\d+)\s(.+)/);
            if (match) {
                let [, book, chapter, verse, content] = match.map(s => s.trim());

                // Check if this is the target book (handle German book name variations)
                let isTargetBook = book === targetBook;
                if (language === 'de' && !isTargetBook) {
                    // Handle German numbered books like "1 Mose" for "Mose"
                    const numberedMatch = book.match(/^(\d+)\s(.+)$/);
                    if (numberedMatch) {
                        const [, number, baseName] = numberedMatch;
                        isTargetBook = baseName === targetBook;
                    }
                }

                if (isTargetBook) {
                    if (!bookData[chapter]) bookData[chapter] = {};
                    bookData[chapter][verse] = content;
                }
            }
        });

        return bookData;
    }

    _combineGermanBookMetadata(metadata) {
        const combined = {};
        Object.keys(metadata).forEach(bookName => {
            const numberedMatch = bookName.match(/^(\d+)\s(.+)$/);
            if (numberedMatch) {
                const [, number, baseName] = numberedMatch;
                combined[baseName] = metadata[bookName];
            } else {
                combined[bookName] = metadata[bookName];
            }
        });
        return combined;
    }
}

// Make available globally for web worker
self.BibleParser = BibleParser;
