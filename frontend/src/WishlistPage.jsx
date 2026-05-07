import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, removeFromWishlist, addFavorite, removeFavorite, getFavorites } from './api.js';
import ds from './design.js';

const STORAGE_KEY = 'wishlist_completed';

const diffBadge = {
  kolay: { bg: ds.colors.successLight, color: ds.colors.success },
  orta:  { bg: ds.colors.warningLight, color: ds.colors.warning },
  zor:   { bg: ds.colors.dangerLight,  color: ds.colors.danger  },
};

function CheckCircle({ done }) {
  return (
    <div className={`planner-check${done ? ' planner-check--done' : ''}`} aria-hidden="true">
      {done && (
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
          <polyline points="2,6 5,9 10,3" />
        </svg>
      )}
    </div>
  );
}

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [completedIds, setCompletedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
    catch { return new Set(); }
  });
  const [removingId, setRemovingId] = useState(null);
  const [filter, setFilter]         = useState('all'); // 'all' | 'todo' | 'done'
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    getWishlist()
      .then(data => setWishlist(data.wishlist || []))
      .catch(err => setError(err.message || 'Liste alınamadı'))
      .finally(() => setLoading(false));
    if (isLoggedIn) {
      getFavorites()
        .then(data => setFavoriteIds(new Set((data.favorites || []).map(f => f.id))))
        .catch(() => {});
    }
  }, []);

  function persistCompleted(next) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    setCompletedIds(next);
  }

  function toggleDone(id) {
    const next = new Set(completedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    persistCompleted(next);
  }

  async function handleRemove(e, recipeId) {
    e.preventDefault();
    e.stopPropagation();
    setRemovingId(recipeId);
    await removeFromWishlist(recipeId).catch(() => {});
    setWishlist(prev => prev.filter(r => r.id !== recipeId));
    const next = new Set(completedIds);
    next.delete(recipeId);
    persistCompleted(next);
    setRemovingId(null);
  }

  async function toggleFavorite(e, recipeId) {
    e.preventDefault();
    e.stopPropagation();
    if (favoriteIds.has(recipeId)) {
      await removeFavorite(recipeId);
      setFavoriteIds(prev => { const s = new Set(prev); s.delete(recipeId); return s; });
    } else {
      await addFavorite(recipeId);
      setFavoriteIds(prev => new Set([...prev, recipeId]));
    }
  }

  const todo  = wishlist.filter(r => !completedIds.has(r.id));
  const done  = wishlist.filter(r => completedIds.has(r.id));
  const shown = filter === 'todo' ? todo : filter === 'done' ? done : wishlist;
  const progress = wishlist.length > 0 ? Math.round((done.length / wishlist.length) * 100) : 0;

  return (
    <div className="planner-page">

      {/* Header */}
      <div className="planner-header">
        <div>
          <h2 className="home-title" style={{ marginBottom: 4 }}>Pişireceğim Tarifler</h2>
          <p style={{ margin: 0, fontSize: ds.text.sm.fontSize, color: ds.colors.textMuted }}>
            {wishlist.length === 0 ? 'Listene tarif ekle, pişirince işaretle.' : `${done.length} / ${wishlist.length} tamamlandı`}
          </p>
        </div>
        {wishlist.length > 0 && (
          <div className="planner-progress-wrap">
            <div className="planner-progress-bar">
              <div className="planner-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="planner-progress-pct">{progress}%</span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      {wishlist.length > 0 && (
        <div className="planner-tabs">
          {[
            { key: 'all',  label: `Tümü (${wishlist.length})` },
            { key: 'todo', label: `Bekliyor (${todo.length})` },
            { key: 'done', label: `Tamamlandı (${done.length})` },
          ].map(t => (
            <button
              key={t.key}
              className={`planner-tab${filter === t.key ? ' planner-tab--active' : ''}`}
              onClick={() => setFilter(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {loading && <div className="loading">Yükleniyor…</div>}
      {error   && <div className="error">{error}</div>}

      {/* Empty state */}
      {!loading && !error && wishlist.length === 0 && (
        <div className="planner-empty">
          <div className="planner-empty__art">
            <div className="planner-empty__plate">🍽️</div>
            <div className="planner-empty__sparkles">
              <span>✨</span><span>⭐</span><span>✨</span>
            </div>
          </div>
          <h3 className="planner-empty__title">Listeni oluşturmaya başla</h3>
          <p className="planner-empty__sub">
            Tarif sayfalarında <strong>"📌 Yapmak İstiyorum"</strong> butonuna bas,<br />
            buraya eklensin, pişirince işaretle.
          </p>
          <button className="btn btn-primary" style={{ fontSize: ds.text.base.fontSize, padding: '10px 24px' }} onClick={() => navigate('/search')}>
            Tarif Keşfet
          </button>
        </div>
      )}

      {/* Done-all celebration */}
      {!loading && wishlist.length > 0 && done.length === wishlist.length && (
        <div className="planner-all-done">
          <span style={{ fontSize: '1.6rem' }}>🎉</span>
          <span>Listedeki tüm tarifleri pişirdin!</span>
          <button
            className="btn btn-secondary"
            style={{ fontSize: ds.text.xs.fontSize, padding: '5px 14px' }}
            onClick={() => persistCompleted(new Set())}
          >
            Sıfırla
          </button>
        </div>
      )}

      {/* Recipe list */}
      {!loading && !error && shown.length > 0 && (
        <div className="planner-list">
          {shown.map(item => {
            const isDone   = completedIds.has(item.id);
            const diff     = diffBadge[(item.difficulty || '').toLowerCase()] || diffBadge.orta;
            const removing = removingId === item.id;
            return (
              <div
                key={item.id}
                className={`planner-card${isDone ? ' planner-card--done' : ''}${removing ? ' planner-card--removing' : ''}`}
              >
                {/* Checkbox */}
                <button
                  className="planner-check-btn"
                  onClick={() => toggleDone(item.id)}
                  aria-label={isDone ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
                  title={isDone ? 'Geri al' : 'Pişirdim ✓'}
                >
                  <CheckCircle done={isDone} />
                </button>

                {/* Recipe info — navigates to detail */}
                <Link to={`/recipes/${item.id}`} className="planner-card__body">
                  <div className="planner-card__title">{item.title}</div>
                  <div className="planner-card__desc">{item.description}</div>
                  <div className="planner-card__meta">
                    {item.difficulty && (
                      <span className="planner-card__badge" style={{ background: diff.bg, color: diff.color }}>
                        {item.difficulty}
                      </span>
                    )}
                    {item.category && (
                      <span className="planner-card__badge planner-card__badge--muted">{item.category}</span>
                    )}
                    {item.addedAt && (
                      <span className="planner-card__date">
                        {new Date(item.addedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Actions */}
                <div className="planner-card__actions">
                  {isLoggedIn && (
                    <button
                      className="planner-action-btn"
                      onClick={e => toggleFavorite(e, item.id)}
                      title={favoriteIds.has(item.id) ? 'Favoriden çıkar' : 'Favoriye ekle'}
                    >
                      {favoriteIds.has(item.id) ? '❤️' : '🤍'}
                    </button>
                  )}
                  <button
                    className="planner-action-btn planner-action-btn--remove"
                    onClick={e => handleRemove(e, item.id)}
                    title="Listeden çıkar"
                    disabled={removing}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter empty state */}
      {!loading && !error && wishlist.length > 0 && shown.length === 0 && (
        <div className="planner-filter-empty">
          {filter === 'done'
            ? <><span>📋</span> Henüz tamamlanan tarif yok.</>
            : <><span>✅</span> Tüm tarifler tamamlandı!</>}
        </div>
      )}

    </div>
  );
}
