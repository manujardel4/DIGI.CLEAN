import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DigiCleanLogo } from './DigiCleanLogo';
import { 
  Bell, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  PackagePlus, 
  Clock, 
  CheckCircle2, 
  Lock,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    notifications, 
    markAllNotificationsAsRead, 
    markNotificationAsRead,
    viewTrackingForOrder,
    isAdminUnlocked,
    setAuthModalOpen,
    userProfile,
    openTutorial 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'new_order', label: 'Commander', highlight: true },
    { id: 'tracking', label: 'Suivi en direct' },
    { id: 'history', label: 'Historique' },
    { id: 'profile', label: 'Mon Espace' },
  ];

  const handleNavClick = (viewId: any) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* ZONE 1: BRAND LOGO (Top-Left, non-modified as provided by user) */}
          <div className="flex items-center gap-3">
            <DigiCleanLogo 
              variant="horizontal" 
              size="md" 
              onClick={() => handleNavClick('home')} 
            />
          </div>

          {/* ZONE 2: NAVIGATION LINKS (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              if (link.highlight) {
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="relative flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-900 bg-[#40e0d0] hover:bg-[#32c4b5] active:scale-98 transition-all rounded-full shadow-xs whitespace-nowrap ml-1 mr-1"
                  >
                    <PackagePlus className="w-4 h-4 text-slate-900" />
                    <span>{link.label}</span>
                  </button>
                );
              }
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'text-[#0f172a] font-bold bg-slate-100' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: ACTIONS & PORTAL SWITCH */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Navigation Tutorial Guide button */}
            <button
              onClick={openTutorial}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-50 text-teal-900 border border-teal-200 hover:bg-[#40e0d0]/20 transition-all shadow-2xs"
              title="Tutoriel de navigation de la plateforme"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">Guide &amp; Tuto</span>
              <span className="sm:hidden">Tuto</span>
            </button>

            {/* Staff / Admin Portal Button */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
              title="Interface réservée aux membres DIGICLEAN"
            >
              {isAdminUnlocked ? (
                <ShieldCheck className="w-3.5 h-3.5 text-[#40e0d0]" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className="hidden sm:inline">Espace Pro</span>
              <span className="sm:hidden">Pro</span>
            </button>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffa45b] text-[10px] font-black text-slate-950">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-3 pb-1.5 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="font-baloo font-bold text-slate-900 text-sm">Notifications</span>
                      {unreadNotifs.length > 0 && (
                        <span className="text-[10px] bg-[#40e0d0]/20 text-teal-800 font-semibold px-1.5 py-0.5 rounded-full">
                          {unreadNotifs.length}
                        </span>
                      )}
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-slate-500 hover:text-slate-800 font-medium"
                      >
                        Tout lire
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="px-3 py-6 text-center text-slate-400 text-xs">
                        Aucune notification pour le moment.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.orderId) {
                              const match = notif.orderId.replace('#', '');
                              viewTrackingForOrder(match);
                              setNotifDropdownOpen(false);
                            }
                          }}
                          className={`px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-[#40e0d0]/5' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-[11px] font-bold text-slate-900 leading-tight">
                              {notif.title}
                            </span>
                            <span className="text-[9px] text-slate-400 whitespace-nowrap">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Trigger */}
            <button
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
              title="Mon Profil"
            >
              <div className="w-8 h-8 rounded-full bg-[#40e0d0]/20 border border-[#40e0d0]/40 flex items-center justify-center text-teal-800 font-bold text-xs">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  currentView === link.id
                    ? 'bg-[#40e0d0]/15 text-teal-900'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {link.highlight && (
                  <span className="bg-[#ffa45b] text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Express
                  </span>
                )}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <button
                onClick={() => {
                  openTutorial();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-teal-900 bg-teal-50 rounded-xl hover:bg-teal-100"
              >
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Tutoriel de navigation DIGICLEAN</span>
              </button>

              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Interface Membres DIGICLEAN</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
