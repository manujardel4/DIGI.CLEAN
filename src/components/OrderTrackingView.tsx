import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { formatPrice } from '../utils/format';
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  Sparkles, 
  MapPin, 
  Phone, 
  Printer, 
  Download, 
  MessageCircle, 
  ShieldCheck, 
  ArrowLeft,
  Store,
  FileText,
  ChevronDown
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { orders, activeOrder, setActiveOrder, setCurrentView } = useApp();

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [orderSelectorOpen, setOrderSelectorOpen] = useState(false);

  // If no order exists at all
  if (!activeOrder) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="font-baloo text-xl font-bold text-slate-900">
          Aucune commande active pour le moment
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Passez votre première commande pour suivre le trajet et le soin apporté à votre linge en temps réel.
        </p>
        <button
          onClick={() => setCurrentView('new_order')}
          className="mt-6 px-6 py-3 rounded-xl font-baloo font-bold text-xs text-slate-900 bg-[#40e0d0] hover:bg-[#32c4b5] transition-all shadow-xs"
        >
          Créer une commande
        </button>
      </div>
    );
  }

  // Ordered sequence of steps
  const orderSteps: { status: OrderStatus; label: string; desc: string }[] = [
    { 
      status: 'confirmee', 
      label: 'Commande validée', 
      desc: 'Votre commande et l’estimation du devis ont été confirmées.' 
    },
    { 
      status: 'collecte_programmee', 
      label: 'Collecte programmée', 
      desc: `Créneau réservé le ${activeOrder.pickupDate} (${activeOrder.pickupSlot}).` 
    },
    { 
      status: 'collecte_en_cours', 
      label: 'Linge collecté à domicile', 
      desc: 'Notre livreur a pris en charge votre linge dans une housse sécurisée.' 
    },
    { 
      status: 'en_traitement', 
      label: 'Lavage & Détachage en atelier', 
      desc: 'Diagnostic des matières, aquanettoyage délicat et élimination des taches.' 
    },
    { 
      status: 'repassage_finition', 
      label: 'Repassage & Contrôle qualité', 
      desc: 'Repassage soigné à la main selon vos vœux (sur cintre ou plié).' 
    },
    { 
      status: 'prete', 
      label: 'Commande prête', 
      desc: 'Votre linge est sous film protecteur recyclé, prêt pour son retour.' 
    },
    { 
      status: 'en_livraison', 
      label: activeOrder.recoveryMode === 'retrait' ? 'Disponible au pressing' : 'En cours de livraison', 
      desc: activeOrder.recoveryMode === 'retrait' 
        ? `Votre linge est disponible au ${activeOrder.pickupAgencyName || 'Point DIGICLEAN'}.`
        : `Chauffeur en route vers ${activeOrder.address.street}.` 
    },
    { 
      status: 'terminee', 
      label: activeOrder.recoveryMode === 'retrait' ? 'Linge retiré' : 'Linge remis en mains propres', 
      desc: 'Prestation terminée avec succès. Merci d’avoir choisi DIGICLEAN !' 
    },
  ];

  // Helper to determine step status
  const getStepState = (stepStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = [
      'confirmee',
      'collecte_programmee',
      'collecte_en_cours',
      'en_traitement',
      'repassage_finition',
      'prete',
      'en_livraison',
      'terminee'
    ];

    const currentIndex = statusOrder.indexOf(activeOrder.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Top Bar with Order Selector & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l’accueil</span>
          </button>
          
          <div className="flex items-center gap-2">
            <h1 className="font-baloo text-2xl sm:text-3xl font-extrabold text-slate-900">
              Suivi de commande
            </h1>
            <span className="font-baloo text-base font-bold text-teal-800 bg-[#40e0d0]/20 px-2.5 py-0.5 rounded-full">
              {activeOrder.orderNumber}
            </span>
          </div>
        </div>

        {/* Action buttons: Switch order & Download receipt */}
        <div className="flex items-center gap-2">
          {orders.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setOrderSelectorOpen(!orderSelectorOpen)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span>Changer ({activeOrder.orderNumber})</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {orderSelectorOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30">
                  {orders.map(o => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setActiveOrder(o);
                        setOrderSelectorOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex justify-between ${
                        o.id === activeOrder.id ? 'bg-[#40e0d0]/10 font-bold text-teal-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{o.orderNumber}</span>
                      <span className="text-[10px] text-slate-400">{o.status}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setReceiptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <FileText className="w-4 h-4 text-teal-700" />
            <span>Reçu &amp; Facture</span>
          </button>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffa45b] animate-ping" />
              <span className="text-xs font-bold text-[#ffa45b] uppercase tracking-wider">
                Statut en direct
              </span>
            </div>
            
            <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-slate-900">
              {activeOrder.status === 'en_traitement' ? 'Linge en cours de traitement à l’atelier' :
               activeOrder.status === 'collecte_programmee' ? 'Collecte confirmée à votre domicile' :
               activeOrder.status === 'collecte_en_cours' ? 'Chauffeur en route pour collecte' :
               activeOrder.status === 'repassage_finition' ? 'Repassage & Contrôle qualité en cours' :
               activeOrder.status === 'prete' ? 'Commande prête et inspectée' :
               activeOrder.status === 'en_livraison' ? 'En cours de livraison chez vous !' :
               activeOrder.status === 'terminee' ? 'Prestation terminée avec succès' : 'Commande enregistrée'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              {activeOrder.recoveryMode === 'livraison'
                ? `Livraison prévue le ${activeOrder.deliveryDate} (${activeOrder.deliverySlot}) à l’adresse ${activeOrder.address.street}.`
                : `Retrait prévu auprès de l’agence : ${activeOrder.pickupAgencyName || 'DIGICLEAN Boutique'}.`}
            </p>
          </div>

          {/* Quick ETA Badge */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0 text-center w-full md:w-auto">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Délai de retour
            </span>
            <span className="font-baloo text-lg font-black text-slate-900 block mt-0.5">
              {activeOrder.deliveryDate}
            </span>
            <span className="text-xs text-teal-800 font-bold">
              {activeOrder.deliverySlot}
            </span>
          </div>
        </div>

        {/* Assigned Driver Card (If available) */}
        {activeOrder.driver && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#40e0d0]/20 flex items-center justify-center font-bold text-teal-900 text-sm">
                {activeOrder.driver.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Chauffeur dédié
                </span>
                <span className="font-baloo font-bold text-sm text-slate-900 block">
                  {activeOrder.driver.name}
                </span>
                <span className="text-xs text-slate-500">
                  {activeOrder.driver.vehicle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeOrder.driver.phone}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-teal-700" />
                <span>Appeler ({activeOrder.driver.phone})</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-baloo text-xl font-bold text-slate-900">
          Étapes détaillées du traitement
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {orderSteps.map((step, idx) => {
            const state = getStepState(step.status);
            const isCompleted = state === 'completed';
            const isCurrent = state === 'current';

            return (
              <div key={step.status} className="relative group">
                {/* Node icon circle */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-teal-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#40e0d0] text-slate-950 ring-4 ring-[#40e0d0]/30 shadow-md'
                      : 'bg-white border-2 border-slate-300 text-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>

                {/* Step content */}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-baloo text-base font-bold ${
                      isCurrent ? 'text-teal-900' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ffa45b] text-amber-950 px-2 py-0.5 rounded-full">
                        En cours
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Garments in this order */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-baloo text-lg font-bold text-slate-900">
          Articles confiés ({activeOrder.items.reduce((s, i) => s + i.quantity, 0)})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeOrder.items.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{item.item.name}</span>
                <span className="text-slate-500 text-[11px]">
                  Quantité : {item.quantity} · {item.finishType === 'cintre' ? 'Sur cintre' : 'Plié'}
                </span>
                {item.specialInstructions && (
                  <span className="text-[10px] text-teal-800 block mt-0.5 italic">
                    Note : {item.specialInstructions}
                  </span>
                )}
              </div>
              <span className="font-baloo font-bold text-slate-900 text-sm">
                {formatPrice(item.item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DIGITAL RECEIPT MODAL */}
      {receiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-3 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-[360px] w-full p-3.5 border border-slate-100 space-y-2 animate-in zoom-in-95 max-h-[82vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="text-[8px] font-bold text-teal-800 uppercase tracking-widest block">
                  Reçu &amp; Facture Numérique
                </span>
                <h3 className="font-baloo text-sm sm:text-base font-bold text-slate-900">
                  DIGICLEAN Pressing Dakar
                </h3>
              </div>
              <button
                onClick={() => setReceiptModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-800 p-1"
              >
                Fermer
              </button>
            </div>

            <div className="text-[10px] space-y-1 py-0.5">
              <div className="flex justify-between">
                <span className="text-slate-500">N° commande :</span>
                <span className="font-bold text-slate-900">{activeOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date :</span>
                <span className="font-bold text-slate-900">{new Date(activeOrder.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Client :</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">{activeOrder.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Règlement :</span>
                <span className="font-bold text-slate-900 uppercase">{activeOrder.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-b border-slate-100 py-1.5 space-y-1 text-[10px]">
              {activeOrder.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="truncate max-w-[210px]">{i.quantity} {i.item.unit === 'kg' ? 'kg' : 'x'} {i.item.name}</span>
                  <span className="font-bold">{formatPrice(Math.round(i.item.price * i.quantity))}</span>
                </div>
              ))}
              <div className="flex justify-between text-slate-500 pt-0.5">
                <span>Livraison :</span>
                <span>{activeOrder.deliveryFee === 0 ? 'Offerte' : formatPrice(activeOrder.deliveryFee)}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Remise ({activeOrder.promoCode}) :</span>
                  <span>- {formatPrice(activeOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-black text-slate-950 pt-1 border-t border-slate-100">
                <span>Total TTC :</span>
                <span>{formatPrice(activeOrder.total)}</span>
              </div>
            </div>

            <div className="pt-0.5">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-baloo font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer / PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
