import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from './api.js';
import ds from './design.js';

// Generates a unique muted color per recipe id
function getThumbStyle(id) {
  const hue = ((id || 0) * 47 + 180) % 360;
  return {
    background: `hsl(${hue}, 30%, 30%)`,
    letterColor: `hsl(${hue}, 50%, 80%)`,
  };
}

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

function RecipeCard({ recipe, onRemove, removing }) {
  const cat  = CAT_COLOR[recipe.category]  || { bg: '#f1f5f9', color: '#475569' };
  const diff = DIFF_COLOR[(recipe.difficulty || '').toLowerCase()] || DIFF_COLOR.orta;

  return (
    <div className={`fav-card${removing ? ' fav-card--removing' : ''}`}>
      {/* Remove */}
      <button
        className="fav-card__remove"
        onClick={e => { e.preventDefault(); onRemove(recipe.id); }}
        disabled={removing}
        aria-label="Favoriden çıkar"
        title="Favoriden çıkar"
      >
        ❤️
      </button>

      {/* Body */}
      <div className="fav-card__body">
        <Link to={`/recipes/${recipe.id}`} className="fav-card__title">{recipe.title}</Link>
        {recipe.description && (
          <p className="fav-card__desc">{recipe.description}</p>
        )}
        <div className="fav-card__badges">
          {recipe.category  && <span className="fav-badge" style={{ background: cat.bg,  color: cat.color  }}>{recipe.category}</span>}
          {recipe.difficulty && <span className="fav-badge" style={{ background: diff.bg, color: diff.color }}>{recipe.difficulty}</span>}
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    getFavorites()
      .then(data => setFavorites(data.favorites || []))
      .catch(err => setError(err.message || 'Bir hata oluştu'))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(recipeId) {
    setRemovingId(recipeId);
    try {
      await removeFavorite(recipeId);
      setFavorites(prev => prev.filter(r => r.id !== recipeId));
    } catch (_) {}
    finally { setRemovingId(null); }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="home-title page-header__title">Favori Tariflerim</h2>
          <p className="page-header__sub">
            {loading ? '' : favorites.length === 0 ? 'Henüz favori yok' : `${favorites.length} tarif kaydedildi`}
          </p>
        </div>
      </div>

      {loading && <div className="loading">Yükleniyor…</div>}
      {error   && <div className="error">{error}</div>}

      {!loading && !error && favorites.length === 0 && (
        <div className="fav-empty">
          <div className="fav-empty__art">💙</div>
          <div className="fav-empty__title">Henüz favori tarif yok</div>
          <div className="fav-empty__sub">Beğendiğiniz tarifleri favorilere ekleyin, burada kolayca bulun</div>
          <Link to="/search" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-block' }}>
            Tarifleri Keşfet
          </Link>
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="recipe-grid">
          {favorites.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onRemove={handleRemove}
              removing={removingId === recipe.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
