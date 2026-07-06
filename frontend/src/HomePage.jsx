import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { aiGetDailyRecipes, aiGetRecipeDetail, adminCreateRecipe, getPopularRecipes, getHistory, getCurrentUser } from './api.js';
import ds from './design.js';

const TODAY = new Date().toISOString().slice(0, 10);
const CACHE_KEY = `tarifapp_daily_v2_${TODAY}`;

const difficultyColor = {
  kolay: { bg: ds.colors.successLight, text: ds.colors.success },
  orta:  { bg: ds.colors.warningLight, text: ds.colors.warning },
  zor:   { bg: ds.colors.dangerLight,  text: ds.colors.danger  },
};

const CATEGORIES = [
  { label: 'Çorba',       value: 'corba',      emoji: '🍲', bg: '#fef3c7', color: '#92400e' },
  { label: 'Ana Yemek',   value: 'ana-yemek',  emoji: '🍽️', bg: '#dcfce7', color: '#14532d' },
  { label: 'Tatlı',       value: 'tatli',      emoji: '🍮', bg: '#fce7f3', color: '#9d174d' },
  { label: 'Ara Yemek',   value: 'ara-yemek',  emoji: '🥗', bg: '#ffedd5', color: '#9a3412' },
  { label: 'Aperatif',    value: 'aperatif',   emoji: '🫙', bg: '#ede9fe', color: '#5b21b6' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRecipe, setOpenRecipe] = useState(null);
  const [popular, setPopular] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [userName, setUserName] = useState(null);
  const isAdmin = localStorage.getItem('role') === 'admin';
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    loadDaily();
    getPopularRecipes().then(d => setPopular((d.recipes || []).slice(0, 5))).catch(() => {});
    if (isLoggedIn) {
      getHistory().then(d => setRecentHistory((d.history || []).slice(0, 4))).catch(() => {});
      getCurrentUser().then(d => setUserName(d.user?.fullName?.split(' ')[0] || null)).catch(() => {});
    }
  }, []);

  function loadDaily(forceRefresh = false) {
    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecipes(parsed);
            setLoading(false);
            return;
          } else {
            localStorage.removeItem(CACHE_KEY);
          }
        }
      } catch (_) {
        localStorage.removeItem(CACHE_KEY);
      }
    }
    setLoading(true);
    setError(null);
    setOpenRecipe(null);
    aiGetDailyRecipes()
      .then(data => {
        const list = Array.isArray(data.recipes) ? data.recipes : [];
        setRecipes(list);
        if (list.length > 0) {
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(list)); } catch (_) {}
        }
      })
      .catch(err => setError(err.message || 'Günlük tarif önerileri alınamadı.'))
      .finally(() => setLoading(false));
  }

  function handleOpen(recipe) {
    if (openRecipe?.name === recipe.name) { setOpenRecipe(null); return; }
    setOpenRecipe({ name: recipe.name, recipeData: recipe, detail: null, loading: true, error: null, saving: false, saved: false, saveError: null, categoryId: '' });
    aiGetRecipeDetail(recipe.name)
      .then(data => setOpenRecipe(prev => prev?.name === recipe.name ? { ...prev, detail: data.detail, loading: false } : prev))
      .catch(err => setOpenRecipe(prev => prev?.name === recipe.name ? { ...prev, loading: false, error: err?.message || 'Detay alınamadı.' } : prev));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Hero / Selamlama */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #9333ea 100%)', borderRadius: 20, padding: '32px 28px 28px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 36px rgba(124,58,237,0.28)' }}>
        {/* Dekoratif çemberler */}
        <div style={{ position: 'absolute', right: -20, top: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -45, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: -15, bottom: -15, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
          {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h2 style={{ margin: '0 0 10px', fontSize: '1.65rem', fontWeight: 900, lineHeight: 1.15, color: '#ffffff', letterSpacing: '-0.5px' }}>
          {userName ? `Merhaba, ${userName} 👋` : 'Bugün ne pişirsek?'}
        </h2>
        <p style={{ margin: '0 0 20px', color: 'rgba(255,255,255,0.72)', fontSize: '0.88rem', lineHeight: 1.65 }}>
          Binlerce tarif, her damak zevkine göre.
        </p>

        {/* İstatistik çipleri */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
          {[{ v: '115+', l: 'Tarif' }, { v: '5', l: 'Kategori' }, { v: '✨', l: 'AI Destekli' }].map(s => (
            <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(4px)', borderRadius: 8, padding: '5px 11px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>{s.v}</span>
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>{s.l}</span>
            </div>
          ))}
        </div>

        <button
          className="btn"
          style={{ background: '#fff', color: '#7c3aed', fontWeight: 700, fontSize: '0.88rem', padding: '9px 22px', border: 'none', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.18)', letterSpacing: '-0.1px' }}
          onClick={() => navigate('/search')}
        >
          Tarif Ara →
        </button>
      </div>

      {/* Kategoriler */}
      <div>
        <h3 className="section-title" style={{ marginBottom: 14 }}>Kategoriler</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => navigate(`/search?category=${cat.value}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: cat.bg, border: '1.5px solid transparent',
                borderRadius: 12, padding: '9px 16px', cursor: 'pointer',
                fontSize: '0.84rem', fontWeight: 600, color: cat.color,
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
            >
              <span style={{ fontSize: '1.1rem' }}>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Son Görüntülenenler */}
      {isLoggedIn && recentHistory.length > 0 && (
        <div>
          <div className="section-header">
            <h3 className="section-title">Son Baktıklarım</h3>
            <Link to="/history" className="section-link">Tümü →</Link>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {recentHistory.map(r => (
              <Link
                key={r.id}
                to={`/recipes/${r.id}`}
                style={{ ...ds.card, padding: '10px 14px', textDecoration: 'none', color: ds.colors.textSecondary, fontSize: ds.text.sm.fontSize, fontWeight: 600, flexShrink: 0, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                🕐 {r.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popüler Tarifler */}
      {popular.length > 0 && (
        <div>
          <div className="section-header">
            <h3 className="section-title">🔥 Popüler Tarifler</h3>
            <Link to="/search" className="section-link">Tümü →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {popular.map((r, i) => (
              <Link
                key={r.id}
                to={`/recipes/${r.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 12, ...ds.card, padding: '12px 16px', textDecoration: 'none', color: 'inherit' }}
              >
                <span style={{ minWidth: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#fef9c3' : i === 1 ? '#f1f5f9' : '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: i === 0 ? '#854d0e' : '#64748b', flexShrink: 0 }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: ds.colors.textPrimary, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                  <div style={{ fontSize: ds.text.xs.fontSize, color: ds.colors.textMuted, marginTop: 2 }}>{r.category} · {r.difficulty}</div>
                </div>
                {r.favoriteCount > 0 && (
                  <span style={{ fontSize: '0.78rem', color: '#a855f7', fontWeight: 700, flexShrink: 0 }}>♥ {r.favoriteCount}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Günün AI Tarifleri */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <div>
            <h2 className="home-title" style={{ marginBottom: 4 }}>Günün Tarifleri ✨</h2>
            <p style={{ color: ds.colors.textSecondary, fontSize: ds.text.sm.fontSize, margin: 0 }}>Yapay zeka bugün için 3 tarif seçti</p>
          </div>
          <button className="btn btn-secondary" style={{ fontSize: '0.83rem', padding: '7px 14px' }} onClick={() => loadDaily(true)} disabled={loading}>
            🔄 Yenile
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="error" style={{ marginTop: 8 }}>
            {error}
            <button onClick={() => loadDaily(true)} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#dc2626', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>
              Tekrar dene
            </button>
          </div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {recipes.map((recipe, i) => (
              <div key={i} style={{ ...ds.cardLg, padding: `${ds.space[4]}px ${ds.space[5]}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: ds.colors.textPrimary, fontSize: ds.text.md.fontSize, marginBottom: 4 }}>{recipe.name}</div>
                  <div style={{ color: ds.colors.textSecondary, fontSize: ds.text.sm.fontSize, lineHeight: 1.5 }}>{recipe.description}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    {recipe.difficulty && <span style={{ fontSize: '0.72rem', fontWeight: 600, background: (difficultyColor[recipe.difficulty?.toLowerCase()] || difficultyColor.orta).bg, color: (difficultyColor[recipe.difficulty?.toLowerCase()] || difficultyColor.orta).text, borderRadius: 6, padding: '2px 8px' }}>{recipe.difficulty}</span>}
                    {recipe.time && <span style={{ fontSize: '0.72rem', color: '#0369a1', background: '#e0f2fe', borderRadius: 6, padding: '2px 8px', fontWeight: 500 }}>⏱ {recipe.time}</span>}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ flexShrink: 0, fontSize: '0.82rem', padding: '7px 14px', opacity: openRecipe?.name === recipe.name ? 0.85 : 1 }}
                  onClick={() => handleOpen(recipe)}
                >
                  {openRecipe?.name === recipe.name ? 'Kapat' : 'Tarifi Gör'}
                </button>
              </div>

              {openRecipe?.name === recipe.name && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${ds.colors.borderSubtle}` }}>
                    {openRecipe.loading && <div style={{ color: ds.colors.textMuted, fontSize: ds.text.sm.fontSize }}>Tarif yükleniyor...</div>}
                  {openRecipe.error && <div style={{ color: '#ef4444', fontSize: '0.88rem' }}>{openRecipe.error}</div>}
                  {openRecipe.detail && (
                    <div>
                      {Array.isArray(openRecipe.detail.ingredients) && openRecipe.detail.ingredients.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Malzemeler</div>
                          {openRecipe.detail.ingredients.map((ing, j) => {
                            const label = typeof ing === 'object' && ing !== null ? `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim() : String(ing);
                            return <div key={j} style={{ color: '#475569', fontSize: '0.85rem', paddingLeft: 8, lineHeight: 1.8 }}>• {label}</div>;
                          })}
                        </div>
                      )}
                      {Array.isArray(openRecipe.detail.steps) && openRecipe.detail.steps.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Hazırlanış</div>
                          {openRecipe.detail.steps.map((step, j) => (
                            <div key={j} style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.7 }}><span style={{ fontWeight: 700, color: '#7c3aed' }}>{j + 1}.</span> {step}</div>
                          ))}
                        </div>
                      )}
                      {openRecipe.detail.note && (
                        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 14px', fontSize: '0.83rem', color: '#9a3412' }}>💡 {openRecipe.detail.note}</div>
                      )}
                      {isAdmin && !openRecipe.saved && (
                        <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <select className="form-input" style={{ flex: 1, minWidth: 140, fontSize: '0.85rem', padding: '6px 10px' }} value={openRecipe.categoryId} onChange={e => setOpenRecipe(prev => ({ ...prev, categoryId: e.target.value }))}>
                            <option value="">Kategori seç...</option>
                            <option value="1">Ana Yemek</option>
                            <option value="2">Çorba</option>
                            <option value="3">Tatlı</option>
                            <option value="16">Aperatif</option>
                            <option value="17">Ara Yemek</option>
                          </select>
                          <button
                            style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: '0.83rem', cursor: openRecipe.saving || !openRecipe.categoryId ? 'not-allowed' : 'pointer', opacity: openRecipe.saving || !openRecipe.categoryId ? 0.6 : 1, fontWeight: 600 }}
                            disabled={openRecipe.saving || !openRecipe.categoryId}
                            onClick={() => {
                              setOpenRecipe(prev => ({ ...prev, saving: true, saveError: null }));
                              adminCreateRecipe({
                                title: openRecipe.name,
                                description: openRecipe.recipeData?.description || '',
                                difficulty: (openRecipe.recipeData?.difficulty || 'orta').toLowerCase(),
                                categoryId: openRecipe.categoryId,
                                ingredients: openRecipe.detail.ingredients || [],
                                steps: openRecipe.detail.steps || []
                              })
                                .then(() => setOpenRecipe(prev => ({ ...prev, saving: false, saved: true })))
                                .catch(err => setOpenRecipe(prev => ({ ...prev, saving: false, saveError: err?.message || 'Kaydetme başarısız.' })));
                            }}
                          >
                            {openRecipe.saving ? 'Kaydediliyor...' : '💾 Veritabanına Kaydet'}
                          </button>
                          {openRecipe.saveError && <span style={{ color: '#ef4444', fontSize: '0.82rem' }}>{openRecipe.saveError}</span>}
                        </div>
                      )}
                      {openRecipe.saved && <div style={{ marginTop: 10, color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>✅ Tarif başarıyla kaydedildi!</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
