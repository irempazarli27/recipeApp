import React, { useEffect, useState } from 'react';
import {
  getShoppingLists, createShoppingList, deleteShoppingList,
  getShoppingListDetail, addShoppingListItem, deleteShoppingListItem
} from './api.js';
import ds from './design.js';

// ── Category definitions ───────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'sebze',   label: 'Sebzeler',       emoji: '🥦', color: '#15803d', bg: '#dcfce7' },
  { key: 'meyve',   label: 'Meyveler',        emoji: '🍎', color: '#b45309', bg: '#fef3c7' },
  { key: 'et',      label: 'Et & Balık',      emoji: '🥩', color: '#b91c1c', bg: '#fee2e2' },
  { key: 'sut',     label: 'Süt Ürünleri',    emoji: '🥛', color: '#0369a1', bg: '#e0f2fe' },
  { key: 'tahil',   label: 'Tahıllar & Ekmek',emoji: '🌾', color: '#92400e', bg: '#fef9c3' },
  { key: 'baharat', label: 'Baharat & Sos',   emoji: '🫙', color: '#7c3aed', bg: '#ede9fe' },
  { key: 'yag',     label: 'Yağlar',          emoji: '🫒', color: '#065f46', bg: '#d1fae5' },
  { key: 'diger',   label: 'Diğer',           emoji: '🛒', color: '#475569', bg: '#f1f5f9' },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

// keyword → category key
const KEYWORDS = {
  baharat: ['tuz','karabiber','pul biber','köri','zerdeçal','kekik','nane','fesleğen','tarçın','zencefil','kimyon','kişniş','salça','sos','hardal','ketçap','sirke','bahar','baharat'],
  sebze:   ['domates','salatalık','sivri biber','dolmalık biber','kapya biber','yeşil biber','kırmızı biber','soğan','sarımsak','patates','havuç','ıspanak','marul','brokoli','karnabahar','kabak','patlıcan','mantar','kereviz','bezelye','fasulye','bamya','lahana','enginar','kuşkonmaz','biber'],
  meyve:   ['elma','armut','muz','portakal','limon','çilek','üzüm','şeftali','kavun','karpuz','ananas','kiraz','erik','kayısı','nar'],
  et:      ['et','kıyma','tavuk','balık','sosis','sucuk','pastırma','hindi','kuzu','dana','levrek','somon','ton','karides','kalamar'],
  sut:     ['süt','yoğurt','peynir','tereyağ','krema','kaymak','ayran','lor','kefir','labne'],
  tahil:   ['ekmek','un','pirinç','makarna','bulgur','yulaf','mısır','nişasta','irmik','şehriye','erişte'],
  yag:     ['yağ','zeytinyağı','ayçiçek','tereyağ','margarin'],
};

function detectCategory(name) {
  const lower = (name || '').toLowerCase();
  for (const [key, words] of Object.entries(KEYWORDS)) {
    if (words.some(w => lower.includes(w))) return key;
  }
  return 'diger';
}

// ── localStorage helpers ───────────────────────────────────────────────────────
function storageKey(listId, suffix) { return `sl_${listId}_${suffix}`; }

function loadSet(listId, suffix) {
  try { return new Set(JSON.parse(localStorage.getItem(storageKey(listId, suffix)) || '[]')); }
  catch { return new Set(); }
}
function saveSet(listId, suffix, set) {
  localStorage.setItem(storageKey(listId, suffix), JSON.stringify([...set]));
}
function loadCats(listId) {
  try { return JSON.parse(localStorage.getItem(storageKey(listId, 'cats')) || '{}'); }
  catch { return {}; }
}
function saveCats(listId, map) {
  localStorage.setItem(storageKey(listId, 'cats'), JSON.stringify(map));
}

function groupItems(items, catMap) {
  const groups = {};
  for (const item of items) {
    const key = catMap[item.id] || detectCategory(item.name);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  // Return in CATEGORIES order (only non-empty)
  return CATEGORIES.map(cat => ({ ...cat, items: groups[cat.key] || [] })).filter(g => g.items.length > 0);
}

// ── Checkbox ───────────────────────────────────────────────────────────────────
function Checkbox({ checked, onChange }) {
  return (
    <button
      className={`sl-check${checked ? ' sl-check--on' : ''}`}
      onClick={onChange}
      aria-label={checked ? 'İşareti kaldır' : 'Tamamlandı olarak işaretle'}
    >
      {checked && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

// ── Detail view ────────────────────────────────────────────────────────────────
function ListDetail({ listId, onBack }) {
  const [detail, setDetail]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [checked, setChecked]       = useState(() => loadSet(listId, 'checked'));
  const [catMap, setCatMap]         = useState(() => loadCats(listId));
  const [newItem, setNewItem]       = useState({ name: '', amount: '', unit: '', cat: '' });
  const [adding, setAdding]         = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getShoppingListDetail(listId)
      .then(data => setDetail(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [listId]);

  function toggleCheck(itemId) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      saveSet(listId, 'checked', next);
      return next;
    });
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    setAdding(true);
    try {
      const item = await addShoppingListItem(listId, { name: newItem.name, amount: newItem.amount, unit: newItem.unit });
      const catKey = newItem.cat || detectCategory(newItem.name);
      const nextCatMap = { ...catMap, [item.id]: catKey };
      setCatMap(nextCatMap);
      saveCats(listId, nextCatMap);
      setDetail(prev => ({ ...prev, items: [...prev.items, item] }));
      setNewItem({ name: '', amount: '', unit: '', cat: '' });
    } catch (err) { setError(err.message); }
    finally { setAdding(false); }
  }

  async function handleDelete(itemId) {
    setDeletingId(itemId);
    try {
      await deleteShoppingListItem(listId, itemId);
      setDetail(prev => ({ ...prev, items: prev.items.filter(i => i.id !== itemId) }));
      setChecked(prev => { const next = new Set(prev); next.delete(itemId); saveSet(listId, 'checked', next); return next; });
      const nextCatMap = { ...catMap }; delete nextCatMap[itemId]; setCatMap(nextCatMap); saveCats(listId, nextCatMap);
    } catch (err) { setError(err.message); }
    finally { setDeletingId(null); }
  }

  function clearChecked() {
    setChecked(new Set());
    saveSet(listId, 'checked', new Set());
  }

  if (loading) return <div className="loading">Yükleniyor…</div>;
  if (!detail) return null;

  const items    = detail.items || [];
  const total    = items.length;
  const done     = items.filter(i => checked.has(i.id)).length;
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
  const groups   = groupItems(items, catMap);
  const allDone  = total > 0 && done === total;

  return (
    <div className="sl-detail">
      {/* Back + title */}
      <div className="sl-detail__header">
        <button className="sl-back-btn" onClick={onBack}>← Listeler</button>
        <h2 className="home-title" style={{ marginBottom: 0 }}>{detail.title}</h2>
      </div>

      {error && <div className="error">{error}</div>}

      {/* Progress bar */}
      {total > 0 && (
        <div className="sl-progress-row">
          <div className="sl-progress">
            <div className="sl-progress__bar">
              <div className={`sl-progress__fill${allDone ? ' sl-progress__fill--done' : ''}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="sl-progress__label">{done}/{total}</span>
          </div>
          {done > 0 && (
            <button className="sl-clear-btn" onClick={clearChecked}>İşaretleri Sıfırla</button>
          )}
        </div>
      )}

      {/* All-done banner */}
      {allDone && (
        <div className="sl-all-done">🎉 Alışveriş tamamlandı!</div>
      )}

      {/* Empty */}
      {total === 0 && (
        <div className="sl-empty-items">
          <div style={{ fontSize: '2.2rem', marginBottom: 6 }}>🛒</div>
          <div style={{ fontWeight: 700, color: 'var(--color-text-secondary)' }}>Liste boş</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>Aşağıdan ürün ekleyin</div>
        </div>
      )}

      {/* Grouped items */}
      <div className="sl-groups">
        {groups.map(group => (
          <div key={group.key} className="sl-group">
            <div className="sl-group__head">
              <span className="sl-group__emoji">{group.emoji}</span>
              <span className="sl-group__name">{group.label}</span>
              <span className="sl-group__count">{group.items.filter(i => checked.has(i.id)).length}/{group.items.length}</span>
            </div>
            <div className="sl-group__items">
              {group.items.map(item => {
                const isChecked = checked.has(item.id);
                const isDeleting = deletingId === item.id;
                return (
                  <div key={item.id} className={`sl-item${isChecked ? ' sl-item--done' : ''}`} style={{ opacity: isDeleting ? 0.4 : 1 }}>
                    <Checkbox checked={isChecked} onChange={() => toggleCheck(item.id)} />
                    <div className="sl-item__name">
                      <span className="sl-item__text">{item.name}</span>
                      {(item.amount || item.unit) && (
                        <span className="sl-item__qty">{item.amount}{item.unit ? ` ${item.unit}` : ''}</span>
                      )}
                    </div>
                    <button
                      className="sl-item__del"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                      aria-label="Sil"
                    >✕</button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add item form */}
      <div className="sl-add-form">
        <div className="sl-add-form__title">Ürün Ekle</div>
        <form onSubmit={handleAdd}>
          <div className="sl-add-form__row">
            <input
              className="form-input"
              placeholder="Ürün adı *"
              value={newItem.name}
              onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
              style={{ flex: 3, minWidth: 100 }}
            />
            <input
              className="form-input"
              placeholder="Miktar"
              value={newItem.amount}
              onChange={e => setNewItem(p => ({ ...p, amount: e.target.value }))}
              style={{ flex: 1, minWidth: 56 }}
            />
            <input
              className="form-input"
              placeholder="Birim"
              value={newItem.unit}
              onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
              style={{ flex: 1, minWidth: 56 }}
            />
          </div>
          <div className="sl-add-form__cats">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                type="button"
                className={`sl-cat-pill${newItem.cat === cat.key ? ' sl-cat-pill--on' : ''}`}
                style={newItem.cat === cat.key ? { background: cat.bg, color: cat.color, borderColor: cat.color } : {}}
                onClick={() => setNewItem(p => ({ ...p, cat: p.cat === cat.key ? '' : cat.key }))}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={adding || !newItem.name.trim()}
            style={{ marginTop: 10, width: '100%' }}
          >
            {adding ? 'Ekleniyor…' : '+ Ekle'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Lists overview ─────────────────────────────────────────────────────────────
export default function ShoppingListsPage() {
  const [lists, setLists]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [openId, setOpenId]     = useState(null);

  function loadLists() {
    setLoading(true);
    getShoppingLists()
      .then(d => setLists(d.lists || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadLists(); }, []);

  function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createShoppingList(newTitle.trim())
      .then(() => { setNewTitle(''); loadLists(); })
      .catch(err => setError(err.message));
  }

  function handleDelete(e, id) {
    e.stopPropagation();
    deleteShoppingList(id)
      .then(() => loadLists())
      .catch(err => setError(err.message));
  }

  if (openId !== null) {
    return <ListDetail listId={openId} onBack={() => { setOpenId(null); loadLists(); }} />;
  }

  return (
    <div className="sl-page">
      <div className="sl-page__header">
        <h2 className="home-title" style={{ marginBottom: 2 }}>Alışveriş Listelerim</h2>
        <p style={{ margin: 0, fontSize: ds.text.sm.fontSize, color: ds.colors.textMuted }}>
          {loading ? '' : lists.length === 0 ? 'Henüz liste yok' : `${lists.length} liste`}
        </p>
      </div>

      {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

      {/* Create form */}
      <div className="sl-create-form">
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8 }}>
          <input
            className="form-input"
            placeholder="Yeni liste adı…"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" type="submit" disabled={!newTitle.trim()}>Oluştur</button>
        </form>
      </div>

      {loading && <div className="loading">Yükleniyor…</div>}

      {!loading && lists.length === 0 && (
        <div className="sl-empty">
          <div className="sl-empty__art">🛒</div>
          <div className="sl-empty__title">Henüz liste yok</div>
          <div className="sl-empty__sub">Yukarıdan yeni bir liste oluşturun</div>
        </div>
      )}

      {!loading && lists.length > 0 && (
        <div className="sl-list-cards">
          {lists.map(list => (
            <button key={list.id} className="sl-list-card" onClick={() => setOpenId(list.id)}>
              <div className="sl-list-card__left">
                <div className="sl-list-card__icon">🛒</div>
                <div>
                  <div className="sl-list-card__name">{list.title}</div>
                  <div className="sl-list-card__meta">
                    {new Date(list.createdAt || list.created_at || Date.now()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                  </div>
                </div>
              </div>
              <div className="sl-list-card__right">
                <span className="sl-list-card__open">Aç →</span>
                <button
                  className="sl-list-card__del"
                  onClick={e => handleDelete(e, list.id)}
                  aria-label="Sil"
                >✕</button>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
