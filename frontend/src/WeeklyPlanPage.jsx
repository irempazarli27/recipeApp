import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWeeklyPlan, setWeeklyPlanDay, clearWeeklyPlanDay, aiWeeklyPlan } from './api.js';
import ds from './design.js';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const DAYS_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

// Today: JS getDay() returns 0=Sun, 1=Mon … so Mon=0 in our array
function todayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1; // 0=Mon … 6=Sun
}

const CAT_COLOR = {
  'Ana Yemek':  { bg: '#e0f2fe', color: '#0369a1' },
  'Çorba':      { bg: '#ede9fe', color: '#7c3aed' },
  'Tatlı':      { bg: '#fef9c3', color: '#854d0e' },
  'Aperatif':   { bg: '#dcfce7', color: '#15803d' },
  'Ara Yemek':  { bg: '#ffedd5', color: '#c2410c' },
  'Salata':     { bg: '#d1fae5', color: '#065f46' },
};
const diffBadge = {
  kolay: { bg: ds.colors.successLight, color: ds.colors.success },
  orta:  { bg: ds.colors.warningLight, color: ds.colors.warning },
  zor:   { bg: ds.colors.dangerLight,  color: ds.colors.danger  },
};

// ── Picker Modal ─────────────────────────────────────────────────────────────
function RecipePicker({ dayIdx, onClose, onSelect, saving }) {
  const [tab, setTab]                       = useState('search');
  const [search, setSearch]                 = useState('');
  const [results, setResults]               = useState([]);
  const [searchLoading, setSearchLoading]   = useState(false);
  const [aiState, setAiState]               = useState(null); // null | {loading} | {recipe, reason} | {error}

  async function doSearch(q) {
    setSearch(q);
    if (!q.trim()) { setResults([]); return; }
    setSearchLoading(true);
    try {
      const d = await fetch(`/api/recipes?${new URLSearchParams({ title: q, limit: 10 })}`).then(r => r.json());
      setResults(d.recipes || []);
    } catch (_) {}
    finally { setSearchLoading(false); }
  }

  async function fetchAi() {
    setAiState({ loading: true });
    try {
      const d = await aiWeeklyPlan();
      const item = (d.days || []).find(x => x.day === dayIdx);
      setAiState(item?.recipe ? { recipe: item.recipe, reason: item.reason || '' } : { recipe: null });
    } catch (e) {
      setAiState({ error: e.message || 'AI önerisi alınamadı' });
    }
  }

  function switchToAi() {
    setTab('ai');
    if (!aiState) fetchAi();
  }

  return (
    <div className="wp-modal-overlay" onClick={onClose}>
      <div className="wp-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="wp-modal__header">
          <div>
            <div className="wp-modal__day">{DAYS[dayIdx]}</div>
            <div className="wp-modal__sub">için tarif seç</div>
          </div>
          <button className="wp-modal__close" onClick={onClose} aria-label="Kapat">✕</button>
        </div>

        {/* Tabs */}
        <div className="wp-modal__tabs">
          <button className={`wp-modal__tab${tab === 'search' ? ' wp-modal__tab--on' : ''}`} onClick={() => setTab('search')}>🔍 Ara</button>
          <button className={`wp-modal__tab${tab === 'ai' ? ' wp-modal__tab--on' : ''}`} onClick={switchToAi}>✨ AI Öner</button>
        </div>

        {/* Search tab */}
        {tab === 'search' && (
          <div>
            <input
              className="form-input"
              placeholder="Tarif adı ara…"
              value={search}
              autoFocus
              onChange={e => doSearch(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            {searchLoading && <div className="wp-modal__hint">Aranıyor…</div>}
            {!search.trim() && !searchLoading && <div className="wp-modal__hint">Aramak istediğiniz tarifi yazın</div>}
            <div className="wp-picker-list">
              {results.map(r => {
                const cat  = CAT_COLOR[r.category] || { bg: '#f1f5f9', color: '#475569' };
                const diff = diffBadge[(r.difficulty || '').toLowerCase()] || diffBadge.orta;
                return (
                  <button key={r.id} className="wp-picker-item" disabled={saving} onClick={() => onSelect(r)}>
                    <div className="wp-picker-item__title">{r.title}</div>
                    <div className="wp-picker-item__badges">
                      {r.category  && <span className="wp-badge" style={{ background: cat.bg,  color: cat.color  }}>{r.category}</span>}
                      {r.difficulty && <span className="wp-badge" style={{ background: diff.bg, color: diff.color }}>{r.difficulty}</span>}
                    </div>
                  </button>
                );
              })}
              {search.trim() && !searchLoading && results.length === 0 && (
                <div className="wp-modal__hint" style={{ textAlign: 'center', padding: '20px 0' }}>Sonuç bulunamadı</div>
              )}
            </div>
          </div>
        )}

        {/* AI tab */}
        {tab === 'ai' && (
          <div>
            {!aiState && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <button className="btn btn-primary" onClick={fetchAi} style={{ fontSize: ds.text.sm.fontSize }}>✨ Öneri Al</button>
              </div>
            )}
            {aiState?.loading && <div className="wp-modal__hint" style={{ textAlign: 'center', padding: '32px 0' }}>⏳ AI öneri hazırlıyor…</div>}
            {aiState?.error  && <div className="error" style={{ marginTop: 8 }}>{aiState.error}</div>}
            {aiState && !aiState.loading && !aiState.error && aiState.recipe && (
              <div>
                {aiState.reason && (
                  <div className="wp-ai-reason">💡 {aiState.reason}</div>
                )}
                <button className="wp-picker-item wp-picker-item--ai" disabled={saving} onClick={() => onSelect(aiState.recipe)}>
                  <div className="wp-picker-item__title">{aiState.recipe.title}</div>
                  <div className="wp-picker-item__badges">
                    {aiState.recipe.category  && <span className="wp-badge" style={{ background: (CAT_COLOR[aiState.recipe.category] || {}).bg || '#f1f5f9', color: (CAT_COLOR[aiState.recipe.category] || {}).color || '#475569' }}>{aiState.recipe.category}</span>}
                    {aiState.recipe.difficulty && <span className="wp-badge" style={{ background: (diffBadge[(aiState.recipe.difficulty || '').toLowerCase()] || diffBadge.orta).bg, color: (diffBadge[(aiState.recipe.difficulty || '').toLowerCase()] || diffBadge.orta).color }}>{aiState.recipe.difficulty}</span>}
                  </div>
                  <div style={{ fontSize: ds.text.xs.fontSize, color: ds.colors.textMuted, marginTop: 4 }}>Seçmek için tıklayın</div>
                </button>
                <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8, fontSize: ds.text.xs.fontSize }} onClick={fetchAi}>🔄 Farklı Öneri Al</button>
              </div>
            )}
            {aiState && !aiState.loading && !aiState.error && !aiState.recipe && (
              <div className="wp-modal__hint" style={{ textAlign: 'center', padding: '20px 0' }}>Öneri bulunamadı</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Day card ─────────────────────────────────────────────────────────────────
function DayCard({ dayData, isToday, onPick, onRemove, onNavigate }) {
  const { day, name, recipe, aiReason } = dayData;
  const cat  = recipe ? (CAT_COLOR[recipe.category] || { bg: '#f1f5f9', color: '#475569' }) : null;
  const diff = recipe ? (diffBadge[(recipe.difficulty || '').toLowerCase()] || diffBadge.orta) : null;

  return (
    <div className={`wp-day-card${isToday ? ' wp-day-card--today' : ''}${recipe ? ' wp-day-card--filled' : ''}`}>
      {/* Day header */}
      <div className="wp-day-card__head">
        <div className="wp-day-card__name">{name}</div>
        {isToday && <span className="wp-day-card__today-chip">Bugün</span>}
      </div>

      {/* Content */}
      {recipe ? (
        <div className="wp-day-card__recipe">
          <button className="wp-day-card__recipe-title" onClick={() => onNavigate(recipe.id)}>
            {recipe.title}
          </button>
          <div className="wp-day-card__badges">
            {recipe.category  && <span className="wp-badge" style={{ background: cat.bg,  color: cat.color  }}>{recipe.category}</span>}
            {recipe.difficulty && <span className="wp-badge" style={{ background: diff.bg, color: diff.color }}>{recipe.difficulty}</span>}
          </div>
          {aiReason && <div className="wp-day-card__ai-reason">✨ {aiReason}</div>}
          <div className="wp-day-card__actions">
            <button className="wp-day-card__action-btn" onClick={() => onPick(day)}>Değiştir</button>
            <button className="wp-day-card__action-btn wp-day-card__action-btn--remove" onClick={() => onRemove(day)}>Kaldır</button>
          </div>
        </div>
      ) : (
        <div className="wp-day-card__empty">
          <button className="wp-day-card__add-btn" onClick={() => onPick(day)}>
            <span className="wp-day-card__add-icon">+</span>
            <span>Tarif Ekle</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function WeeklyPlanPage() {
  const navigate   = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const today      = todayIndex();

  const [plan, setPlan]           = useState(DAYS.map((name, i) => ({ day: i, name, recipe: null })));
  const [loading, setLoading]     = useState(true);
  const [pickingDay, setPickingDay] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError]     = useState(null);
  const [aiTheme, setAiTheme]     = useState(null); // haftalık tema

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    getWeeklyPlan()
      .then(d => setPlan(d.plan || DAYS.map((name, i) => ({ day: i, name, recipe: null }))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function selectRecipe(recipe) {
    setSaving(true);
    try {
      await setWeeklyPlanDay(pickingDay, recipe.id);
      setPlan(p => p.map(d => d.day === pickingDay ? { ...d, recipe } : d));
      setPickingDay(null);
    } catch (_) {}
    finally { setSaving(false); }
  }

  async function removeDay(day) {
    try {
      await clearWeeklyPlanDay(day);
      setPlan(p => p.map(d => d.day === day ? { ...d, recipe: null, aiReason: null } : d));
    } catch (_) {}
  }

  async function handleAiFillAll() {
    setAiLoading(true);
    setAiError(null);
    try {
      const d = await aiWeeklyPlan();
      if (d.theme) setAiTheme(d.theme);
      const newPlan = [...plan];
      for (const item of (d.days || [])) {
        if (item.recipe && typeof item.day === 'number' && !newPlan[item.day]?.recipe) {
          await setWeeklyPlanDay(item.day, item.recipe.id);
          newPlan[item.day] = { ...newPlan[item.day], recipe: item.recipe, aiReason: item.reason };
        }
      }
      setPlan([...newPlan]);
    } catch (e) {
      setAiError(e.message || 'AI önerisi alınamadı');
    } finally {
      setAiLoading(false);
    }
  }

  const filled = plan.filter(d => d.recipe).length;
  const pct    = Math.round((filled / 7) * 100);

  if (!isLoggedIn) {
    return (
      <div className="wp-login-prompt">
        <div className="wp-login-prompt__icon">📅</div>
        <div className="wp-login-prompt__title">Haftalık planı görmek için giriş yapın</div>
      </div>
    );
  }

  if (loading) return <div className="loading">Yükleniyor…</div>;

  return (
    <div className="wp-page">

      {/* ── Page header ─────────────────────────── */}
      <div className="wp-header">
        <div className="wp-header__left">
          <h2 className="home-title" style={{ marginBottom: 2 }}>Haftalık Menü</h2>
          <p style={{ margin: 0, fontSize: ds.text.sm.fontSize, color: ds.colors.textMuted }}>
            {filled === 0
              ? 'Her güne bir tarif planlayın'
              : filled === 7
              ? '🎉 Haftalık menü tamamlandı!'
              : `${filled} / 7 gün planlandı`}
          </p>
        </div>
        <div className="wp-header__right">
          {/* Progress ring / bar */}
          <div className="wp-progress">
            <div className="wp-progress__bar">
              <div className="wp-progress__fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="wp-progress__label">{pct}%</span>
          </div>
          <button
            className="btn btn-primary"
            style={{ fontSize: ds.text.xs.fontSize, padding: '7px 14px', opacity: aiLoading ? 0.7 : 1 }}
            disabled={aiLoading}
            onClick={handleAiFillAll}
          >
            {aiLoading ? '⏳ Öneriliyor…' : '✨ AI ile Doldur'}
          </button>
        </div>
      </div>

      {aiError && <div className="error" style={{ marginBottom: 16 }}>{aiError}</div>}

      {/* ── AI Tema Banner ───────────────────────── */}
      {aiTheme && (
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: 12, padding: '12px 18px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 4px 16px rgba(124,58,237,0.2)',
        }}>
          <span style={{ fontSize: '1.3rem' }}>✨</span>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Bu haftanın teması</div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{aiTheme}</div>
          </div>
        </div>
      )}

      {/* ── Weekday header strip ─────────────────── */}
      <div className="wp-day-strip">
        {DAYS_SHORT.map((d, i) => (
          <div key={i} className={`wp-day-strip__cell${i === today ? ' wp-day-strip__cell--today' : ''}`}>
            {d}
          </div>
        ))}
      </div>

      {/* ── 7-day grid ──────────────────────────── */}
      <div className="wp-grid">
        {plan.map(dayData => (
          <DayCard
            key={dayData.day}
            dayData={dayData}
            isToday={dayData.day === today}
            onPick={setPickingDay}
            onRemove={removeDay}
            onNavigate={id => navigate(`/recipes/${id}`)}
          />
        ))}
      </div>

      {/* ── Week summary row ─────────────────────── */}
      {filled > 0 && (
        <div className="wp-summary">
          <div className="wp-summary__title">Bu hafta</div>
          <div className="wp-summary__chips">
            {plan.filter(d => d.recipe).map(d => (
              <button
                key={d.day}
                className="wp-summary__chip"
                onClick={() => navigate(`/recipes/${d.recipe.id}`)}
                title={d.recipe.title}
              >
                <span className="wp-summary__chip-day">{DAYS_SHORT[d.day]}</span>
                <span className="wp-summary__chip-name">{d.recipe.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Picker modal ─────────────────────────── */}
      {pickingDay !== null && (
        <RecipePicker
          dayIdx={pickingDay}
          onClose={() => setPickingDay(null)}
          onSelect={selectRecipe}
          saving={saving}
        />
      )}

    </div>
  );
}
