import { getDb, STORES } from './db';
import { createProfile, getProfile } from './profiles';

export async function exportProfileData(profileId) {
  const db = await getDb();
  const profile = await db.get(STORES.profiles, profileId);
  if (!profile) throw new Error('Profile not found');

  const progressRows = await db.getAllFromIndex(STORES.progress, 'byProfileId', profileId);
  const quizRows = await db.getAllFromIndex(STORES.quizResults, 'byProfileId', profileId);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: {
      profileId: profile.profileId,
      name: profile.name,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      // Intentionally omit PIN hash/salt on export by default.
    },
    progress: progressRows.map((r) => ({
      lessonId: r.lessonId,
      completed: Boolean(r.completed),
      completedAt: r.completedAt || null,
    })),
    quizResults: quizRows.map((r) => ({
      quizId: r.quizId,
      score: r.score,
      totalQuestions: r.totalQuestions,
      answers: r.answers,
      completedAt: r.completedAt,
    })),
  };
}

export async function importProfileData(data, { overwriteProfileId = null } = {}) {
  if (!data || typeof data !== 'object') throw new Error('Invalid import file');
  if (data.version !== 1) throw new Error('Unsupported import version');

  const name = data.profile?.name;
  if (!name) throw new Error('Import is missing profile name');

  const db = await getDb();

  let profileId = overwriteProfileId;
  if (profileId) {
    const existing = await getProfile(profileId);
    if (!existing) throw new Error('Target profile not found');
  } else {
    const created = await createProfile({ name });
    profileId = created.profileId;
  }

  const tx = db.transaction([STORES.profiles, STORES.progress, STORES.quizResults], 'readwrite');

  // Overwrite name if provided (but keep PIN as-is)
  const profile = await tx.objectStore(STORES.profiles).get(profileId);
  if (profile) {
    profile.name = name;
    profile.updatedAt = new Date().toISOString();
    await tx.objectStore(STORES.profiles).put(profile);
  }

  // Insert/overwrite progress rows
  const progressStore = tx.objectStore(STORES.progress);
  for (const p of data.progress || []) {
    if (!p.lessonId) continue;
    await progressStore.put({
      profileId,
      lessonId: p.lessonId,
      completed: Boolean(p.completed),
      completedAt: p.completedAt || null,
    });
  }

  // Insert quiz rows (append)
  const quizStore = tx.objectStore(STORES.quizResults);
  for (const q of data.quizResults || []) {
    if (!q.quizId) continue;
    await quizStore.add({
      profileId,
      quizId: q.quizId,
      score: q.score,
      totalQuestions: q.totalQuestions,
      answers: q.answers || {},
      completedAt: q.completedAt || new Date().toISOString(),
      percentage:
        q.totalQuestions ? Math.round((q.score / q.totalQuestions) * 100) : undefined,
    });
  }

  await tx.done;
  return profileId;
}


