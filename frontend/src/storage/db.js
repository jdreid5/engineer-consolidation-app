import { openDB } from 'idb';

export const DB_NAME = 'engineerDevApp';
export const DB_VERSION = 1;

export const STORES = {
  profiles: 'profiles',
  progress: 'progress',
  quizResults: 'quizResults',
};

let dbPromise;

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORES.profiles)) {
          db.createObjectStore(STORES.profiles, { keyPath: 'profileId' });
        }

        if (!db.objectStoreNames.contains(STORES.progress)) {
          const store = db.createObjectStore(STORES.progress, {
            keyPath: ['profileId', 'lessonId'],
          });
          store.createIndex('byProfileId', 'profileId');
        }

        if (!db.objectStoreNames.contains(STORES.quizResults)) {
          const store = db.createObjectStore(STORES.quizResults, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('byProfileId', 'profileId');
          store.createIndex('byProfileQuizId', ['profileId', 'quizId']);
        }
      },
    });
  }
  return dbPromise;
}


