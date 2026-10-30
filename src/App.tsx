/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { NewOrderWizard } from './components/NewOrderWizard';
import { OrderTrackingView } from './components/OrderTrackingView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { UserProfileView } from './components/UserProfileView';
import { AdminStaffView } from './components/AdminStaffView';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { NavigationTutorialModal } from './components/NavigationTutorialModal';
import { DigiCleanLogo } from './components/DigiCleanLogo';
import { Truck, ShieldCheck, Clock, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView, isAuthenticated } = useApp();

  // Access to the application requires prior registration or login
  if (!isAuthenticated) {
    return (
      <>
        <AuthScreen />
        <NavigationTutorialModal />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Bar with mandatory top-left DIGICLEAN logo */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentView === 'home' && <HomeView />}
        {currentView === 'new_order' && <NewOrderWizard />}
        {currentView === 'tracking' && <OrderTrackingView />}
        {currentView === 'history' && <OrderHistoryView />}
        {currentView === 'profile' && <UserProfileView />}
        {currentView === 'admin' && <AdminStaffView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand & Logo */}
            <div className="space-y-3">
              <DigiCleanLogo variant="horizontal" size="md" />
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                La solution numérique moderne pour faire prendre en charge votre linge à domicile, avec transparence, soin d’atelier et ponctualité.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Service actif à Dakar 7j/7 de 07h à 21h</span>
              </div>
            </div>

            {/* Col 2: Services */}
            <div className="space-y-2">
              <h4 className="font-baloo font-bold text-sm text-slate-900">
                Nos 12 Prestations
              </h4>
              <ul className="text-xs text-slate-500 space-y-1.5">
                <li>Lavage simple &amp; à sec au kg</li>
                <li>Lavage à sec + Repassage au kg</li>
                <li>Entretiens costumes et tailleurs</li>
                <li>Nettoyage vêtements traditionnels</li>
                <li>Entretien couvertures &amp; couettes au kg</li>
                <li>Entretiens rideaux &amp; draperies au kg</li>
                <li>Nettoyage tapis et moquettes</li>
                <li>Entretien chaussures &amp; chaussures blanches</li>
                <li>Articles en cuir et daim au kg</li>
              </ul>
            </div>

            {/* Col 3: Engagements */}
            <div className="space-y-2">
              <h4 className="font-baloo font-bold text-sm text-slate-900">
                Garanties DIGICLEAN
              </h4>
              <ul className="text-xs text-slate-500 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#40e0d0]" />
                  <span>Collecte &amp; Livraison à domicile</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#ffa45b]" />
                  <span>Délai standard 48h ou express 24h</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#40e0d0]" />
                  <span>100% Aquanettoyage sans perchloroéthylène</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffa45b]" />
                  <span>Paiements sécurisés dématérialisés</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Accès rapide */}
            <div className="space-y-2">
              <h4 className="font-baloo font-bold text-sm text-slate-900">
                Espaces &amp; Contact
              </h4>
              <ul className="text-xs text-slate-500 space-y-1.5">
                <li>
                  <button onClick={() => setCurrentView('new_order')} className="hover:text-slate-900 transition-colors">
                    Passer une commande
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('tracking')} className="hover:text-slate-900 transition-colors">
                    Suivi de mon linge
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('history')} className="hover:text-slate-900 transition-colors">
                    Mes factures et reçus
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('admin')} className="text-teal-800 font-semibold hover:underline">
                    Accès Atelier &amp; Équipe DIGICLEAN
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>© {new Date().getFullYear()} DIGICLEAN. Tous droits réservés.</span>
            <div className="flex gap-4">
              <span>Mentions légales</span>
              <span>·</span>
              <span>Conditions Générales de Vente</span>
              <span>·</span>
              <span>Charte Qualité &amp; Écologie</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Pinned Mobile Navigation */}
      <BottomNav />

      {/* Authentication and Registration Modal */}
      <AuthModal />

      {/* Interactive Navigation Tutorial Modal */}
      <NavigationTutorialModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
