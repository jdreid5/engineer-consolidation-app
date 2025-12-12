import { useEffect, useMemo, useState } from 'react';
import {
  createProfile,
  deleteProfile,
  getProfile,
  listProfiles,
  verifyProfilePin,
} from '../storage/profiles';
import { clearActiveProfileId, getActiveProfileId, setActiveProfileId } from '../storage/settings';
import { exportProfileData, importProfileData } from '../storage/exportImport';

function ProfileGate({ onProfileReady }) {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const [createName, setCreateName] = useState('');
  const [createPin, setCreatePin] = useState('');
  const [importing, setImporting] = useState(false);

  const selectedProfile = useMemo(
    () => profiles.find((p) => p.profileId === selectedProfileId) || null,
    [profiles, selectedProfileId]
  );

  const refreshProfiles = async () => {
    const list = await listProfiles();
    setProfiles(list);
    return list;
  };

  useEffect(() => {
    (async () => {
      try {
        const list = await refreshProfiles();
        const activeId = getActiveProfileId();
        if (activeId) {
          const exists = list.some((p) => p.profileId === activeId);
          if (exists) setSelectedProfileId(activeId);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelect = async (profileId) => {
    setError('');
    setPin('');
    setSelectedProfileId(profileId);
    setActiveProfileId(profileId);

    const p = await getProfile(profileId);
    if (p && !p.pinHash) {
      onProfileReady(p);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedProfileId) return;

    const ok = await verifyProfilePin(selectedProfileId, pin);
    if (!ok) {
      setError('Incorrect PIN');
      return;
    }
    const p = await getProfile(selectedProfileId);
    onProfileReady(p);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const p = await createProfile({
        name: createName,
        pin: createPin ? createPin : null,
      });
      setCreateName('');
      setCreatePin('');
      await refreshProfiles();
      await handleSelect(p.profileId);
    } catch (err) {
      setError(err.message || 'Failed to create profile');
    }
  };

  const handleDelete = async (profileId) => {
    const p = profiles.find((x) => x.profileId === profileId);
    const name = p?.name || 'this profile';
    // eslint-disable-next-line no-alert
    const ok = window.confirm(`Delete ${name}? This removes all progress on this device.`);
    if (!ok) return;

    await deleteProfile(profileId);
    if (getActiveProfileId() === profileId) clearActiveProfileId();
    const list = await refreshProfiles();
    const activeId = getActiveProfileId();
    if (activeId && list.some((x) => x.profileId === activeId)) {
      setSelectedProfileId(activeId);
    } else {
      setSelectedProfileId(null);
    }
  };

  const downloadJson = (filename, obj) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (profileId) => {
    const data = await exportProfileData(profileId);
    const safeName = (data.profile?.name || 'profile').replace(/[^\w\-]+/g, '_');
    downloadJson(`eda_${safeName}.json`, data);
  };

  const handleImportFile = async (file) => {
    setError('');
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const profileId = await importProfileData(data);
      await refreshProfiles();
      await handleSelect(profileId);
    } catch (err) {
      setError(err.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">&lt;/&gt;</div>
          <h1>Engineer Development</h1>
          <p>Select a local profile</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="login-form" style={{ gap: 16 }}>
          <h2>Profiles</h2>

          {profiles.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No profiles yet. Create one below.</p>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {profiles.map((p) => (
                <div
                  key={p.profileId}
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleSelect(p.profileId)}
                    style={{
                      flex: 1,
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <span>{p.name}</span>
                    <span style={{ opacity: 0.75 }}>{p.pinHash ? '🔒' : ''}</span>
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => handleExport(p.profileId)}>
                    Export
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => handleDelete(p.profileId)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedProfile && selectedProfile.pinHash && (
            <form onSubmit={handleUnlock} style={{ display: 'grid', gap: 10, marginTop: 8 }}>
              <h3 style={{ margin: 0 }}>Unlock “{selectedProfile.name}”</h3>
              <div className="form-group">
                <label htmlFor="pin">PIN</label>
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN"
                  minLength={4}
                  required
                />
              </div>
              <button className="btn-primary" type="submit">
                Unlock
              </button>
            </form>
          )}

          <div className="nav-divider"></div>

          <div style={{ display: 'grid', gap: 10 }}>
            <h2>Import Profile</h2>
            <input
              type="file"
              accept="application/json"
              disabled={importing}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                handleImportFile(file);
                e.target.value = '';
              }}
            />
            <p style={{ opacity: 0.75, margin: 0 }}>
              Imports create a new local profile. PINs are not exported/imported.
            </p>
          </div>

          <div className="nav-divider"></div>

          <form onSubmit={handleCreate} style={{ display: 'grid', gap: 10 }}>
            <h2>Create Profile</h2>
            <div className="form-group">
              <label htmlFor="profileName">Name</label>
              <input
                id="profileName"
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g., Jon"
                minLength={1}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="profilePin">PIN (optional)</label>
              <input
                id="profilePin"
                type="password"
                inputMode="numeric"
                value={createPin}
                onChange={(e) => setCreatePin(e.target.value)}
                placeholder="Optional"
                minLength={4}
              />
            </div>
            <button className="btn-primary" type="submit">
              Create Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileGate;


