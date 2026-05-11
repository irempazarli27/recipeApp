console.log("App loaded");
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
  Home, Search, Heart, Clock, ShoppingCart, User, LayoutDashboard, ChevronsRight, Menu, Bookmark, Calendar, LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import FavoritesPage from './FavoritesPage.jsx';
import HistoryPage from './HistoryPage.jsx';
import ShoppingListsPage from './ShoppingListsPage.jsx';
import AccountPage from './AccountPage.jsx';
import AdminPage from './AdminPage.jsx';
import SearchPage from './SearchPage.jsx';
import RecipeDetailPage from './RecipeDetailPage.jsx';
import WishlistPage from './WishlistPage.jsx';
import WeeklyPlanPage from './WeeklyPlanPage.jsx';

const navItems = [
  { to: '/', label: 'Ana Sayfa', Icon: Home },
  { to: '/search', label: 'Ara', Icon: Search },
  { to: '/favorites', label: 'Favoriler', Icon: Heart },
  { to: '/wishlist', label: 'Yapacaklarım', Icon: Bookmark },
  { to: '/weekly-plan', label: 'Haftalık Menü', Icon: Calendar },
  { to: '/history', label: 'Geçmiş', Icon: Clock },
  { to: '/shopping-lists', label: 'Alışveriş', Icon: ShoppingCart },
  { to: '/account', label: 'Hesabım', Icon: User },
  { to: '/admin', label: 'Admin', Icon: LayoutDashboard },
];

function SidebarContent({ open, onToggle, onNavClick }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  }

  return (
    <>
      {/* Logo + Toggle */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>🍽</div>
        {open && (
          <div className="sidebar-logo-text" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="sidebar-logo-name">Tarif<span>App</span></span>
            <small>Tarif Asistanı</small>
          </div>
        )}
        <button onClick={onToggle} className="sidebar-toggle-btn" title="Gizle / Göster">
          <ChevronsRight
            size={16}
            style={{ transition: 'transform 0.28s', transform: open ? 'rotate(180deg)' : 'none' }}
          />
        </button>
      </div>

      {/* Nav items */}
      <div className="sidebar-nav">
        {navItems.filter(({ to }) => to !== '/admin' || localStorage.getItem('role') === 'admin').map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavClick}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            title={!open ? label : undefined}
          >
            <span className="sidebar-icon"><Icon size={17} strokeWidth={2} /></span>
            {open && <span className="sidebar-label">{label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      {isLoggedIn && (
        <button onClick={handleLogout} className="sidebar-logout-btn" title={!open ? 'Çıkış Yap' : undefined}>
          <span className="sidebar-icon"><LogOut size={16} /></span>
          {open && <span className="sidebar-label">Çıkış Yap</span>}
        </button>
      )}
    </>
  );
}

function AdminRoute({ children }) {
  return localStorage.getItem('role') === 'admin' ? children : <Navigate to="/" replace />;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Desktop sidebar */}
      <nav className="sidebar-desktop" style={{ width: sidebarOpen ? 220 : 64 }}>
        <SidebarContent
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(o => !o)}
          onNavClick={undefined}
        />
      </nav>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar drawer */}
      <nav className="sidebar-mobile" style={{ left: mobileOpen ? 0 : -240 }}>
        <SidebarContent
          open={true}
          onToggle={() => setMobileOpen(false)}
          onNavClick={() => setMobileOpen(false)}
        />
      </nav>

      {/* Main area */}
      <div className="main-area">
        <header className="mobile-topbar">
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(o => !o)} aria-label="Menüyü aç">
            <Menu size={22} />
          </button>
          <span className="mobile-logo">🍽 Tarif<span>App</span></span>
          <span style={{ width: 38 }} />
        </header>

        <main className="main-box">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/weekly-plan" element={<WeeklyPlanPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/shopping-lists" element={<ShoppingListsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          </Routes>
        </main>
        <footer className="footer">© 2026 TarifApp</footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
