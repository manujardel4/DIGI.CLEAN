import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Sparkles, Navigation, History, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'new_order', label: 'Commander', icon: Sparkles, primary: true },
    { id: 'tracking', label: 'Suivi', icon: Navigation },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          if (tab.primary) {
            return (
              <div key={tab.id} className="flex justify-center items-center -mt-5">
                <button
                  onClick={() => setCurrentView(tab.id as any)}
                  className="w-13 h-13 rounded-full flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all text-slate-900 border-2 border-white"
                  style={{ backgroundColor: '#40e0d0' }}
                  aria-label="Nouvelle commande"
                >
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className="flex flex-col items-center justify-center py-1 transition-colors min-h-[44px]"
            >
              <Icon 
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-teal-700 stroke-[2.5]' : 'text-slate-500 stroke-[1.75]'
                }`} 
              />
              <span 
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-teal-900 font-bold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
