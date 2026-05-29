import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Scale, Clock, User } from 'lucide-react';
import WalletButton from './WalletButton';

const NAV_ITEMS = [
  { path: '/', label: 'Tools', icon: Scale },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf9]">
      <header className="bg-[#1D4035] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <Scale className="w-5 h-5" />
          <span className="font-bold text-lg tracking-tight">LexOn</span>
        </button>
        <WalletButton />
      </header>

      <main className="flex-1 px-4 py-4 pb-24 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <div className="flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
                }}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
