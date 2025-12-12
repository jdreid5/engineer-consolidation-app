const ACTIVE_PROFILE_ID_KEY = 'eda.activeProfileId';

export function getActiveProfileId() {
  return localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
}

export function setActiveProfileId(profileId) {
  localStorage.setItem(ACTIVE_PROFILE_ID_KEY, profileId);
}

export function clearActiveProfileId() {
  localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
}


