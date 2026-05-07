import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAdminStats, getAdminUsers, deleteAdminUser, getAdminRecipes, deleteAdminRecipe, getAdminRecipeNotes, getAdminUserActivity, getReportCategories, getReportTopFavorites, getReportDailyViews, getPopularRecipes } from './api.js';
import DashboardStats from './DashboardStats.jsx';
import Casestudies from './components/ui/case-studies.jsx';
import ds from './design.js';

const difficultyColor = {
  kolay: { bg: ds.colors.successLight, text: ds.colors.success },
  orta:  { bg: ds.colors.warningLight, text: ds.colors.warning },
  zor:   { bg: ds.colors.dangerLight,  text: ds.colors.danger  },
};

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users',     label: 'Kullanıcılar', icon: '👥' },
  { id: 'recipes',   label: 'Tarifler', icon: '📋' },
  { id: 'reports',   label: 'Raporlar', icon: '📈' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';
  function setTab(t) { setSearchParams({ tab: t }, { replace: true }); }

  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [popular, setPopular] = useState([]);
  const [reports, setReports] = useState({ categories: [], topFavorites: [], dailyViews: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [recipeDetail, setRecipeDetail] = useState(null); // { id, notes, ratings, loading }
  const [userDetail, setUserDetail] = useState(null); // { id, full_name, email, loading, notes, ratings, cooked }

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (tab === 'dashboard') {
      Promise.all([getAdminStats(), getPopularRecipes()])
        .then(([s, p]) => { setStats(s); setPopular((p.recipes || []).slice(0, 6)); })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (tab === 'users') {
      getAdminUsers()
        .then(data => setUsers(data.users || []))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (tab === 'recipes') {
      getAdminRecipes()
        .then(data => setRecipes(data.recipes || []))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (tab === 'reports') {
      Promise.all([getReportCategories(), getReportTopFavorites(), getReportDailyViews()])
        .then(([cat, fav, views]) => setReports({
          categories: cat.stats || [],
          topFavorites: fav.recipes || [],
          dailyViews: views.views || [],
        }))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [tab]);

  function handleDeleteUser(id) {
    if (!confirm('Bu kullanıcıyı silmek istediğine emin misin?')) return;
    deleteAdminUser(id)
      .then(() => setUsers(prev => prev.filter(u => u.id !== id)))
      .catch(err => setError(err.message));
  }

  function handleDeleteRecipe(id) {
    if (!confirm('Bu tarifi silmek istediğine emin misin?')) return;
    deleteAdminRecipe(id)
      .then(() => setRecipes(prev => prev.filter(r => r.id !== id)))
      .catch(err => setError(err.message));
  }

  const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, marginBottom: 4, textTransform: 'capitalize' }}>{today}</div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: -0.5 }}>Admin Paneli</h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>İstatistikleri izle, kullanıcıları ve tarifleri yönet.</p>
      </div>

      {/* TAB NAV */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 28, gap: 0 }}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontWeight: tab === id ? 600 : 400,
              color: tab === id ? '#7c3aed' : '#64748b',
              cursor: 'pointer',
              borderBottom: tab === id ? '2px solid #7c3aed' : '2px solid transparent',
              marginBottom: -1,
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div className="error" style={{ marginBottom: 16 }}>{error}</div>}
      {loading && <div className="loading" style={{ marginBottom: 16 }}>Yükleniyor...</div>}

      {/* ── DASHBOARD ── */}
      {!loading && tab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* STAT CARDS */}
          <DashboardStats stats={stats} />

          {/* POPULAR RECIPES */}
          {popular.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, color: ds.colors.textPrimary, fontSize: '0.95rem' }}>Popüler Tarifler</div>
                  <div style={{ fontSize: ds.text.xs.fontSize, color: ds.colors.textMuted, marginTop: 2 }}>En çok favorilenenler</div>
                </div>
                <button
                  onClick={() => setTab('recipes')}
                  style={{ background: 'none', border: `1px solid ${ds.colors.border}`, borderRadius: ds.radius.md, padding: '6px 14px', fontSize: ds.text.sm.fontSize, color: ds.colors.textSecondary, cursor: 'pointer', fontWeight: 500 }}
                >
                  Tümünü gör →
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {popular.map(r => (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/recipes/${r.id}`)}
                    style={{ ...ds.card, padding: '16px 18px', cursor: 'pointer' }}
                  >
                    <div style={{ fontWeight: 600, color: ds.colors.textPrimary, fontSize: '0.9rem', marginBottom: 6, lineHeight: 1.3 }}>{r.title}</div>
                    <div style={{ fontSize: ds.text.xs.fontSize, color: ds.colors.textSecondary, lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.description}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {r.difficulty
                        ? <span style={{ fontSize: '0.7rem', fontWeight: 600, background: (difficultyColor[r.difficulty] || difficultyColor.orta).bg, color: (difficultyColor[r.difficulty] || difficultyColor.orta).text, borderRadius: 5, padding: '2px 8px' }}>{r.difficulty}</span>
                        : <span />}
                      <span style={{ fontSize: '0.75rem', color: ds.colors.textMuted }}>♥ {r.favorite_count || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Casestudies stats={stats} />
        </div>
      )}

      {/* ── KULLANICILAR ── */}
      {!loading && tab === 'users' && (
        <>
          {/* Kullanıcı detay modalı */}
          {userDetail && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setUserDetail(null)}>
              <div style={{ background: '#fff', borderRadius: 18, padding: 28, maxWidth: 580, width: '100%', maxHeight: '82vh', overflowY: 'auto', boxShadow: ds.shadow.lg }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', color: ds.colors.textPrimary }}>{userDetail.full_name}</h3>
                    <div style={{ color: ds.colors.textMuted, fontSize: ds.text.xs.fontSize }}>{userDetail.email}</div>
                  </div>
                  <button onClick={() => setUserDetail(null)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                </div>
                {userDetail.loading
                  ? <div style={{ color: ds.colors.textMuted, textAlign: 'center', padding: 32 }}>Yükleniyor...</div>
                  : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                      {/* Puanlamalar */}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: ds.text.sm.fontSize, color: ds.colors.textSecondary, marginBottom: 10 }}>⭐ Verilen Puanlar ({userDetail.ratings?.length || 0})</div>
                        {!userDetail.ratings?.length
                          ? <div style={{ color: ds.colors.textMuted, fontSize: ds.text.sm.fontSize }}>Henüz puan vermemiş.</div>
                          : userDetail.ratings.map((rt, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < userDetail.ratings.length - 1 ? `1px solid ${ds.colors.borderSubtle}` : 'none' }}>
                              <span onClick={() => { setUserDetail(null); navigate(`/recipes/${rt.recipe_id}`); }} style={{ fontWeight: 600, color: '#7c3aed', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>{rt.title}</span>
                              <div style={{ display: 'flex', gap: 2 }}>
                                {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= rt.rating ? '#f59e0b' : '#e2e8f0', fontSize: '1rem' }}>★</span>)}
                              </div>
                            </div>
                          ))
                        }
                      </div>

                      {/* Notlar */}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: ds.text.sm.fontSize, color: ds.colors.textSecondary, marginBottom: 10 }}>📝 Yazdığı Notlar ({userDetail.notes?.length || 0})</div>
                        {!userDetail.notes?.length
                          ? <div style={{ color: ds.colors.textMuted, fontSize: ds.text.sm.fontSize }}>Henüz not yazmamış.</div>
                          : userDetail.notes.map((n, i) => (
                              <div key={i} style={{ background: ds.colors.surfaceMuted, borderRadius: ds.radius.lg, padding: '10px 14px', marginBottom: 8 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span onClick={() => { setUserDetail(null); navigate(`/recipes/${n.recipe_id}`); }} style={{ fontWeight: 600, color: '#7c3aed', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}>{n.title}</span>
                                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{new Date(n.updated_at).toLocaleDateString('tr-TR')}</span>
                              </div>
                              <p style={{ margin: 0, color: '#334155', fontSize: '0.85rem', lineHeight: 1.5 }}>{n.note}</p>
                            </div>
                          ))
                        }
                      </div>

                      {/* Yaptığı tarifler */}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: ds.text.sm.fontSize, color: ds.colors.textSecondary, marginBottom: 10 }}>👨‍🍳 Yaptığı Tarifler ({userDetail.cooked?.length || 0})</div>
                        {!userDetail.cooked?.length
                          ? <div style={{ color: ds.colors.textMuted, fontSize: ds.text.sm.fontSize }}>Henüz tarif yapmamış.</div>
                          : userDetail.cooked.map((c, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < userDetail.cooked.length - 1 ? `1px solid ${ds.colors.borderSubtle}` : 'none' }}>
                              <span onClick={() => { setUserDetail(null); navigate(`/recipes/${c.recipe_id}`); }} style={{ fontWeight: 600, color: '#7c3aed', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>{c.title}</span>
                              <span style={{ fontSize: ds.text.xs.fontSize, color: ds.colors.textSecondary, fontWeight: 600 }}>{c.cooked_count}x yapıldı</span>
                            </div>
                          ))
                        }
                      </div>

                    </div>
                  )
                }
              </div>
            </div>
          )}

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
            {users.length} Kullanıcı
          </div>
            {users.length === 0 && <div style={{ padding: '24px 20px', color: ds.colors.textMuted, fontSize: '0.9rem' }}>Kullanıcı bulunamadı.</div>}
          {users.map((u, i) => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < users.length - 1 ? '1px solid #f8fafc' : 'none', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: ds.colors.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: ds.colors.accentText, fontSize: '0.9rem', flexShrink: 0 }}>
                  {(u.full_name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{u.full_name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{u.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ background: u.role === 'admin' ? '#fef3c7' : '#f0fdf4', color: u.role === 'admin' ? '#92400e' : '#166534', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700 }}>{u.role}</span>
                <button
                  onClick={() => {
                    setUserDetail({ id: u.id, full_name: u.full_name, email: u.email, loading: true });
                    getAdminUserActivity(u.id)
                      .then(d => setUserDetail(prev => prev?.id === u.id ? { ...prev, loading: false, notes: d.notes, ratings: d.ratings, cooked: d.cooked } : prev))
                      .catch(() => setUserDetail(prev => prev ? { ...prev, loading: false } : null));
                  }}
                  style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '5px 12px', fontSize: '0.8rem', color: '#0284c7', cursor: 'pointer', fontWeight: 600 }}
                >Detay</button>
                <button onClick={() => handleDeleteUser(u.id)} style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '5px 12px', fontSize: '0.8rem', color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>Sil</button>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {/* ── TARİFLER ── */}
      {!loading && tab === 'recipes' && (
        <>
          {/* Detay modal */}
          {recipeDetail && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setRecipeDetail(null)}>
              <div style={{ background: '#fff', borderRadius: 18, padding: 28, maxWidth: 560, width: '100%', maxHeight: '80vh', overflowY: 'auto', boxShadow: ds.shadow.lg }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: ds.colors.textPrimary }}>{recipeDetail.title}</h3>
                  <button onClick={() => setRecipeDetail(null)} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                </div>
                {recipeDetail.loading
                  ? <div style={{ color: ds.colors.textMuted, textAlign: 'center', padding: 24 }}>Yükleniyor...</div>
                  : (
                    <>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontWeight: 700, fontSize: ds.text.sm.fontSize, color: ds.colors.textSecondary, marginBottom: 10 }}>⭐ Puanlamalar ({recipeDetail.ratings?.length || 0})</div>
                        {(!recipeDetail.ratings || recipeDetail.ratings.length === 0)
                          ? <div style={{ color: ds.colors.textMuted, fontSize: ds.text.sm.fontSize }}>Henüz puan verilmemiş.</div>
                          : recipeDetail.ratings.map((rt, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < recipeDetail.ratings.length - 1 ? `1px solid ${ds.colors.borderSubtle}` : 'none' }}>
                              <div>
                                <span style={{ fontWeight: 600, color: ds.colors.textPrimary, fontSize: ds.text.sm.fontSize }}>{rt.full_name}</span>
                                <span style={{ color: ds.colors.textMuted, fontSize: ds.text.xs.fontSize, marginLeft: 6 }}>{rt.email}</span>
                              </div>
                              <div style={{ display: 'flex', gap: 2 }}>
                                {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= rt.rating ? '#f59e0b' : '#e2e8f0', fontSize: '1rem' }}>★</span>)}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: ds.text.sm.fontSize, color: ds.colors.textSecondary, marginBottom: 10 }}>📝 Kullanıcı Notları ({recipeDetail.notes?.length || 0})</div>
                        {(!recipeDetail.notes || recipeDetail.notes.length === 0)
                          ? <div style={{ color: ds.colors.textMuted, fontSize: ds.text.sm.fontSize }}>Henüz not girilmemiş.</div>
                          : recipeDetail.notes.map((n, i) => (
                              <div key={i} style={{ background: ds.colors.surfaceMuted, borderRadius: ds.radius.lg, padding: '10px 14px', marginBottom: 8 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontWeight: 600, color: ds.colors.textPrimary, fontSize: ds.text.xs.fontSize }}>{n.full_name}</span>
                                <span style={{ color: ds.colors.textMuted, fontSize: '0.75rem' }}>{new Date(n.updated_at).toLocaleDateString('tr-TR')}</span>
                              </div>
                              <p style={{ margin: 0, color: '#334155', fontSize: '0.85rem', lineHeight: 1.5 }}>{n.note}</p>
                            </div>
                          ))
                        }
                      </div>
                    </>
                  )
                }
              </div>
            </div>
          )}

            <div style={{ ...ds.card, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${ds.colors.borderSubtle}`, fontWeight: 600, color: ds.colors.textPrimary, fontSize: '0.9rem' }}>
              {recipes.length} Tarif
            </div>
            {recipes.length === 0 && <div style={{ padding: '24px 20px', color: '#94a3b8', fontSize: '0.9rem' }}>Tarif bulunamadı.</div>}
            {recipes.map((r, i) => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < recipes.length - 1 ? '1px solid #f8fafc' : 'none', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{r.title}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                    {r.difficulty && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, background: (difficultyColor[r.difficulty] || difficultyColor.orta).bg, color: (difficultyColor[r.difficulty] || difficultyColor.orta).text, borderRadius: 6, padding: '2px 8px' }}>{r.difficulty}</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>👨‍🍳 {r.cookedTotal || 0}x yapıldı</span>
                    {r.ratingCount > 0 && <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>★ {r.avgRating || '-'} ({r.ratingCount})</span>}
                    {r.noteCount > 0 && <span style={{ fontSize: '0.75rem', color: '#7c3aed' }}>📝 {r.noteCount} not</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(r.ratingCount > 0 || r.noteCount > 0) && (
                    <button
                      onClick={() => {
                        setRecipeDetail({ id: r.id, title: r.title, loading: true, notes: [], ratings: [] });
                        getAdminRecipeNotes(r.id).then(d => setRecipeDetail(prev => prev?.id === r.id ? { ...prev, loading: false, notes: d.notes, ratings: d.ratings } : prev)).catch(() => setRecipeDetail(prev => prev ? { ...prev, loading: false } : null));
                      }}
                      style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '5px 12px', fontSize: '0.8rem', color: '#0284c7', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Detay
                    </button>
                  )}
                  <button onClick={() => navigate(`/recipes/${r.id}`, { state: { editMode: true } })} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '5px 14px', fontSize: '0.8rem', color: '#334155', cursor: 'pointer', fontWeight: 600 }}>Düzenle</button>
                  <button onClick={() => handleDeleteRecipe(r.id)} style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '5px 14px', fontSize: '0.8rem', color: '#dc2626', cursor: 'pointer', fontWeight: 600 }}>Sil</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── RAPORLAR ── */}
      {!loading && tab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#0f172a' }}>Kategoriye Göre Tarif Dağılımı</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 320 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={th}>Kategori</th><th style={th}>Tarif</th><th style={th}>%</th><th style={{ ...th, minWidth: 160 }}>Dağılım</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.categories.map(row => (
                    <tr key={row.kategori} style={{ transition: 'background 0.1s' }}>
                      <td style={td}>{row.kategori}</td>
                      <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{row.sayi}</td>
                      <td style={{ ...td, textAlign: 'center', color: '#7c3aed', fontWeight: 700 }}>{row.yuzde}%</td>
                      <td style={td}>
                        <div style={{ background: '#f1f5f9', borderRadius: 99, height: 8 }}>
                          <div style={{ background: 'linear-gradient(90deg,#7c3aed,#a855f7)', borderRadius: 99, height: 8, width: `${row.yuzde}%`, transition: 'width 0.4s' }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#0f172a' }}>En Çok Favorilenen 10 Tarif</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 320 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={th}>#</th><th style={th}>Tarif</th><th style={th}>Kategori</th><th style={th}>Favori</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.topFavorites.length === 0
                    ? <tr><td colSpan={4} style={{ ...td, color: '#94a3b8', textAlign: 'center' }}>Henüz favori yok.</td></tr>
                    : reports.topFavorites.map(row => (
                      <tr key={row.title}>
                        <td style={{ ...td, textAlign: 'center', fontWeight: 800, color: '#7c3aed' }}>{row.sira}</td>
                        <td style={{ ...td, fontWeight: 600 }}>{row.title}</td>
                        <td style={td}>{row.kategori}</td>
                        <td style={{ ...td, textAlign: 'center', fontWeight: 700, color: '#e11d48' }}>❤ {row.favori_sayisi}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, color: '#0f172a' }}>Son 7 Gün Görüntülenme</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 280 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={th}>Tarih</th><th style={th}>Görüntülenme</th><th style={{ ...th, minWidth: 160 }}>Dağılım</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.dailyViews.length === 0
                    ? <tr><td colSpan={3} style={{ ...td, color: '#94a3b8', textAlign: 'center' }}>Bu hafta görüntülenme yok.</td></tr>
                    : (() => {
                        const max = Math.max(...reports.dailyViews.map(r => Number(r.goruntuleme)), 1);
                        return reports.dailyViews.map(row => (
                          <tr key={row.gun}>
                            <td style={td}>{new Date(row.gun).toLocaleDateString('tr-TR')}</td>
                            <td style={{ ...td, textAlign: 'center', fontWeight: 700 }}>{row.goruntuleme}</td>
                            <td style={td}>
                              <div style={{ background: '#f1f5f9', borderRadius: 99, height: 8 }}>
                                <div style={{ background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)', borderRadius: 99, height: 8, width: `${Number(row.goruntuleme) * 100 / max}%` }} />
                              </div>
                            </td>
                          </tr>
                        ));
                      })()
                  }
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

const th = { padding: '10px 20px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
const td = { padding: '12px 20px', borderBottom: '1px solid #f1f5f9', fontSize: '0.875rem', color: '#334155' };
