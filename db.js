// IndexedDB wrapper for caching Bible data
class BibleDB {
    constructor() {
        this.dbName = 'bibleApp';
        this.dbVersion = 1;
        this.db = null;
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
                if (!db.objectStoreNames.contains('bibles')) {
                    db.createObjectStore('bibles', { keyPath: 'key' });
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
}

export const bibleDB = new BibleDB();
