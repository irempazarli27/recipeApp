import { Bot, Heart, ShoppingCart } from 'lucide-react';
import _CountUpPkg from 'react-countup';
const CountUp = _CountUpPkg?.default ?? _CountUpPkg;
import ds from '../../design.js';

const FEATURES = [
  {
    icon: Bot,
    color: '#7c3aed',
    bg: '#f5f3ff',
    title: 'AI Destekli Tarifler',
    desc: 'Günlük öneri, tarif dönüşümü ve haftalık menü planlama. Gemini 2.5 Flash ile çalışır.',
    statKey: 'recipeCount',
    statLabel: 'tarif',
  },
  {
    icon: Heart,
    color: '#e11d48',
    bg: '#ffe4e6',
    title: 'Kişiselleştirme',
    desc: 'Favoriler, kişisel notlar, 1-5 yıldız puan sistemi ve yapacaklar listesi.',
    statKey: 'userCount',
    statLabel: 'kullanıcı',
  },
  {
    icon: ShoppingCart,
    color: '#16a34a',
    bg: '#dcfce7',
    title: 'Alışveriş Entegrasyonu',
    desc: 'Tarif malzemeleri tek tıkla kişisel alışveriş listesine dönüşür.',
    statKey: 'shoppingListCount',
    statLabel: 'liste',
  },
];

export default function AppShowcase({ stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
      {FEATURES.map((f) => {
        const Icon = f.icon;
        const value = stats?.[f.statKey] ?? 0;
        return (
          <div
            key={f.statKey}
            style={{
              ...ds.cardLg,
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: f.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={16} color={f.color} strokeWidth={2} />
              </div>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{f.title}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 16px' }}>{f.desc}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: f.color, lineHeight: 1 }}>
                <CountUp end={value} duration={1.4} separator="," enableScrollSpy scrollSpyOnce />
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{f.statLabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    