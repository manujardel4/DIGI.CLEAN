import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DigiCleanLogo } from './DigiCleanLogo';
import { Order, OrderStatus } from '../types';
import { formatPrice } from '../utils/format';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Layers, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Search, 
  ArrowRight, 
  Phone, 
  MapPin, 
  AlertCircle,
  FileSpreadsheet,
  RefreshCw,
  LogOut
} from 'lucide-react';

export const AdminStaffView: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    isAdminUnlocked, 
    setIsAdminUnlocked,
    setCurrentView 
  } = useApp();

  // Password / PIN Gate
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'nouvelles' | 'collectes' | 'traitement' | 'pretes' | 'livraisons' | 'terminees' | 'toutes'
  >('nouvelles');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedOrderForNotes, setSelectedOrderForNotes] = useState<Order | null>(null);
  const [internalNoteText, setInternalNoteText] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pinInput.trim().toLowerCase();
    if (clean === '2026' || clean === 'cleanpro' || clean === 'admin') {
      setIsAdminUnlocked(true);
      setPinError('');
    } else {
      setPinError('Code incorrect. Indice : utilisez 2026 ou cleanpro');
    }
  };

  // If locked, render authentication gate
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-white mb-4 shadow-md">
          <Lock className="w-7 h-7 text-[#40e0d0]" />
        </div>

        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-widest block">
          Accès Restreint
        </span>
        <h2 className="font-baloo text-2xl font-black text-slate-900 mt-1">
          Interface Membres DIGICLEAN
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          Cet espace est réservé aux opérateurs d’atelier, gestionnaires et chauffeurs DIGICLEAN.
        </p>

        <form onSubmit={handleUnlock} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 text-left">
              Code mot de passe d’accès
            </label>
            <input
              type="password"
              placeholder="Saisissez votre code (ex: 2026)"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              className="w-full px-4 py-3 text-center text-base tracking-widest bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#40e0d0] outline-none font-mono"
              autoFocus
            />
          </div>

          {pinError && (
            <p className="text-xs text-rose-600 font-semibold">{pinError}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl font-baloo font-bold text-sm text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-md transition-all active:scale-98"
          >
            Déverrouiller l’espace de gestion
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Code d’accès démo : <strong className="text-slate-700">2026</strong></span>
          <button
            onClick={() => setCurrentView('home')}
            className="text-teal-800 font-bold hover:underline"
          >
            Retourner au site
          </button>
        </div>
      </div>
    );
  }

  // Filter orders according to the 6 required DIGICLEAN workflow tabs
  const getTabOrders = () => {
    return orders.filter(ord => {
      const matchSearch = 
        ord.orderNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
        ord.clientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        ord.address.street.toLowerCase().includes(searchFilter.toLowerCase());

      if (!matchSearch) return false;

      switch (activeTab) {
        case 'nouvelles':
          return ord.status === 'confirmee';
        case 'collectes':
          return ord.status === 'collecte_programmee' || ord.status === 'collecte_en_cours';
        case 'traitement':
          return ord.status === 'en_traitement' || ord.status === 'repassage_finition';
        case 'pretes':
          return ord.status === 'prete';
        case 'livraisons':
          return ord.status === 'en_livraison';
        case 'terminees':
          return ord.status === 'terminee';
        case 'toutes':
        default:
          return true;
      }
    });
  };

  const displayedOrders = getTabOrders();

  // Metrics
  const countNouvelles = orders.filter(o => o.status === 'confirmee').length;
  const countCollectes = orders.filter(o => o.status === 'collecte_programmee' || o.status === 'collecte_en_cours').length;
  const countTraitement = orders.filter(o => o.status === 'en_traitement' || o.status === 'repassage_finition').length;
  const countPretes = orders.filter(o => o.status === 'prete').length;
  const countLivraisons = orders.filter(o => o.status === 'en_livraison').length;
  const countTerminees = orders.filter(o => o.status === 'terminee').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#40e0d0] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#40e0d0]" />
            <span>Portail Équipe DIGICLEAN</span>
          </div>
          <h1 className="font-baloo text-2xl sm:text-3xl font-extrabold text-white">
            Tableau de Bord &amp; Suivi d’Atelier
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Supervisez les collectes, les cycles de lavage/repassage et les livraisons en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
          >
            Vue Client
          </button>
          <button
            onClick={() => setIsAdminUnlocked(false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Verrouiller</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nouvelles</span>
          <span className="font-baloo text-2xl font-black text-slate-900 block mt-1">{countNouvelles}</span>
          <span className="text-[10px] text-teal-800 font-semibold">À planifier</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Collectes</span>
          <span className="font-baloo text-2xl font-black text-[#ffa45b] block mt-1">{countCollectes}</span>
          <span className="text-[10px] text-amber-800 font-semibold">Chez les clients</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">En Traitement</span>
          <span className="font-baloo text-2xl font-black text-indigo-600 block mt-1">{countTraitement}</span>
          <span className="text-[10px] text-indigo-700 font-semibold">En machine / table</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prêtes</span>
          <span className="font-baloo text-2xl font-black text-emerald-600 block mt-1">{countPretes}</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Contrôle OK</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Livraisons</span>
          <span className="font-baloo text-2xl font-black text-teal-600 block mt-1">{countLivraisons}</span>
          <span className="text-[10px] text-teal-700 font-semibold">Sur la route</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chiffre d’Affaires</span>
          <span className="font-baloo text-xl font-black text-slate-900 block mt-1">{formatPrice(totalRevenue)}</span>
          <span className="text-[10px] text-slate-500 font-medium">{orders.length} commandes</span>
        </div>
      </div>

      {/* Tabs Navigation & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Exact 6 Tabs requested in prompt */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('nouvelles')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'nouvelles'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>1. Nouvelles commandes</span>
              <span className="bg-[#40e0d0] text-slate-950 px-1.5 py-0.2 rounded-full text-[10px]">{countNouvelles}</span>
            </button>

            <button
              onClick={() => setActiveTab('collectes')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'collectes'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>2. Collectes programmées</span>
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px]">{countCollectes}</span>
            </button>

            <button
              onClick={() => setActiveTab('traitement')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'traitement'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>3. En traitement</span>
              <span className="bg-indigo-100 text-indigo-900 px-1.5 py-0.2 rounded-full text-[10px]">{countTraitement}</span>
            </button>

            <button
              onClick={() => setActiveTab('pretes')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'pretes'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>4. Commandes prêtes</span>
              <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded-full text-[10px]">{countPretes}</span>
            </button>

            <button
              onClick={() => setActiveTab('livraisons')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'livraisons'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>5. Livraisons à effectuer</span>
              <span className="bg-teal-100 text-teal-900 px-1.5 py-0.2 rounded-full text-[10px]">{countLivraisons}</span>
            </button>

            <button
              onClick={() => setActiveTab('terminees')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'terminees'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>6. Terminées</span>
              <span className="text-slate-400 text-[10px]">{countTerminees}</span>
            </button>

            <button
              onClick={() => setActiveTab('toutes')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'toutes'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Toutes ({orders.length})
            </button>
          </div>

          {/* Search Field */}
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher commande, client..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] outline-none"
            />
          </div>

        </div>

        {/* Orders Pipeline List */}
        <div className="space-y-4 pt-2">
          {displayedOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Aucune commande dans cet onglet actuellement.
            </div>
          ) : (
            displayedOrders.map((order) => {
              const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all space-y-4"
                >
                  {/* Row 1: Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-baloo font-bold text-lg text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Client : <strong className="text-slate-800">{order.clientName}</strong> ({order.clientPhone})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 uppercase">
                        {order.status.replace('_', ' ')}
                      </span>
                      <span className="font-baloo font-black text-base text-slate-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Logistics & Items */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                        Logistique &amp; Remise
                      </span>
                      <p className="text-slate-700 font-semibold mt-1">
                        {order.recoveryMode === 'livraison' ? 'Livraison à domicile' : `Retrait ${order.pickupAgencyName || 'Boutique'}`}
                      </p>
                      <p className="text-slate-500 text-[11px]">{order.address.street}, {order.address.postalCode} {order.address.city}</p>
                      {order.notes && (
                        <p className="text-[10px] text-teal-800 mt-0.5 italic">Consigne : {order.notes}</p>
                      )}
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                        Planning Collecte / Retour
                      </span>
                      <p className="text-slate-700 font-semibold mt-1">
                        Collecte : {order.pickupDate} ({order.pickupSlot})
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Retour : {order.deliveryDate} ({order.deliverySlot})
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                        Articles confiés ({totalItems})
                      </span>
                      <div className="text-[11px] text-slate-700 mt-1 space-y-0.5 max-h-16 overflow-y-auto">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{it.quantity} {it.item.unit === 'kg' ? 'kg' : 'x'} {it.item.name}</span>
                            <span className="text-slate-400">({it.finishType === 'cintre' ? 'Cintre' : 'Plié'})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Staff Quick Action Buttons (1-click status progression) */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400">Action d’atelier :</span>
                      
                      {order.status === 'confirmee' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'collecte_programmee', 'Collecte planifiée avec chauffeur')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-[#ffa45b] hover:bg-[#f79240] transition-colors"
                        >
                          Programmer collecte
                        </button>
                      )}

                      {order.status === 'collecte_programmee' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'collecte_en_cours', 'Chauffeur en route pour récupérer le linge')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-[#ffa45b] hover:bg-[#f79240] transition-colors"
                        >
                          En route pour collecte
                        </button>
                      )}

                      {(order.status === 'collecte_programmee' || order.status === 'collecte_en_cours') && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'en_traitement', 'Linge reçu à l’atelier et mis en traitement')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                          Réceptionner &amp; Lancer traitement
                        </button>
                      )}

                      {order.status === 'en_traitement' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'repassage_finition', 'Nettoyage terminé, repassage et contrôle qualité')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                          Passer au repassage
                        </button>
                      )}

                      {order.status === 'repassage_finition' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'prete', 'Contrôle qualité validé, linge ensaché')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] transition-colors"
                        >
                          Marquer commande prête
                        </button>
                      )}

                      {order.status === 'prete' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'en_livraison', order.recoveryMode === 'retrait' ? 'Linge disponible au point de retrait' : 'Chauffeur en route pour livraison')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] transition-colors"
                        >
                          {order.recoveryMode === 'retrait' ? 'Rendre dispo en boutique' : 'Expédier en livraison'}
                        </button>
                      )}

                      {order.status === 'en_livraison' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'terminee', 'Linge remis au client en mains propres')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                        >
                          Valider remise au client
                        </button>
                      )}

                      {order.status === 'terminee' && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Prestation terminée</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrderForNotes(order);
                          setInternalNoteText(order.internalStaffNotes || '');
                        }}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"
                      >
                        Note atelier {order.internalStaffNotes ? '•' : ''}
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 p-1.5 rounded-lg border border-slate-200"
                        title="Imprimer bordereau linge"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Internal staff note display if present */}
                  {order.internalStaffNotes && (
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 text-xs text-amber-900">
                      <strong>Note interne d’atelier :</strong> {order.internalStaffNotes}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Internal Note Modal */}
      {selectedOrderForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 max-w-sm w-full border border-slate-100 shadow-xl space-y-2.5">
            <h3 className="font-baloo text-base font-bold text-slate-900">
              Note d’atelier · Commande {selectedOrderForNotes.orderNumber}
            </h3>
            <p className="text-[11px] text-slate-500">
              Ajoutez une consigne technique pour les repasseurs ou les livreurs.
            </p>

            <textarea
              rows={2}
              value={internalNoteText}
              onChange={e => setInternalNoteText(e.target.value)}
              placeholder="Ex : Veste bouton nacre fragile, chemise col amidonné..."
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-[#40e0d0]"
            />

            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setSelectedOrderForNotes(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-100 font-medium"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  updateOrderStatus(selectedOrderForNotes.id, selectedOrderForNotes.status, internalNoteText);
                  setSelectedOrderForNotes(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-2xs"
              >
                Enregistrer la note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
