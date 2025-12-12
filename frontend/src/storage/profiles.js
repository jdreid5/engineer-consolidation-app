import { getDb, STORES } from './db';
import { derivePinHashBase64, generateSaltBase64 } from './crypto';

function nowIso() {
  return new Date().toISOString();
}

function newId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `profile_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export async function listProfiles() {
  const db = await getDb();
  const profiles = await db.getAll(STORES.profiles);
  return profiles.sort((a, b) => (b.updatedAt || b.createdAt || '').localeCompare(a.updatedAt || a.createdAt || ''));
}

export async function getProfile(profileId) {
  const db = await getDb();
  return db.get(STORES.profiles, profileId);
}

export async function createProfile({ name, pin = null } = {}) {
  if (!name || !String(name).trim()) throw new Error('Profile name is required');

  const profileId = newId();
  const createdAt = nowIso();

  let pinSalt = null;
  let pinHash = null;
  if (pin) {
    pinSalt = generateSaltBase64();
    pinHash = await derivePinHashBase64(pin, pinSalt);
  }

  const profile = {
    profileId,
    name: String(name).trim(),
    createdAt,
    updatedAt: createdAt,
    pinSalt,
    pinHash,
  };

  const db = await getDb();
  await db.put(STORES.profiles, profile);
  return profile;
}

export async function renameProfile(profileId, name) {
  if (!name || !String(name).trim()) throw new Error('Profile name is required');

  const db = await getDb();
  const profile = await db.get(STORES.profiles, profileId);
  if (!profile) throw new Error('Profile not found');

  profile.name = String(name).trim();
  profile.updatedAt = nowIso();
  await db.put(STORES.profiles, profile);
  return profile;
}

export async function setProfilePin(profileId, pin) {
  if (!pin || String(pin).length < 4) throw new Error('PIN must be at least 4 characters');

  const db = await getDb();
  const profile = await db.get(STORES.profiles, profileId);
  if (!profile) throw new Error('Profile not found');

  const pinSalt = generateSaltBase64();
  const pinHash = await derivePinHashBase64(pin, pinSalt);

  profile.pinSalt = pinSalt;
  profile.pinHash = pinHash;
  profile.updatedAt = nowIso();
  await db.put(STORES.profiles, profile);
  return profile;
}

export async function clearProfilePin(profileId) {
  const db = await getDb();
  const profile = await db.get(STORES.profiles, profileId);
  if (!profile) throw new Error('Profile not found');

  profile.pinSalt = null;
  profile.pinHash = null;
  profile.updatedAt = nowIso();
  await db.put(STORES.profiles, profile);
  return profile;
}

export async function verifyProfilePin(profileId, pin) {
  const profile = await getProfile(profileId);
  if (!profile) return false;
  if (!profile.pinHash || !profile.pinSalt) return true;
  const hash = await derivePinHashBase64(pin, profile.pinSalt);
  return hash === profile.pinHash;
}

export async function deleteProfile(profileId) {
  const db = await getDb();
  const tx = db.transaction([STORES.profiles, STORES.progress, STORES.quizResults], 'readwrite');

  await tx.objectStore(STORES.profiles).delete(profileId);

  // Delete progress rows for this profile
  const progressIdx = tx.objectStore(STORES.progress).index('byProfileId');
  let cursor = await progressIdx.openCursor(IDBKeyRange.only(profileId));
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }

  // Delete quiz results rows for this profile
  const quizIdx = tx.objectStore(STORES.quizResults).index('byProfileId');
  cursor = await quizIdx.openCursor(IDBKeyRange.only(profileId));
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }

  await tx.done;
}


