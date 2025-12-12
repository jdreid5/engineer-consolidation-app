import { getDb, STORES } from './db';

function nowIso() {
  return new Date().toISOString();
}

export async function submitQuizResult(profileId, quizId, score, totalQuestions, answers) {
  const db = await getDb();
  const completedAt = nowIso();
  const percentage = Math.round((score / totalQuestions) * 100);

  const id = await db.add(STORES.quizResults, {
    profileId,
    quizId,
    score,
    totalQuestions,
    answers,
    completedAt,
    percentage,
  });

  return { id, completedAt, percentage };
}

export async function getBestQuizScores(profileId) {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORES.quizResults, 'byProfileId', profileId);

  const bestScores = {};
  for (const r of rows) {
    const percentage =
      r.percentage !== undefined ? r.percentage : Math.round((r.score / r.totalQuestions) * 100);
    const prev = bestScores[r.quizId];
    if (!prev || percentage > prev.percentage) {
      bestScores[r.quizId] = {
        score: r.score,
        totalQuestions: r.totalQuestions,
        percentage,
        completedAt: r.completedAt,
      };
    }
  }

  return bestScores;
}

export async function getAllQuizResults(profileId) {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORES.quizResults, 'byProfileId', profileId);
  return rows.sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));
}

export async function getQuizResultsByQuizId(profileId, quizId) {
  const db = await getDb();
  const rows = await db.getAllFromIndex(STORES.quizResults, 'byProfileQuizId', [profileId, quizId]);
  return rows.sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));
}


