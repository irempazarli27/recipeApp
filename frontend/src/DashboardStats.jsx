import React from 'react';
import _CountUpPkg from 'react-countup';
const CountUp = _CountUpPkg?.default ?? _CountUpPkg;
import { UtensilsCrossed, Users, ShoppingCart } from 'lucide-react';
import ds from './design.js';

const METRICS = [
  {
    key: 'recipeCount',
    icon: UtensilsCrossed,
    label: 'Toplam Tarif',
    description: 'Veritabanındaki tarif sayısı',
    iconColor: '#7c3aed',
    iconBg: '#eef2ff',
  },
  {
    key: 'userCount',
    icon: Users,
    label: 'Kullanıcı',
    description: 'Kayıtlı üye sayısı',
    iconColor: '#0284c7',
    iconBg: '#e0f2fe',
  },
  {
    key: 'shoppingListCount',
    icon: ShoppingCart,
    label: 'Alışveriş Listesi',
    description: 'Oluşturulan toplam liste',
    iconColor: '#16a34a',
    iconBg: '#dcfce7',
  },
];

export default function DashboardStats({ stats }) {
  if (!stats) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
      {METRICS.map(({ key, icon: Icon, label, description, iconColor, iconBg }) => {
        const value = stats[key] || 0;
        return (
          <div
            key={key}
            style={{
              ...ds.card,
              padding: '20px 24px',
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color={iconColor} strokeWidth={2} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: ds.colors.textPrimary, letterSpacing: -1, lineHeight: 1, marginBottom: 6 }}>
              <CountUp end={value} duration={1.4} separator="," enableScrollSpy scrollSpyDelay={100} scrollSpyOnce />
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: ds.colors.textPrimary, marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: ds.text.xs.fontSize, color: ds.colors.textMuted, lineHeight: 1.4 }}>{description}</div>
          </div>
        );
      })}
    </div>
  );
}
