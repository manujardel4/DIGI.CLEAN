import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { formatPrice } from '../utils/format';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  FileText, 
  Search, 
  MapPin, 
  Calendar,
  Sparkles
} from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const { orders, viewTrackingForOrder, setCurrentView } = useApp();
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(order => {
    const isCompleted = order.status === 'terminee' || order.status === 'annulee';
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'completed' ? isCompleted :
      !isCompleted;

    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some(i => i.item.name.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-baloo text-2xl sm:text-3xl font-extrabold text-slate-900">
            Historique de vos commandes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Retrouvez l’ensemble de vos prestations, reçus et pièces traitées chez DIGICLEAN.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('new_order')}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl font-baloo font-bold text-xs text-slate-900 bg-[#40e0d0] hover:bg-[#32c4b5] transition-all shadow-xs flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Nouvelle commande</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher (ex: DC-8492, Chemise...)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] outline-none"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Toutes ({orders.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === 'in_progress' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Terminées
          </button>
        </div>

      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-baloo text-lg font-bold text-slate-800">
            Aucune commande correspondante
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Aucune prestation ne correspond à vos filtres actuels.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isFinished = order.status === 'terminee' || order.status === 'annulee';
            const totalGarments = order.items.reduce((s, i) => s + i.quantity, 0);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-[#40e0d0]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-baloo font-bold text-base text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isFinished 
                        ? 'bg-slate-100 text-slate-600' 
                        : 'bg-[#40e0d0]/20 text-teal-900'
                    }`}>
                      {order.status === 'terminee' ? 'Terminée' :
                       order.status === 'en_traitement' ? 'En cours de traitement' :
                       order.status === 'collecte_programmee' ? 'Collecte programmée' :
                       order.status === 'en_livraison' ? 'En cours de livraison' : order.status}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Summary of items */}
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800 font-semibold">{totalGarments} article{totalGarments > 1 ? 's' : ''} :</strong>{' '}
                    {order.items.map(i => `${i.quantity} ${i.item.unit === 'kg' ? 'kg' : 'x'} ${i.item.name}`).join(', ')}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.recoveryMode === 'livraison' ? 'Livraison à domicile' : `Retrait ${order.pickupAgencyName || 'Boutique'}`}</span>
                    </div>
                    <span className="text-slate-300">·</span>
                    <div>
                      Règlement : <strong className="uppercase font-semibold text-slate-700">{order.paymentMethod}</strong>
                    </div>
                  </div>
                </div>

                {/* Right side: Total and Tracking CTA */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-2 shrink-0">
                  <span className="font-baloo text-base sm:text-lg font-black text-slate-900">
                    {formatPrice(order.total)}
                  </span>

                  <button
                    onClick={() => viewTrackingForOrder(order.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-[#40e0d0] transition-colors"
                  >
                    <span>Détails &amp; Suivi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
