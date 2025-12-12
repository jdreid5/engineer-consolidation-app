import { getDb, STORES } from './db';

function nowIso() {
  return new Date().toISOString();
}

export async function getProgressMap(profileId) {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORES.progress, 'byProfileId', profileId);
  const map = {};
  for (const r of rows) {
    map[r.lessonId] = {
      completed: Boolean(r.completed),
      completedAt: r.completedAt || null,
    };
  }
  return map;
}

export async function markLessonComplete(profileId, lessonId) {
  const db = await getDb();
  await db.put(STORES.progress, {
    profileId,
    lessonId,
    completed: true,
    completedAt: nowIso(),
  });
}

export async function markLessonIncomplete(profileId, lessonId) {
  const db = await getDb();
  await db.put(STORES.progress, {
    profileId,
    lessonId,
    completed: false,
    completedAt: null,
  });
}


