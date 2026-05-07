import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  suggestRecipes, getFavorites, addFavorite, removeFavorite,
  aiSuggestRecipes, aiGetRecipeDetail, adminCreateRecipe,
  getShoppingLists, createShoppingList, addShoppingListItem,
} from './api.js';
import ds from './design.js';

// ── Static data ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: '',          label: 'Tüm Kategoriler', emoji: '🍽️' },
  { value: 'corba',     label: 'Çorba',           emoji: '🍲' },
  { value: 'ana-yemek', label: 'Ana Yemek',       emoji: '🥩' },
  { value: 'tatli',     label: 'Tatlı',           emoji: '🍮' },
  { value: 'ara-yemek', label: 'Ara Yemek',       emoji: '🥗' },
  { value: 'aperatif',  label: 'Aperatif',        emoji: '🫙' },
];
const DIFFICULTIES = [
  { value: '',      label: 'Her Zorluk' },
  { value: 'kolay', label: 'Kolay' },
  { value: 'orta',  label: 'Orta' },
  { value: 'zor',   label: 'Zor' },
];
const DIET_TAGS = [
  { value: '',          label: 'Tüm Diyetler' },
  { value: 'vejetaryen',label: '🥦 Vejetaryen' },
  { value: 'vegan',     label: '🌱 Vegan' },
  { value: 'glutensiz', label: '🌾 Glutensiz' },
  { value: 'laktozsuz', label: '🥛 Laktozsuz' },
  { value: 'saglikli',  label: '💚 Sağlıklı' },
];
const CAT_ACCENT = {
  // slugs (used for filter params)
  corba:        { from: '#7c3aed', to: '#a855f7', emoji: '🍲' },
  'ana-yemek':  { from: '#0ea5e9', to: '#38bdf8', emoji: '🥩' },
  tatli:        { from: '#f59e0b', to: '#fbbf24', emoji: '🍮' },
  atistirmalik: { from: '#10b981', to: '#34d399', emoji: '🥗' },
  meze:         { from: '#8b5cf6', to: '#a78bfa', emoji: '🫙' },
  salata:       { from: '#22c55e', to: '#4ade80', emoji: '🥙' },
  // display names returned by the API
  'Çorba':      { from: '#7c3aed', to: '#a855f7', emoji: '🍲' },
  'Ana Yemek':  { from: '#0ea5e9', to: '#38bdf8', emoji: '🥩' },
  'Tatlı':      { from: '#f59e0b', to: '#fbbf24', emoji: '🍮' },
  'Ara Yemek':  { from: '#10b981', to: '#34d399', emoji: '🥗' },
  'Aperatif':   { from: '#8b5cf6', to: '#a78bfa', emoji: '🫙' },
  'Salata':     { from: '#22c55e', to: '#4ade80', emoji: '🥙' },
  _default:     { from: '#94a3b8', to: '#cbd5e1', emoji: '🍽️' },
};
function getCatAccent(cat) { return CAT_ACCENT[cat] || CAT_ACCENT._default; }

const diffBadge = {
  kolay: { bg: ds.colors.successLight, color: ds.colors.success },
  orta:  { bg: ds.colors.warningLight, color: ds.colors.warning },
  zor:   { bg: ds.colors.dangerLight,  color: ds.colors.danger  },
};

// ── RecipeCard ────────────────────────────────────────────────────────────────────────────
function RecipeCard({ recipe, isFavorite, onFavorite, isLoggedIn }) {
  const diff = diffBadge[(recipe.difficulty || '').toLowerCase()] || diffBadge.orta;
  return (
    <div className="src-card">
      {isLoggedIn && (
        <button className="src-card__fav" onClick={onFavorite} aria-label={isFavorite ? 'Favoriden çıkar' : 'Favoriye ekle'}>
          {isFavorite ? '❤️' : '🤍'}
        </button>
      )}
      <Link to={`/recipes/${recipe.id}`} className="src-card__body">
        <div className="src-card__title">{recipe.title}</div>
        <p className="src-card__desc">{recipe.description}</p>
        <div className="src-card__meta">
          {recipe.difficulty && (
            <span className="src-card__badge" style={{ background: diff.bg, color: diff.color }}>
              {recipe.difficulty}
            </span>
          )}
          {recipe.matchRate != null && (
            <span className="src-card__badge" style={{
              background: recipe.matchRate >= 80 ? ds.colors.successLight : recipe.matchRate >= 50 ? ds.colors.warningLight : ds.colors.dangerLight,
              color:      recipe.matchRate >= 80 ? ds.colors.success      : recipe.matchRate >= 50 ? ds.colors.warning      : ds.colors.danger,
              marginLeft: 'auto',
            }}>
              🥘 %{recipe.matchRate}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

// ── AiRecipeCard ─────────────────────────────────────────────────────────────
function AiRecipeCard({ recipe, isOpen, onToggle, isAdmin, onSave }) {
  const diff = diffBadge[(recipe.difficulty || '').toLowerCase()] || diffBadge.orta;
  const detail = recipe._detail;
  return (
    <div className="ai-card">
      <div className="ai-card__header">
        <div style={{ flex: 1 }}>
          <div className="ai-card__name">{recipe.name}</div>
          <div className="ai-card__desc">{recipe.description}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {recipe.difficulty && (
              <span style={{ fontSize: ds.text.xs.fontSize, fontWeight: 600, borderRadius: ds.radius.sm, padding: '2px 8px', background: diff.bg, color: diff.color }}>
                {recipe.difficulty}
              </span>
            )}
            {recipe.time && (
              <span style={{ fontSize: ds.text.xs.fontSize, fontWeight: 500, background: '#e0f2fe', color: '#0369a1', borderRadius: ds.radius.sm, padding: '2px 8px' }}>
                ⏱ {recipe.time}
              </span>
            )}
          </div>
        </div>
        <button className={`btn ${isOpen ? 'btn-secondary' : 'btn-primary'}`} style={{ flexShrink: 0, fontSize: ds.text.xs.fontSize, padding: '7px 14px' }} onClick={onToggle}>
          {isOpen ? 'Kapat' : 'Tarifi Gör'}
        </button>
      </div>
      {isOpen && (
        <div className="ai-card__detail">
          {recipe._detailLoading && <div style={{ color: ds.colors.textMuted, fontSize: ds.text.sm.fontSize }}>Yükleniyor…</div>}
          {recipe._detailError && <div style={{ color: ds.colors.danger, fontSize: ds.text.sm.fontSize }}>{recipe._detailError}</div>}
          {detail && !recipe._detailLoading && (
            <>
              {Array.isArray(detail.ingredients) && detail.ingredients.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, color: ds.colors.textPrimary, fontSize: ds.text.xs.fontSize, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>Malzemeler</div>
                  {detail.ingredients.map((ing, j) => {
                    const label = typeof ing === 'object' && ing !== null ? `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim() : String(ing);
                    return <div key={j} style={{ color: ds.colors.textSecondary, fontSize: ds.text.sm.fontSize, paddingLeft: 8, lineHeight: 1.7 }}>• {label}</div>;
                  })}
                </div>
              )}
              {Array.isArray(detail.steps) && detail.steps.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, color: ds.colors.textPrimary, fontSize: ds.text.xs.fontSize, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>Hazırlanış</div>
                  {detail.steps.map((step, j) => (
                    <div key={j} style={{ color: ds.colors.textSecondary, fontSize: ds.text.sm.fontSize, lineHeight: 1.7 }}>
                      <span style={{ fontWeight: 700, color: ds.colors.accent }}>{j + 1}.</span> {step}
                    </div>
                  ))}
                </div>
              )}
              {detail.note && (
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: ds.radius.md, padding: '10px 14px', fontSize: ds.text.xs.fontSize, color: '#9a3412' }}>
                  💡 {detail.note}
                </div>
              )}
              {isAdmin && !recipe._saved && (
                <div style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select className="form-input" style={{ flex: 1, minWidth: 140, fontSize: ds.text.sm.fontSize, padding: '6px 10px' }} value={recipe._categoryId || ''} onChange={e => onSave({ type: 'setCategory', value: e.target.value })}>
                    <option value="">Kategori seç…</option>
                    <option value="1">Ana Yemek</option>
                    <option value="2">Çorba</option>
                    <option value="3">Tatlı</option>
                    <option value="16">Aperatif</option>
                    <option value="17">Ara Yemek</option>
                  </select>
                  <button
                    style={{ background: ds.colors.success, color: '#fff', border: 'none', borderRadius: ds.radius.md, padding: '7px 16px', fontSize: ds.text.sm.fontSize, cursor: recipe._saving || !recipe._categoryId ? 'not-allowed' : 'pointer', opacity: recipe._saving || !recipe._categoryId ? 0.6 : 1, fontWeight: 600 }}
                    disabled={recipe._saving || !recipe._categoryId}
                    onClick={() => onSave({ type: 'save' })}
                  >
                    {recipe._saving ? 'Kaydediliyor…' : '💾 Veritabanına Kaydet'}
                  </button>
                  {recipe._saveError && <span style={{ color: ds.colors.danger, fontSize: ds.text.xs.fontSize }}>{recipe._saveError}</span>}
                </div>
              )}
              {recipe._saved && <div style={{ marginTop: 10, color: ds.colors.success, fontSize: ds.text.sm.fontSize, fontWeight: 600 }}>✅ Kaydedildi!</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [title, setTitle]                   = useState(searchParams.get('title') || '');
  const [ingredientTags, setIngredientTags] = useState(
    (searchParams.get('ingredients') || '').split(',').map(s => s.trim()).filter(Boolean)
  );
  const [ingredientInput, setIngredientInput] = useState('');
  const [category, setCategory]       = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty]   = useState(searchParams.get('difficulty') || '');
  const [dietTag, setDietTag]         = useState(searchParams.get('tag') || '');
  const [results, setResults]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [aiRecipes, setAiRecipes]     = useState(null);
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiError, setAiError]         = useState(null);
  const [openAiIdx, setOpenAiIdx]     = useState(null);
  const [aiDetailMap, setAiDetailMap] = useState({});
  const [showListPanel, setShowListPanel]         = useState(false);
  const [listPanelLists, setListPanelLists]       = useState([]);
  const [listPanelSelected, setListPanelSelected] = useState('');
  const [listPanelNewTitle, setListPanelNewTitle] = useState('');
  const [listPanelLoading, setListPanelLoading]   = useState(false);
  const [listPanelMsg, setListPanelMsg]           = useState(null);

  const isLoggedIn      = !!localStorage.getItem('token');
  const isAdmin         = localStorage.getItem('role') === 'admin';
  const hasActiveFilter = category || difficulty || dietTag;

  // load favorites
  useEffect(() => {
    if (isLoggedIn) getFavorites().then(d => setFavoriteIds(new Set((d.favorites || []).map(f => f.id)))).catch(() => {});
  }, []);

  // auto-search from URL
  useEffect(() => {
    const hasParams = searchParams.get('title') || searchParams.get('ingredients') || searchParams.get('category') || searchParams.get('difficulty');
    if (hasParams) {
      const tags = (searchParams.get('ingredients') || '').split(',').map(s => s.trim()).filter(Boolean);
      runSearch({ t: searchParams.get('title') || '', tags, cat: searchParams.get('category') || '', diff: searchParams.get('difficulty') || '', tag: searchParams.get('tag') || '', skipAi: true });
    }
  }, []);

  // helpers
  async function toggleFavorite(e, id) {
    e.preventDefault(); e.stopPropagation();
    if (!isLoggedIn) return;
    if (favoriteIds.has(id)) { await removeFavorite(id); setFavoriteIds(p => { const s = new Set(p); s.delete(id); return s; }); }
    else { await addFavorite(id); setFavoriteIds(p => new Set([...p, id])); }
  }

  function addIngredient(val) {
    const v = (val || ingredientInput).trim();
    if (!v) return;
    setIngredientTags(p => p.includes(v) ? p : [...p, v]);
    setIngredientInput('');
  }

  function runSearch({ t, tags, cat, diff, tag, skipAi = false } = {}) {
    const useTags  = tags  ?? ingredientTags;
    const useTitle = t     ?? title;
    const useCat   = cat   ?? category;
    const useDiff  = diff  ?? difficulty;
    const useTag   = tag   ?? dietTag;
    setLoading(true); setError(null); setAiRecipes(null); setAiError(null); setOpenAiIdx(null); setAiDetailMap({});
    suggestRecipes({ ingredients: useTags, category: useCat, difficulty: useDiff, title: useTitle, tag: useTag })
      .then(d => {
        setResults(d.recipes || []);
        const p = {};
        if (useTitle) p.title = useTitle;
        if (useTags.length) p.ingredients = useTags.join(',');
        if (useCat) p.category = useCat;
        if (useDiff) p.difficulty = useDiff;
        if (useTag) p.tag = useTag;
        setSearchParams(p, { replace: true });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
    if (!skipAi && (useTags.length > 0 || useTitle.trim())) {
      setAiLoading(true);
      aiSuggestRecipes(useTags, useTitle.trim())
        .then(d => setAiRecipes(Array.isArray(d.recipes) ? d.recipes : []))
        .catch(err => setAiError(err?.message || 'AI önerisi alınamadı.'))
        .finally(() => setAiLoading(false));
    }
  }

  function handleSearch(e) {
    if (e) e.preventDefault();
    const finalTags = ingredientInput.trim() ? [...new Set([...ingredientTags, ingredientInput.trim()])] : ingredientTags;
    if (ingredientInput.trim()) { setIngredientTags(finalTags); setIngredientInput(''); }
    runSearch({ tags: finalTags });
  }

  function applyFilter(newCat, newDiff, newTag) {
    setLoading(true); setError(null);
    suggestRecipes({ ingredients: ingredientTags, category: newCat, difficulty: newDiff, title, tag: newTag })
      .then(d => setResults(d.recipes || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  function openListPanelFn() {
    setListPanelMsg(null); setListPanelSelected(''); setListPanelNewTitle(''); setShowListPanel(true);
    getShoppingLists().then(d => setListPanelLists(d.lists || [])).catch(() => setListPanelLists([]));
  }

  async function handleAddToList() {
    setListPanelLoading(true); setListPanelMsg(null);
    try {
      let listId;
      if (!listPanelSelected || listPanelSelected === '__new__') {
        const r = await createShoppingList(listPanelNewTitle.trim() || 'Arama Listem');
        listId = r.id;
      } else { listId = Number(listPanelSelected); }
      for (const name of ingredientTags) await addShoppingListItem(listId, { name });
      setListPanelMsg({ type: 'success', text: `${ingredientTags.length} malzeme eklendi!` });
      setShowListPanel(false);
    } catch (err) { setListPanelMsg({ type: 'error', text: err.message }); }
    finally { setListPanelLoading(false); }
  }

  function toggleAiRecipe(idx) {
    if (openAiIdx === idx) { setOpenAiIdx(null); return; }
    setOpenAiIdx(idx);
    const recipe = aiRecipes[idx];
    if (aiDetailMap[recipe.name]) return;
    setAiDetailMap(p => ({ ...p, [recipe.name]: { loading: true } }));
    aiGetRecipeDetail(recipe.name)
      .then(d => setAiDetailMap(p => ({ ...p, [recipe.name]: { loading: false, detail: d.detail } })))
      .catch(err => setAiDetailMap(p => ({ ...p, [recipe.name]: { loading: false, error: err?.message || 'Detay alınamadı.' } })));
  }

  function handleAiSave(idx, action) {
    const name = aiRecipes[idx].name;
    const ds2  = aiDetailMap[name] || {};
    if (action.type === 'setCategory') {
      setAiDetailMap(p => ({ ...p, [name]: { ...ds2, categoryId: action.value } }));
    } else if (action.type === 'save') {
      setAiDetailMap(p => ({ ...p, [name]: { ...ds2, saving: true, saveError: null } }));
      const r = aiRecipes[idx];
      adminCreateRecipe({ title: r.name, description: r.description || '', difficulty: (r.difficulty || 'orta').toLowerCase(), categoryId: ds2.categoryId, ingredients: ds2.detail?.ingredients || [], steps: ds2.detail?.steps || [] })
        .then(() => setAiDetailMap(p => ({ ...p, [name]: { ...p[name], saving: false, saved: true } })))
        .catch(err => setAiDetailMap(p => ({ ...p, [name]: { ...p[name], saving: false, saveError: err?.message } })));
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="search-page">

      {/* STICKY SEARCH BAR */}
      <div className="src-sticky">
        <form className="src-form" onSubmit={handleSearch}>
          <div className="src-input-wrap">
            <svg className="src-input-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="6"/><path d="M15 15l3 3" strokeLinecap="round"/>
            </svg>
            <input
              className="src-input"
              type="text"
              placeholder="Tarif adı ara…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoComplete="off"
            />
            {title && (
              <button type="button" className="src-clear" onClick={() => setTitle('')} aria-label="Temizle">✕</button>
            )}
          </div>
          <button className="btn btn-primary src-submit" type="submit" disabled={loading}>
            {loading ? '…' : 'Ara'}
          </button>
        </form>

        {/* Ingredient tag row */}
        <div className="src-tags-row">
          {ingredientTags.map((tag, i) => (
            <span key={i} className="src-tag">
              {tag}
              <button type="button" className="src-tag-x" onClick={() => setIngredientTags(p => p.filter((_, j) => j !== i))}>✕</button>
            </span>
          ))}
          <input
            className="src-tag-input"
            placeholder="+ malzeme"
            value={ingredientInput}
            onChange={e => setIngredientInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addIngredient(); } }}
            onBlur={() => { if (ingredientInput.trim()) addIngredient(); }}
          />
          {isLoggedIn && ingredientTags.length > 0 && (
            <button type="button" className="btn btn-secondary" style={{ fontSize: ds.text.xs.fontSize, padding: '4px 10px', flexShrink: 0 }} onClick={openListPanelFn}>
              🛒 Listeye Ekle
            </button>
          )}
        </div>

        {/* Shopping list panel */}
        {showListPanel && (
          <div className="src-list-panel">
            <div style={{ fontWeight: 700, color: ds.colors.success, fontSize: ds.text.sm.fontSize, marginBottom: 8 }}>Hangi listeye eklensin?</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select className="form-input" value={listPanelSelected} onChange={e => setListPanelSelected(e.target.value)} style={{ flex: 1, minWidth: 160, fontSize: ds.text.sm.fontSize }}>
                <option value="__new__">+ Yeni liste oluştur</option>
                {listPanelLists.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
              </select>
              {(!listPanelSelected || listPanelSelected === '__new__') && (
                <input className="form-input" placeholder="Liste adı (opsiyonel)" value={listPanelNewTitle} onChange={e => setListPanelNewTitle(e.target.value)} style={{ flex: 1, minWidth: 140, fontSize: ds.text.sm.fontSize }} />
              )}
              <button type="button" className="btn btn-primary" style={{ fontSize: ds.text.sm.fontSize }} disabled={listPanelLoading} onClick={handleAddToList}>
                {listPanelLoading ? '…' : 'Ekle'}
              </button>
              <button type="button" className="btn btn-secondary" style={{ fontSize: ds.text.sm.fontSize }} onClick={() => setShowListPanel(false)}>İptal</button>
            </div>
            {listPanelMsg && <div style={{ marginTop: 8, fontSize: ds.text.sm.fontSize, fontWeight: 600, color: listPanelMsg.type === 'success' ? ds.colors.success : ds.colors.danger }}>{listPanelMsg.text}</div>}
          </div>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="src-filters">
        <div className="src-filter-group">
          <span className="src-filter-label">Kategori</span>
          <div className="src-filter-pills">
            {CATEGORIES.map(c => (
              <button key={c.value} type="button"
                className={`src-filter-pill${category === c.value ? ' src-filter-pill--on' : ''}`}
                onClick={() => { setCategory(c.value); applyFilter(c.value, difficulty, dietTag); }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="src-filter-row">
          <div className="src-filter-group">
            <span className="src-filter-label">Zorluk</span>
            <div className="src-filter-pills">
              {DIFFICULTIES.map(d => (
                <button key={d.value} type="button"
                  className={`src-filter-pill${difficulty === d.value ? ' src-filter-pill--on' : ''}`}
                  onClick={() => { setDifficulty(d.value); applyFilter(category, d.value, dietTag); }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {hasActiveFilter && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: ds.text.xs.fontSize, color: ds.colors.textMuted }}>Aktif:</span>
            {category  && <span className="src-active-badge">{CATEGORIES.find(c => c.value === category)?.label}</span>}
            {difficulty && <span className="src-active-badge">{difficulty}</span>}
            {dietTag   && <span className="src-active-badge">{dietTag}</span>}
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: ds.colors.danger, fontSize: ds.text.xs.fontSize, fontWeight: 600 }}
              onClick={() => { setCategory(''); setDifficulty(''); setDietTag(''); applyFilter('', '', ''); }}>
              Temizle
            </button>
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && <div className="error" style={{ marginBottom: 16 }}>{error}</div>}

      {/* AI SUGGESTIONS */}
      {(aiLoading || aiRecipes) && (
        <div className="src-ai-block">
          <div className="src-ai-block__header">
            <span className="src-ai-badge">✨ AI</span>
            <span style={{ fontWeight: 700, color: ds.colors.textPrimary, fontSize: ds.text.md.fontSize }}>Yapay Zeka Önerileri</span>
            {aiLoading && <span style={{ fontSize: ds.text.xs.fontSize, color: ds.colors.textMuted }}>yükleniyor…</span>}
          </div>
          {aiError && <div style={{ color: ds.colors.danger, fontSize: ds.text.sm.fontSize }}>{aiError}</div>}
          {aiRecipes && aiRecipes.map((recipe, i) => {
            const dm = aiDetailMap[recipe.name] || {};
            const enriched = { ...recipe, _detail: dm.detail || null, _detailLoading: dm.loading, _detailError: dm.error, _categoryId: dm.categoryId, _saving: dm.saving, _saved: dm.saved, _saveError: dm.saveError };
            return (
              <AiRecipeCard key={i} recipe={enriched} isOpen={openAiIdx === i} onToggle={() => toggleAiRecipe(i)} isAdmin={isAdmin} onSave={a => handleAiSave(i, a)} />
            );
          })}
        </div>
      )}

      {/* RESULTS */}
      {results !== null && (
        <div>
          <div className="src-results-header">
            <span style={{ fontWeight: 700, color: ds.colors.textPrimary }}>
              {loading ? 'Aranıyor…' : `${results.length} tarif bulundu`}
            </span>
            {hasActiveFilter && !loading && <span style={{ fontSize: ds.text.xs.fontSize, color: ds.colors.textMuted }}>filtrelenmiş</span>}
          </div>
          {!loading && results.length === 0 ? (
            <div className="src-empty">
              <div className="src-empty__icon">🔍</div>
              <div className="src-empty__title">Sonuç bulunamadı</div>
              <div className="src-empty__sub">Farklı anahtar kelimeler veya filtreler deneyin</div>
            </div>
          ) : (
            <div className="src-grid">
              {results.map(r => (
                <RecipeCard key={r.id} recipe={r} isFavorite={favoriteIds.has(r.id)} isLoggedIn={isLoggedIn} onFavorite={e => toggleFavorite(e, r.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* INITIAL EMPTY STATE */}
      {results === null && !loading && (
        <div className="src-empty src-empty--initial">
          <div className="src-empty__icon">🍳</div>
          <div className="src-empty__title">Tarif aramaya başla</div>
          <div className="src-empty__sub">İsim veya malzeme yaz, filtrele, keşfet</div>
          <div className="src-empty__cats">
            {CATEGORIES.slice(1).map(c => (
              <button key={c.value} type="button" className="src-cat-btn"
                onClick={() => { setCategory(c.value); applyFilter(c.value, '', ''); }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
