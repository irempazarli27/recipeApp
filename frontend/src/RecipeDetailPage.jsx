import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getRecipeDetail, getFavorites, addFavorite, removeFavorite, updateAdminRecipe, updateAdminRecipeSteps, createShoppingListFromRecipe, getRecipeRating, rateRecipe, getRecipeNote, saveRecipeNote, markRecipeCooked, addToWishlist, removeFromWishlist, getWishlist, getSimilarRecipes, aiTransformRecipe } from './api.js';
import ds from './design.js';

const difficultyColor = { kolay: ds.colors.success, orta: ds.colors.warning, zor: ds.colors.danger };

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [listFromRecipeLoading, setListFromRecipeLoading] = useState(false);
  const [listFromRecipeMsg, setListFromRecipeMsg] = useState(null);
  const [ratingData, setRatingData] = useState({ avg: 0, count: 0, userRating: null });
  const [ratingLoading, setRatingLoading] = useState(false);
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [cookedCount, setCookedCount] = useState(0);
  const [cookedLoading, setCookedLoading] = useState(false);
  const [hasCooked, setHasCooked] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [servings, setServings] = useState(4); // varsayılan 4 kişilik
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [transformLoading, setTransformLoading] = useState(false);
  const [transformResult, setTransformResult] = useState(null);
  const [transformError, setTransformError] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const isLoggedIn = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'admin';

  useEffect(() => {
    setLoading(true);
    setEditMode(false);
    const recipeId = Number(id);
    Promise.all([
      getRecipeDetail(id),
      isLoggedIn ? getFavorites() : Promise.resolve({ favorites: [] })
    ])
      .then(([recipeData, favData]) => {
        setRecipe(recipeData.recipe);
        const favIds = new Set((favData.favorites || []).map(f => f.id));
        setFavorited(favIds.has(recipeId));
        // Yaptım durumu
        if (recipeData.recipe.cookedByMe) setHasCooked(true);
        if (recipeData.recipe.cookedCount) setCookedCount(recipeData.recipe.cookedCount);
        // Rating yükle
        getRecipeRating(recipeId).then(setRatingData).catch(() => {});
        // Not yükle (giriş yapmışsa)
        if (isLoggedIn) {
          getRecipeNote(recipeId).then(d => setNote(d.note || '')).catch(() => {});
          getWishlist().then(d => {
            const ids = new Set((d.wishlist || []).map(w => w.id));
            setInWishlist(ids.has(recipeId));
          }).catch(() => {});
        }
        if (location.state?.editMode) {
          const r = recipeData.recipe;
          setEditData({
            title: r.title,
            description: r.description || '',
            difficulty: r.difficulty,
            tags: (r.tags || []).join(', '),
            steps: (r.steps || []).map(s => s.instruction)
          });
          setEditMode(true);
        }
        // Benzer tarifler yükle
        getSimilarRecipes(recipeId).then(d => setSimilarRecipes(d.recipes || [])).catch(() => {});
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function startEdit() {
    setEditData({
      title: recipe.title,
      description: recipe.description || '',
      difficulty: recipe.difficulty,
      tags: (recipe.tags || []).join(', '),
      steps: (recipe.steps || []).map(s => s.instruction)
    });
    setSaveError(null);
    setEditMode(true);
  }

  function cancelEdit() {
    if (location.state?.editMode) {
      navigate(-1);
      return;
    }
    setEditMode(false);
    setEditData(null);
    setSaveError(null);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError(null);
    try {
      await updateAdminRecipe(Number(id), {
        title: editData.title,
        description: editData.description,
        difficulty: editData.difficulty,
        tags: editData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      });
      await updateAdminRecipeSteps(Number(id), editData.steps.filter(s => s.trim()));
      const updated = await getRecipeDetail(id);
      setRecipe(updated.recipe);
      setEditMode(false);
      navigate(-1);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaveLoading(false);
    }
  }

  function handleFavorite() {
    setFavLoading(true);
    const action = favorited ? removeFavorite(id) : addFavorite(Number(id));
    action
      .then(() => setFavorited(f => !f))
      .catch(err => alert(err.message))
      .finally(() => setFavLoading(false));
  }

  async function handleCreateShoppingList() {
    setListFromRecipeLoading(true);
    setListFromRecipeMsg(null);
    try {
      const result = await createShoppingListFromRecipe(Number(id));
      setListFromRecipeMsg({ type: 'success', text: `"${result.title}" listesi oluşturuldu (${result.items.length} malzeme)` });
    } catch (err) {
      setListFromRecipeMsg({ type: 'error', text: err.message });
    } finally {
      setListFromRecipeLoading(false);
    }
  }

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!recipe) return null;

  if (editMode && editData) {
    return (
      <div style={{ textAlign: 'left' }}>
        <button onClick={cancelEdit} style={backBtnStyle}>← İptal</button>
        <h2 style={detailTitleStyle}>Tarifi Düzenle</h2>
        {saveError && <div className="error">{saveError}</div>}
        <form onSubmit={handleSave}>
          <section style={sectionStyle}>
            <label style={labelStyle}>Başlık</label>
            <input className="form-input" value={editData.title} onChange={e => setEditData(p => ({ ...p, title: e.target.value }))} required />
          </section>
          <section style={sectionStyle}>
            <label style={labelStyle}>Açıklama</label>
            <textarea className="form-input" value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} rows={3} style={{ resize: 'vertical' }} />
          </section>
          <section style={sectionStyle}>
            <label style={labelStyle}>Zorluk</label>
            <select className="form-input" value={editData.difficulty} onChange={e => setEditData(p => ({ ...p, difficulty: e.target.value }))}>
              <option value="kolay">Kolay</option>
              <option value="orta">Orta</option>
              <option value="zor">Zor</option>
            </select>
          </section>
          <section style={sectionStyle}>
            <label style={labelStyle}>Diyet Etiketleri</label>
            <input className="form-input" value={editData.tags} onChange={e => setEditData(p => ({ ...p, tags: e.target.value }))} placeholder="vejetaryen, vegan, glutensiz, laktozsuz, saglikli (virgülle ayır)" />
            <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['vejetaryen','vegan','glutensiz','laktozsuz','saglikli'].map(t => (
                <button key={t} type="button"
                  style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: 12, border: '1px solid #bbf7d0', background: editData.tags.split(',').map(x=>x.trim()).includes(t) ? '#bbf7d0' : '#f0fdf4', color: '#15803d', cursor: 'pointer' }}
                  onClick={() => {
                    const cur = editData.tags.split(',').map(x=>x.trim()).filter(Boolean);
                    const next = cur.includes(t) ? cur.filter(x=>x!==t) : [...cur, t];
                    setEditData(p => ({ ...p, tags: next.join(', ') }));
                  }}
                >{t}</button>
              ))}
            </div>
          </section>
          <hr style={hrStyle} />
          <section style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={sectionHeadStyle}>Hazırlanış Adımları</h3>
              <button type="button" className="btn btn-secondary" style={{ padding: '5px 14px', fontSize: '0.82rem' }} onClick={() => setEditData(p => ({ ...p, steps: [...p.steps, ''] }))}>+ Adım Ekle</button>
            </div>
            {editData.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ minWidth: 24, fontWeight: 700, color: '#7c3aed', paddingTop: 10, fontSize: '0.9rem' }}>{i + 1}.</span>
                <textarea
                  className="form-input"
                  value={step}
                  rows={2}
                  style={{ flex: 1, resize: 'vertical' }}
                  onChange={e => {
                    const updated = [...editData.steps];
                    updated[i] = e.target.value;
                    setEditData(p => ({ ...p, steps: updated }));
                  }}
                />
                <button type="button" style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1.1rem', paddingTop: 8 }} onClick={() => setEditData(p => ({ ...p, steps: p.steps.filter((_, idx) => idx !== i) }))} title="Adımı sil">✕</button>
              </div>
            ))}
          </section>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="btn btn-primary" type="submit" disabled={saveLoading}>{saveLoading ? 'Kaydediliyor...' : 'Kaydet'}</button>
            <button className="btn btn-secondary" type="button" onClick={cancelEdit}>İptal</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <button onClick={() => navigate(-1)} style={backBtnStyle}>← Geri</button>
        <div style={{ display: 'flex', gap: 8 }}>
          {isAdmin && (
            <button className="btn btn-secondary" onClick={startEdit} style={{ fontSize: '0.88rem', padding: '6px 16px' }}>✏️ Düzenle</button>
          )}
          {isLoggedIn && (
            <button onClick={handleFavorite} disabled={favLoading} className="btn" style={{ background: favorited ? '#f5f3ff' : '#f1f5f9', border: `1.5px solid ${favorited ? '#7c3aed' : '#e2e8f0'}`, color: favorited ? '#7c3aed' : '#64748b', fontWeight: 700, fontSize: '0.88rem', padding: '6px 16px' }}>
              {favorited ? '❤️ Favoride' : '🤍 Favoriye Ekle'}
            </button>
          )}
          {isLoggedIn && (
            <button onClick={handleCreateShoppingList} disabled={listFromRecipeLoading} className="btn" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#16a34a', fontWeight: 700, fontSize: '0.88rem', padding: '6px 16px' }}>
              {listFromRecipeLoading ? 'Oluşturuluyor...' : '🛒 Alışveriş Listesi Oluştur'}
            </button>
          )}
          {isLoggedIn && (
            <button
              className="btn"
              disabled={cookedLoading || hasCooked}
              style={hasCooked
                ? { background: '#f0fdf4', border: '1.5px solid #86efac', color: '#16a34a', fontWeight: 700, fontSize: '0.88rem', padding: '6px 16px', cursor: 'default' }
                : { background: '#fffbeb', border: '1.5px solid #fde68a', color: '#92400e', fontWeight: 700, fontSize: '0.88rem', padding: '6px 16px' }}
              onClick={() => {
                if (hasCooked) return;
                setCookedLoading(true);
                markRecipeCooked(Number(id))
                  .then(d => { setCookedCount(d.cookedCount); setHasCooked(true); })
                  .catch(() => {})
                  .finally(() => setCookedLoading(false));
              }}
            >
              {cookedLoading ? '...' : hasCooked ? '✓ Yapıldı' : '👨‍🍳 Yaptım'}
            </button>
          )}
          {isLoggedIn && (
            <button
              className="btn"
              disabled={wishlistLoading}
              style={inWishlist
                ? { background: '#eff6ff', border: '1.5px solid #bfdbfe', color: '#1d4ed8', fontWeight: 700, fontSize: '0.88rem', padding: '6px 16px' }
                : { background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.88rem', padding: '6px 16px' }}
              onClick={() => {
                setWishlistLoading(true);
                const action = inWishlist ? removeFromWishlist(Number(id)) : addToWishlist(Number(id));
                action
                  .then(() => setInWishlist(w => !w))
                  .catch(() => {})
                  .finally(() => setWishlistLoading(false));
              }}
            >
              {wishlistLoading ? '...' : inWishlist ? '📌 Listede' : '📌 Yapmak İstiyorum'}
            </button>
          )}
        </div>
      </div>

      {/* AI Dönüştür */}
      {isLoggedIn && (
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#7c3aed', fontWeight: 700 }}>✨ AI ile dönüştür:</span>
          {[
            { key: 'vejetaryen', label: '🥦 Vejetaryen' },
            { key: 'kolay', label: '⚡ Daha Kolay' },
            { key: 'saglikli', label: '🥗 Daha Sağlıklı' },
            { key: 'glutensiz', label: '🌾 Glutensiz' },
          ].map(({ key, label }) => (
            <button key={key} className="btn" disabled={transformLoading}
              style={{ background: '#faf5ff', border: '1.5px solid #ddd6fe', color: '#7c3aed', fontSize: '0.82rem', padding: '5px 12px', fontWeight: 600 }}
              onClick={() => {
                setTransformLoading(true); setTransformResult(null); setTransformError(null);
                aiTransformRecipe(Number(id), key)
                  .then(d => setTransformResult(d.result))
                  .catch(e => setTransformError(e.message || 'Dönüştürülemedi'))
                  .finally(() => setTransformLoading(false));
              }}
            >{transformLoading ? '⏳...' : label}</button>
          ))}
        </div>
      )}
      {transformError && <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.88rem' }}>{transformError}</div>}
      {transformResult && (
        <div style={{ marginBottom: 20, padding: '16px 18px', borderRadius: 12, background: '#faf5ff', border: '1.5px solid #ddd6fe' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ margin: 0, color: '#7c3aed', fontSize: '1rem', fontWeight: 800 }}>✨ {transformResult.title}</h3>
            <button onClick={() => setTransformResult(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          </div>
          {transformResult.note && <p style={{ margin: '0 0 10px', fontSize: '0.83rem', color: '#7c3aed', background: '#ede9fe', padding: '7px 12px', borderRadius: 7 }}>💡 {transformResult.note}</p>}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#6d28d9', marginBottom: 6 }}>Malzemeler</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {(transformResult.ingredients || []).map((ing, i) => (
                  <li key={i} style={{ fontSize: '0.87rem', color: '#334155', marginBottom: 2 }}>{ing.amount} {ing.unit} {ing.name}</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 2, minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#6d28d9', marginBottom: 6 }}>Hazırlanış</div>
              <ol style={{ margin: 0, paddingLeft: 18 }}>
                {(transformResult.steps || []).map((s, i) => (
                  <li key={i} style={{ fontSize: '0.87rem', color: '#334155', marginBottom: 4, lineHeight: 1.6 }}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
        <span className="tag">{recipe.category}</span>
        <span className="tag" style={{ color: difficultyColor[recipe.difficulty] || '#475569' }}>{recipe.difficulty}</span>
        {Array.isArray(recipe.tags) && recipe.tags.map(t => (
          <span key={t} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 12, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600 }}>{t}</span>
        ))}
        {/* Yıldız Puan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          {[1,2,3,4,5].map(star => (
            <button
              key={star}
              type="button"
              disabled={!isLoggedIn || ratingLoading}
              title={isLoggedIn ? `${star} yıldız ver` : 'Puan vermek için giriş yap'}
              onClick={() => {
                if (!isLoggedIn) return;
                setRatingLoading(true);
                rateRecipe(Number(id), star)
                  .then(d => setRatingData({ avg: d.avg, count: d.count, userRating: star }))
                  .catch(() => {})
                  .finally(() => setRatingLoading(false));
              }}
              style={{ background: 'none', border: 'none', cursor: isLoggedIn ? 'pointer' : 'default', padding: 0, fontSize: '1.25rem', lineHeight: 1, color: star <= (ratingData.userRating || 0) ? '#f59e0b' : '#cbd5e1', transition: 'color 0.15s' }}
            >★</button>
          ))}
          {ratingData.count > 0 && (
            <span style={{ fontSize: '0.82rem', color: '#64748b', marginLeft: 2 }}>{ratingData.avg} ({ratingData.count})</span>
          )}
          {!isLoggedIn && ratingData.count > 0 && (
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>★ {ratingData.avg} ({ratingData.count})</span>
          )}
        </div>
      </div>
      <p style={{ color: '#475569', margin: '0 0 20px', lineHeight: 1.65 }}>{recipe.description}</p>
      {listFromRecipeMsg && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: listFromRecipeMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${listFromRecipeMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: listFromRecipeMsg.type === 'success' ? '#16a34a' : '#dc2626', fontSize: '0.9rem', fontWeight: 600 }}>
          {listFromRecipeMsg.text}
        </div>
      )}
      <hr style={hrStyle} />

      <h3 style={sectionHeadStyle}>Malzemeler</h3>
      {/* Porsiyon Ayarı */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Porsiyon:</span>
        <button type="button" onClick={() => setServings(s => Math.max(1, s - 1))} style={{ width: 28, height: 28, borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: '#475569' }}>−</button>
        <span style={{ fontWeight: 700, color: '#0f172a', minWidth: 24, textAlign: 'center' }}>{servings}</span>
        <button type="button" onClick={() => setServings(s => Math.min(20, s + 1))} style={{ width: 28, height: 28, borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: '#475569' }}>+</button>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>kişilik (4 kişilik baz)</span>
      </div>
      {recipe.ingredients && recipe.ingredients.length > 0 ? (
        <div className="ingredients-table-wrap" style={{ marginBottom: 28 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={th}>Malzeme</th>
              <th style={th}>Miktar</th>
              <th style={th}>Birim</th>
              <th style={th}>Not</th>
            </tr>
          </thead>
          <tbody>
            {recipe.ingredients.map(ing => {
              const scale = servings / 4;
              const rawAmt = parseFloat(ing.amount);
              const scaledAmt = ing.amount && !isNaN(rawAmt)
                ? (rawAmt * scale % 1 === 0 ? rawAmt * scale : (rawAmt * scale).toFixed(1))
                : ing.amount || '—';
              return (
              <tr key={ing.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={td}><strong>{ing.name}</strong></td>
                <td style={{ ...td, textAlign: 'center', fontWeight: servings !== 4 ? 700 : 400, color: servings !== 4 ? '#7c3aed' : '#334155' }}>{scaledAmt}</td>
                <td style={{ ...td, textAlign: 'center' }}>{ing.unit || '—'}</td>
                <td style={{ ...td, color: '#94a3b8', fontSize: '0.83rem' }}>{ing.notes || ''}</td>
              </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      ) : (
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>Malzeme bilgisi girilmemiş.</p>
      )}

      <h3 style={sectionHeadStyle}>Hazırlanış</h3>
      {recipe.steps && recipe.steps.length > 0 ? (
        <ol style={{ padding: 0, margin: 0, listStyle: 'none' }}>
          {recipe.steps.map((step, idx) => (
            <li key={step.id} style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' }}>
              <span style={{ minWidth: 28, height: 28, borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0, marginTop: 1 }}>{idx + 1}</span>
              <span style={{ color: '#334155', lineHeight: 1.7, paddingTop: 3 }}>{step.instruction}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p style={{ color: '#94a3b8' }}>Hazırlanış adımları girilmemiş.</p>
      )}

      {/* Benzer Tarifler */}
      {similarRecipes.length > 0 && (
        <>
          <hr style={hrStyle} />
          <h3 style={sectionHeadStyle}>🍽 Benzer Tarifler</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 8 }}>
            {similarRecipes.map(r => (
              <div key={r.id}
                onClick={() => navigate(`/recipes/${r.id}`)}
                style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px #7c3aed22'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', background: '#ede9fe', color: '#7c3aed', borderRadius: 8, padding: '1px 7px' }}>{r.category}</span>
                  <span style={{ fontSize: '0.72rem', background: '#f0fdf4', color: difficultyColor[r.difficulty] || '#475569', borderRadius: 8, padding: '1px 7px' }}>{r.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Kişisel Not */}
      {isLoggedIn && (
        <>
          <hr style={hrStyle} />
          <h3 style={sectionHeadStyle}>📝 Notlarım</h3>
          <textarea
            className="form-input"
            rows={4}
            placeholder="Bu tarif hakkında kişisel notlarınızı buraya yazabilirsiniz..."
            value={note}
            onChange={e => { setNote(e.target.value); setNoteSaved(false); }}
            style={{ width: '100%', resize: 'vertical', fontSize: '0.9rem', marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              disabled={noteSaving}
              onClick={() => {
                setNoteSaving(true);
                saveRecipeNote(Number(id), note)
                  .then(() => setNoteSaved(true))
                  .catch(() => {})
                  .finally(() => setNoteSaving(false));
              }}
              style={{ fontSize: '0.88rem', padding: '7px 18px' }}
            >{noteSaving ? 'Kaydediliyor...' : 'Kaydet'}</button>
            {noteSaved && <span style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>✓ Kaydedildi</span>}
          </div>
        </>
      )}
    </div>
  );
}

const backBtnStyle = { background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: '0.9rem', padding: 0, fontWeight: 600 };
const detailTitleStyle = { margin: '0 0 12px', color: '#0f172a', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' };
const sectionStyle = { marginBottom: 20 };
const labelStyle = { display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: '0.88rem' };
const hrStyle = { border: 'none', borderTop: '1px solid #e8edf2', margin: '24px 0' };
const sectionHeadStyle = { color: '#0f172a', marginBottom: 14, fontSize: '1.05rem', fontWeight: 700 };
const th = { padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' };
const td = { padding: '10px 12px', fontSize: '0.92rem', color: '#334155' };
