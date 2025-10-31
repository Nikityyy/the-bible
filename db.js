// IndexedDB wrapper for caching Bible data with memory management
class BibleDB {
    constructor() {
        this.dbName = 'bibleApp';
        this.dbVersion = 2; // Increment version for schema changes
        this.db = null;
        this.maxCacheSize = 50 * 1024 * 1024; // 50MB limit
        this.cleanupThreshold = 40 * 1024 * 1024; // Clean up when over 40MB
    }

    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores if they don't exist
                if (!db.objectStoreNames.contains('bibles')) {
                    const bibleStore = db.createObjectStore('bibles', { keyPath: 'key' });
                    bibleStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('books')) {
                    const bookStore = db.createObjectStore('books', { keyPath: 'key' });
                    bookStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('metadata')) {
                    db.createObjectStore('metadata', { keyPath: 'key' });
                }
            };
        });
    }

    async get(key) {
        if (!this.db) await this.open();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['bibles'], 'readonly');
            const store = transaction.objectStore('bibles');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result ? request.result.data : null);
            request.onerror = () => reject(request.error);
        });
    }

    async set(key, data) {
        if (!this.db) await this.open();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['bibles'], 'readwrite');
            const store = transaction.objectStore('bibles');
            const request = store.put({ key, data });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async delete(key) {
        if (!this.db) await this.open();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['bibles'], 'readwrite');
            const store = transaction.objectStore('bibles');
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Book-specific caching methods
    async getBook(key) {
        if (!this.db) await this.open();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['books'], 'readonly');
            const store = transaction.objectStore('books');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result ? request.result.data : null);
            request.onerror = () => reject(request.error);
        });
    }

    async setBook(key, data) {
        if (!this.db) await this.open();

        // Check cache size before adding
        await this.checkCacheSize();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['books'], 'readwrite');
            const store = transaction.objectStore('books');
            const timestamp = Date.now();
            const request = store.put({ key, data, timestamp });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Metadata caching
    async getMetadata(key) {
        if (!this.db) await this.open();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['metadata'], 'readonly');
            const store = transaction.objectStore('metadata');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result ? request.result.data : null);
            request.onerror = () => reject(request.error);
        });
    }

    async setMetadata(key, data) {
        if (!this.db) await this.open();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['metadata'], 'readwrite');
            const store = transaction.objectStore('metadata');
            const request = store.put({ key, data });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Cache size management
    async getCacheSize() {
        if (!this.db) await this.open();
        return new Promise((resolve, reject) => {
            let totalSize = 0;
            const transaction = this.db.transaction(['bibles', 'books', 'metadata'], 'readonly');

            const checkStore = (storeName) => {
                return new Promise((resolveStore) => {
                    const store = transaction.objectStore(storeName);
                    const request = store.openCursor();

                    request.onsuccess = (event) => {
                        const cursor = event.target.result;
                        if (cursor) {
                            // Estimate size (rough approximation)
                            const data = cursor.value.data;
                            if (data) {
                                totalSize += JSON.stringify(data).length * 2; // UTF-16 estimation
                            }
                            cursor.continue();
                        } else {
                            resolveStore();
                        }
                    };

                    request.onerror = () => resolveStore(); // Continue on error
                });
            };

            Promise.all([
                checkStore('bibles'),
                checkStore('books'),
                checkStore('metadata')
            ]).then(() => resolve(totalSize)).catch(reject);
        });
    }

    async checkCacheSize() {
        try {
            const size = await this.getCacheSize();
            if (size > this.cleanupThreshold) {
                await this.cleanupOldEntries();
            }
        } catch (error) {
            console.warn('Cache size check failed:', error);
        }
    }

    async cleanupOldEntries() {
        if (!this.db) await this.open();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['books'], 'readwrite');
            const store = transaction.objectStore('books');
            const index = store.index('timestamp');

            // Remove oldest 20% of entries
            const request = index.openCursor();
            const entriesToDelete = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    entriesToDelete.push(cursor.value.key);
                    cursor.continue();
                } else {
                    // Delete collected entries
                    entriesToDelete.slice(0, Math.floor(entriesToDelete.length * 0.2)).forEach(key => {
                        store.delete(key);
                    });
                    resolve();
                }
            };

            request.onerror = () => resolve(); // Continue on error
        });
    }

    // Memory-conscious set method with size limits
    async setWithSizeLimit(key, data) {
        if (!this.db) await this.open();

        // Check if data is too large for a single entry (over 10MB)
        const dataSize = JSON.stringify(data).length * 2;
        if (dataSize > 10 * 1024 * 1024) {
            console.warn(`Data for ${key} is too large (${Math.round(dataSize / 1024 / 1024)}MB), skipping cache`);
            return;
        }

        await this.checkCacheSize();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['bibles'], 'readwrite');
            const store = transaction.objectStore('bibles');
            const timestamp = Date.now();
            const request = store.put({ key, data, timestamp });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

export const bibleDB = new BibleDB();
