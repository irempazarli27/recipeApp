import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { loginUser, registerUser, getCurrentUser, loginWithGoogle, updateProfile } from './api.js';
import ds from './design.js';

const QUICK_LINKS = [
  { to: '/favorites',      emoji: '❤️',  label: 'Favoriler',        sub: 'Kaydettiğiniz tarifler' },
  { to: '/wishlist',       emoji: '📋',  label: 'Yapacaklarım',     sub: 'Pişirme planınız' },
  { to: '/history',        emoji: '🕐',  label: 'Geçmiş',           sub: 'Görüntülenen tarifler' },
  { to: '/shopping-lists', emoji: '🛒',  label: 'Alışveriş',        sub: 'Alışveriş listeleriniz' },
  { to: '/weekly-plan',    emoji: '📅',  label: 'Haftalık Menü',    sub: '7 günlük plan' },
];

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 52 }) {
  const letter = (name || '?')[0].toUpperCase();
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, color: '#fff',
      fontSize: size * 0.38,
      flexShrink: 0,
      userSelect: 'none',
      boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
    }}>
      {letter}
    </div>
  );
}

// ── Profile view ──────────────────────────────────────────────────────────────
function ProfileView({ user, onLogout, onUpdate }) {
  const isAdmin   = user.role === 'admin';
  const joinedAt  = user.createdAt || user.created_at;
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user.fullName);
  const [editPassword, setEditPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [editErr, setEditErr] = useState(null);
  const [editOk, setEditOk] = useState(null);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setEditErr(null); setEditOk(null);
    try {
      const data = await updateProfile({ fullName: editName, password: editPassword || undefined });
      onUpdate(data.user);
      setEditOk('Bilgiler güncellendi.');
      setEditMode(false);
      setEditPassword('');
    } catch (err) {
      setEditErr(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="acc-page">

      {/* ── Profile card ─────────────────────── */}
      <div className="acc-profile-card">
        <div className="acc-profile-card__bg" />
        <div className="acc-profile-card__body">
          <div className="acc-profile-card__avatar">
            <Avatar name={user.fullName} size={60} />
          </div>
          <div className="acc-profile-card__info">
            <div className="acc-profile-card__name">{user.fullName}</div>
            <div className="acc-profile-card__email">{user.email}</div>
            <div className="acc-profile-card__meta">
              <span
                className="acc-role-badge"
                style={{
                  background: isAdmin ? ds.colors.warningLight : ds.colors.successLight,
                  color:      isAdmin ? ds.colors.warning       : ds.colors.success,
                }}
              >
                {isAdmin ? '⚡ Admin' : '👤 Kullanıcı'}
              </span>
              {joinedAt && (
                <span className="acc-joined">
                  Üye olma: {new Date(joinedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
            <button
              onClick={() => { setEditMode(e => !e); setEditErr(null); setEditOk(null); setEditName(user.fullName); setEditPassword(''); }}
              style={{ marginTop: 10, fontSize: '0.78rem', padding: '4px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', color: '#475569' }}
            >
              {editMode ? 'İptal' : '✏️ Düzenle'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Edit form ────────────────────────── */}
      {editOk && !editMode && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', color: '#16a34a', fontSize: '0.83rem', fontWeight: 500 }}>
          ✓ {editOk}
        </div>
      )}
      {editMode && (
        <div className="acc-section">
          <div className="acc-section__title">Bilgileri Düzenle</div>
          {editErr && <div style={{ color: '#dc2626', fontSize: '0.82rem', marginBottom: 8 }}>{editErr}</div>}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: 4 }}>Ad Soyad</label>
              <input className="form-input" value={editName} onChange={e => setEditName(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: 4 }}>Yeni Şifre <span style={{ color: '#94a3b8' }}>(boş bırakırsan değişmez)</span></label>
              <input className="form-input" type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="En az 6 karakter" />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving} style={{ alignSelf: 'flex-start' }}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </div>
      )}

      {/* ── Quick links ──────────────────────── */}
      <div className="acc-section">
        <div className="acc-section__title">Sayfalar</div>
        <div className="acc-links">
          {QUICK_LINKS.map(({ to, emoji, label, sub }) => (
            <Link key={to} to={to} className="acc-link">
              <span className="acc-link__emoji">{emoji}</span>
              <div className="acc-link__text">
                <span className="acc-link__label">{label}</span>
                <span className="acc-link__sub">{sub}</span>
              </div>
              <span className="acc-link__arrow">→</span>
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="acc-link acc-link--admin">
              <span className="acc-link__emoji">⚙️</span>
              <div className="acc-link__text">
                <span className="acc-link__label">Admin Paneli</span>
                <span className="acc-link__sub">Tarif ve kullanıcı yönetimi</span>
              </div>
              <span className="acc-link__arrow">→</span>
            </Link>
          )}
        </div>
      </div>



    </div>
  );
}

// ── Auth forms ────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const [tab, setTab]               = useState('login');
  const [user, setUser]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [success, setSuccess]       = useState(null);

  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName]             = useState('');
  const [regEmail, setRegEmail]           = useState('');
  const [regPassword, setRegPassword]     = useState('');

  const loginGoogleRef = useRef(null);
  const registerGoogleRef = useRef(null);

  const handleGoogleCredential = useCallback((credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      setError('Google kimlik bilgisi alınamadı.');
      return;
    }
    setError(null);
    setSuccess(null);
    loginWithGoogle(idToken)
      .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user?.role || '');
        setUser(data.user);
        setSuccess('Google ile giriş başarılı!');
      })
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    getCurrentUser()
      .then(data => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  // GSI initialize + butonları render et
  useEffect(() => {
    if (user || !googleClientId) return;
    if (!window.google?.accounts?.id) return;

    if (!window._gsiInitDone) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      });
      window._gsiInitDone = true;
    }

    if (loginGoogleRef.current) {
      loginGoogleRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(loginGoogleRef.current, {
        theme: 'outline', size: 'large', shape: 'pill', width: 280,
        text: 'signin_with', locale: 'tr',
      });
    }
    if (registerGoogleRef.current) {
      registerGoogleRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(registerGoogleRef.current, {
        theme: 'outline', size: 'large', shape: 'pill', width: 280,
        text: 'signup_with', locale: 'tr',
      });
    }
  }, [user, googleClientId, handleGoogleCredential]); // tab YOK

  // Tab değişince sadece butonları yeniden render et (initialize ÇAĞRILMAZ)
  useEffect(() => {
    if (user || !window._gsiInitDone) return;
    if (loginGoogleRef.current) {
      loginGoogleRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(loginGoogleRef.current, {
        theme: 'outline', size: 'large', shape: 'pill', width: 280,
        text: 'signin_with', locale: 'tr',
      });
    }
    if (registerGoogleRef.current) {
      registerGoogleRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(registerGoogleRef.current, {
        theme: 'outline', size: 'large', shape: 'pill', width: 280,
        text: 'signup_with', locale: 'tr',
      });
    }
  }, [user, tab]);

  function handleLogin(e) {
    e.preventDefault();
    setError(null);
    loginUser({ email: loginEmail, password: loginPassword })
      .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user?.role || '');
        setUser(data.user);
      })
      .catch(err => setError(err.message));
  }

  function handleRegister(e) {
    e.preventDefault();
    setError(null);
    registerUser({ fullName: regName, email: regEmail, password: regPassword })
      .then(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user?.role || '');
        setUser(data.user);
        setSuccess('Kayıt başarılı!');
      })
      .catch(err => setError(err.message));
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    setSuccess(null);
    setError(null);
  }

  if (loading) return <div className="loading">Yükleniyor…</div>;

  if (user) return <ProfileView user={user} onLogout={handleLogout} onUpdate={setUser} />;

  return (
    <div className="acc-auth">
      <div className="acc-auth__card">
        {/* Tabs */}
        <div className="acc-auth__tabs">
          <button
            className={`acc-auth__tab${tab === 'login' ? ' acc-auth__tab--on' : ''}`}
            onClick={() => { setTab('login'); setError(null); }}
          >Giriş Yap</button>
          <button
            className={`acc-auth__tab${tab === 'register' ? ' acc-auth__tab--on' : ''}`}
            onClick={() => { setTab('register'); setError(null); }}
          >Kayıt Ol</button>
        </div>

        <div className="acc-auth__body">
          <div className="acc-auth__eyebrow">
            {tab === 'login' ? '👋 Tekrar hoş geldiniz' : '✨ Hesap oluşturun'}
          </div>

          {error   && <div className="error"   style={{ marginBottom: 14 }}>{error}</div>}
          {success && <div className="success-msg" style={{ marginBottom: 14 }}>✓ {success}</div>}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="form-input" type="email"    placeholder="E-posta"  value={loginEmail}    onChange={e => setLoginEmail(e.target.value)}    required />
              <input className="form-input" type="password" placeholder="Şifre"    value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              <button className="btn btn-full" type="submit" style={{ marginTop: 4 }}>Giriş Yap</button>

              {googleClientId ? (
                <>
                  <div className="acc-auth__divider"><span>veya</span></div>
                  <div ref={loginGoogleRef} style={{ display: 'flex', justifyContent: 'center' }} />
                </>
              ) : (
                <small style={{ color: '#64748b', textAlign: 'center' }}>
                  Google girişi için VITE_GOOGLE_CLIENT_ID ayarı gerekli.
                </small>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="form-input" placeholder="Ad Soyad"                   value={regName}     onChange={e => setRegName(e.target.value)}     required />
              <input className="form-input" type="email"    placeholder="E-posta"    value={regEmail}    onChange={e => setRegEmail(e.target.value)}    required />
              <input className="form-input" type="password" placeholder="Şifre (min. 6 karakter)" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
              <button className="btn btn-full" type="submit" style={{ marginTop: 4 }}>Kayıt Ol</button>

              {googleClientId ? (
                <>
                  <div className="acc-auth__divider"><span>veya</span></div>
                  <div ref={registerGoogleRef} style={{ display: 'flex', justifyContent: 'center' }} />
                </>
              ) : (
                <small style={{ color: '#64748b', textAlign: 'center' }}>
                  Google kaydı için VITE_GOOGLE_CLIENT_ID ayarı gerekli.
                </small>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
