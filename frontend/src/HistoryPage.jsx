import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHistory, getFavorites, addFavorite, removeFavorite } from './api.js';
import ds from './design.js';

// ── Helpers ───────────────────────────────────────────────────────────────────
const CAT_COLOR = {
  'Ana Yemek': { bg: '#e0f2fe', color: '#0369a1' },
  'Çorba':     { bg: '#ede9fe', color: '#7c3aed' },
  'Tatlı':     { bg: '#fef9c3', color: '#854d0e' },
  'Aperatif':  { bg: '#dcfce7', color: '#15803d' },
  'Ara Yemek': { bg: '#ffedd5', color: '#c2410c' },
  'Salata':    { bg: '#d1fae5', color: '#065f46' },
};
const DIFF_COLOR = {
  kolay: { bg: '#dcfce7', color: '#15803d' },
  orta:  { bg: '#fef9c3', color: '#854d0e' },
  zor:   { bg: '#fee2e2', color: '#b91c1c' },
};

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Bugün';
  if (d.toDateString() === yesterday.toDateString()) return 'Dün';
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

function groupByDate(items) {
  const map = new Map();
  for (const item of items) {
    const key = new Date(item.lastViewedAt).toDateString();
    if (!map.has(key)) map.set(key, { label: formatDateLabel(item.lastViewedAt), items: [] });
    map.get(key).items.push(item);
  }
  return [...map.values()];
}

// ── History card ───────────────────────────────────────────────────────────────
function HistoryCard({ item, isFav, onToggleFav, onCookAgain, isLoggedIn }) {
  const cat  = CAT_COLOR[item.category]  || { bg: '#f1f5f9', color: '#475569' };
  const diff = DIFF_COLOR[(item.difficulty || '').toLowerCase()] || DIFF_COLOR.orta;

  return (
    <div className="hist-card">
      {/* Dot on timeline */}
      <div className="hist-card__dot" />

      <div className="hist-card__inner">
        {/* Time stamp */}
        <div className="hist-card__time">{formatTime(item.lastViewedAt)}</div>

        {/* Main content */}
        <div className="hist-card__body">
          <div className="hist-card__top">
            <div style={{ flex: 1, minWidth: 0 }}>
              <Link to={`/recipes/${item.id}`} className="hist-card__title">{item.title}</Link>
              {item.description && (
                <p className="hist-card__desc">{item.description}</p>
              )}
              <div className="hist-card__badges">
                {item.category  && <span className="hist-badge" style={{ background: cat.bg,  color: cat.color  }}>{item.category}</span>}
                {item.difficulty && <span className="hist-badge" style={{ background: diff.bg, color: diff.color }}>{item.difficulty}</span>}
                {item.viewCount > 1 && (
                  <span className="hist-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>👁 {item.viewCount}x görüntülendi</span>
                )}
                {item.cookedCount > 0 && (
                  <span className="hist-badge" style={{ background: '#fef9c3', color: '#854d0e' }}>👨‍🍳 {item.cookedCount}x yapıldı</span>
                )}
              </div>
            </div>

            {/* Fav button */}
            {isLoggedIn && (
              <button
                className={`hist-fav-btn${isFav ? ' hist-fav-btn--on' : ''}`}
                onClick={e => onToggleFav(e, item.id)}
                aria-label={isFav ? 'Favoriden çıkar' : 'Favoriye ekle'}
              >
                {isFav ? '❤️' : '🤍'}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="hist-card__actions">
            <button className="hist-action-btn hist-action-btn--primary" onClick={() => onCookAgain(item.id)}>
              👨‍🍳 Tekrar Pişir
            </button>
            <Link to={`/recipes/${item.id}`} className="hist-action-btn">
              Tarife Git →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const navigate   = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const [history, setHistory]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    getHistory()
      .then(data => setHistory(data.history || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
    if (isLoggedIn) {
      getFavorites()
        .then(data => setFavoriteIds(new Set((data.favorites || []).map(f => f.id))))
        .catch(() => {});
    }
  }, []);

  async function toggleFavorite(e, recipeId) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) return;
    if (favoriteIds.has(recipeId)) {
      await removeFavorite(recipeId);
      setFavoriteIds(prev => { const s = new Set(prev); s.delete(recipeId); return s; });
    } else {
      await addFavorite(recipeId);
      setFavoriteIds(prev => new Set([...prev, recipeId]));
    }
  }

  function handleCookAgain(recipeId) {
    navigate(`/recipes/${recipeId}`);
  }

  const groups = groupByDate(history);

  return (
    <div className="hist-page">
      {/* Header */}
      <div className="hist-header">
        <div>
          <h2 className="home-title" style={{ marginBottom: 2 }}>Geçmişim</h2>
          <p style={{ margin: 0, fontSize: ds.text.sm.fontSize, color: ds.colors.textMuted }}>
            {loading ? '' : history.length === 0 ? 'Henüz tarif görüntülemediniz' : `${history.length} tarif görüntülendi`}
          </p>
        </div>
      </div>

      {loading && <div className="loading">Yükleniyor…</div>}
      {error   && <div className="error">{error}</div>}

      {!loading && !error && history.length === 0 && (
        <div className="hist-empty">
          <div className="hist-empty__art">🍽️</div>
          <div className="hist-empty__title">Henüz tarif görüntülemediniz</div>
          <div className="hist-empty__sub">Keşfetmeye başlayın, geçmişiniz burada görünecek</div>
          <Link to="/search" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>
            Tariflere Göz At
          </Link>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="hist-timeline">
          {groups.map((group, gi) => (
            <div key={gi} className="hist-group">
              {/* Date label */}
              <div className="hist-group__label">
                <span className="hist-group__chip">{group.label}</span>
                <div className="hist-group__line" />
              </div>

              {/* Cards */}
              <div className="hist-group__cards">
                {group.items.map(item => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    isFav={favoriteIds.has(item.id)}
                    onToggleFav={toggleFavorite}
                    onCookAgain={handleCookAgain}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
