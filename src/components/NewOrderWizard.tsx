import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATALOG_ITEMS, SERVICE_CATEGORIES, DIGICLEAN_AGENCIES } from '../data/mockData';
import { OrderCartItem, ServiceItem, RecoveryMode, PaymentMethod, Order } from '../types';
import { formatPrice } from '../utils/format';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Truck, 
  Store, 
  Calendar, 
  Clock, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  Tag, 
  Sparkles, 
  MapPin, 
  Info,
  CheckCircle2,
  AlertCircle,
  Scale,
  Calculator,
  Edit3,
  X
} from 'lucide-react';

export const NewOrderWizard: React.FC = () => {
  const { userProfile, createOrder, setCurrentView, viewTrackingForOrder, pendingCartItem, setPendingCartItem } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1: CART ITEMS
  const [cart, setCart] = useState<OrderCartItem[]>([
    // Pre-populate with 2 items from the official 12-item catalog
    { item: CATALOG_ITEMS[0], quantity: 3, finishType: 'plie' }, // Lavage simple au kg (3 kg)
    { item: CATALOG_ITEMS[4], quantity: 1, finishType: 'cintre' }, // Entretiens costumes et tailleurs (1 pièce)
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // DEDICATED KG SELECTOR MODAL / STATE
  const [kgModalItem, setKgModalItem] = useState<ServiceItem | null>(null);
  const [kgInputValue, setKgInputValue] = useState<number>(5);
  const [kgFinishChoice, setKgFinishChoice] = useState<'cintre' | 'plie'>('plie');

  // Handle incoming pending cart item (e.g. from Home simulator or direct selection)
  useEffect(() => {
    if (pendingCartItem) {
      setCart(prev => {
        const existing = prev.find(i => i.item.id === pendingCartItem.item.id);
        if (existing) {
          return prev.map(i => i.item.id === pendingCartItem.item.id 
            ? { ...i, quantity: pendingCartItem.quantity, finishType: pendingCartItem.finishType || i.finishType }
            : i
          );
        }
        return [...prev, {
          item: pendingCartItem.item,
          quantity: pendingCartItem.quantity,
          finishType: pendingCartItem.finishType || (pendingCartItem.item.availableFinishes?.[0] || 'plie'),
        }];
      });
      setPendingCartItem(null);
    }
  }, [pendingCartItem, setPendingCartItem]);

  // STEP 2: RECOVERY MODE & ADDRESS
  const [recoveryMode, setRecoveryMode] = useState<RecoveryMode>('livraison');
  const [selectedAgency, setSelectedAgency] = useState(DIGICLEAN_AGENCIES[0].id);
  const [selectedAddressId, setSelectedAddressId] = useState(userProfile.addresses[0]?.id || 'addr-1');
  const [customInstructions, setCustomInstructions] = useState('Sonner à l’interphone ou appeler à l’arrivée');

  // STEP 3: SLOTS & PREFERENCES
  const [pickupDate, setPickupDate] = useState('Aujourd’hui');
  const [pickupSlot, setPickupSlot] = useState('14h00 - 16h00');
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
  const [deliverySlot, setDeliverySlot] = useState('18h00 - 20h00');
  const [detergentType, setDetergentType] = useState(userProfile.defaultPreferences.detergentType || 'bio_ecologique');
  const [scent, setScent] = useState(userProfile.defaultPreferences.scent || 'fleur_coton');
  const [starchLevel, setStarchLevel] = useState(userProfile.defaultPreferences.starchLevel || 'leger');

  // STEP 4: PROMO & PAYMENT
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mobile_money');
  const [mobileMoneyOperator, setMobileMoneyOperator] = useState('Wave');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCreatedSuccess, setOrderCreatedSuccess] = useState<Order | null>(null);

  // CART CALCULATIONS
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  
  // Delivery is free above 15 000 FCFA or if pickup mode is used
  const rawDeliveryFee = recoveryMode === 'retrait' ? 0 : subtotal >= 15000 ? 0 : 1500;
  const expressFee = deliveryOption === 'express' ? 2000 : 0;
  const deliveryFee = rawDeliveryFee + expressFee;
  
  const discount = appliedPromo ? appliedPromo.discountAmount : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  // CART MANAGEMENT HANDLERS
  const handleOpenKgModal = (item: ServiceItem) => {
    const existing = cart.find(i => i.item.id === item.id);
    setKgInputValue(existing ? existing.quantity : 5);
    setKgFinishChoice(existing ? existing.finishType : (item.availableFinishes?.[0] || 'plie'));
    setKgModalItem(item);
  };

  const handleConfirmKg = () => {
    if (!kgModalItem) return;
    const finalKg = Math.max(0.5, Math.round(Number(kgInputValue) * 10) / 10);
    setCart(prev => {
      const existing = prev.find(i => i.item.id === kgModalItem.id);
      if (existing) {
        return prev.map(i => i.item.id === kgModalItem.id
          ? { ...i, quantity: finalKg, finishType: kgFinishChoice }
          : i
        );
      }
      return [...prev, { item: kgModalItem, quantity: finalKg, finishType: kgFinishChoice }];
    });
    setKgModalItem(null);
  };

  const handleAddItem = (item: ServiceItem) => {
    if (item.unit === 'kg') {
      handleOpenKgModal(item);
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1, finishType: (item.availableFinishes?.[0] || 'cintre') as any }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(i => {
          if (i.item.id === itemId) {
            const step = i.item.unit === 'kg' ? 1 : 1;
            const newQty = Math.round((i.quantity + (delta * step)) * 10) / 10;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderCartItem[];
    });
  };

  const handleToggleFinish = (itemId: string) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === itemId) {
        return { ...i, finishType: i.finishType === 'cintre' ? 'plie' : 'cintre' };
      }
      return i;
    }));
  };

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'CLEAN10' || code === 'BIENVENUE10') {
      const discountVal = Math.round(subtotal * 0.1);
      setAppliedPromo({ code, discountAmount: discountVal });
    } else if (code === 'DIGISENEGAL') {
      setAppliedPromo({ code, discountAmount: 1500 });
    } else if (code === 'PROMO2000') {
      setAppliedPromo({ code, discountAmount: 2000 });
    } else {
      setPromoError('Code non valide. Essayez DIGISENEGAL ou BIENVENUE10');
    }
  };

  const handleFinalOrderSubmit = () => {
    setIsSubmitting(true);

    const targetAddress = userProfile.addresses.find(a => a.id === selectedAddressId) || userProfile.addresses[0];
    const targetAgency = DIGICLEAN_AGENCIES.find(a => a.id === selectedAgency);

    const generatedNumber = `DC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: generatedNumber,
      createdAt: new Date().toISOString(),
      clientName: userProfile.name,
      clientPhone: userProfile.phone,
      clientEmail: userProfile.email,
      address: targetAddress,
      recoveryMode,
      pickupAgencyName: recoveryMode === 'retrait' ? targetAgency?.name : undefined,
      pickupDate,
      pickupSlot,
      deliveryDate: deliveryOption === 'express' ? 'Demain (Express 24h)' : 'Après-demain (48h)',
      deliverySlot,
      items: cart,
      subtotal,
      deliveryFee,
      discount,
      promoCode: appliedPromo?.code,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'especes' ? 'a_la_collecte' : 'paye',
      status: 'confirmee',
      notes: customInstructions,
      preferences: {
        detergentType,
        scent,
        finishPreference: 'cintre',
        starchLevel,
      },
      driver: {
        name: 'Ibrahima Fall',
        phone: '+221 77 555 43 21',
        vehicle: 'Moto-cargo électrique DIGICLEAN #02',
        eta: `Collecte prévue le ${pickupDate} (${pickupSlot})`
      },
      history: [
        {
          status: 'confirmee',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          note: `Commande confirmée et planifiée via ${paymentMethod === 'mobile_money' ? mobileMoneyOperator : paymentMethod}`
        }
      ]
    };

    setTimeout(() => {
      createOrder(newOrder);
      setIsSubmitting(false);
      setOrderCreatedSuccess(newOrder);
    }, 900);
  };

  // SUCCESS CONFIRMATION OVERLAY
  if (orderCreatedSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-teal-50 mx-auto flex items-center justify-center text-teal-600 mb-4">
          <CheckCircle2 className="w-10 h-10 text-[#40e0d0]" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
          Commande confirmée avec succès
        </span>
        <h2 className="font-baloo text-3xl font-extrabold text-slate-900 mt-1">
          Merci pour votre confiance !
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
          Votre commande <strong className="text-slate-900 font-bold">{orderCreatedSuccess.orderNumber}</strong> est validée. Un récapitulatif a été envoyé à {orderCreatedSuccess.clientEmail}.
        </p>

        {/* Highlight Box */}
        <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Collecte programmée :</span>
            <span className="font-bold text-slate-900">{orderCreatedSuccess.pickupDate} à {orderCreatedSuccess.pickupSlot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Mode de récupération :</span>
            <span className="font-bold text-slate-900">
              {orderCreatedSuccess.recoveryMode === 'livraison' ? 'Livraison à domicile' : `Retrait en agence (${orderCreatedSuccess.pickupAgencyName})`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Montant total réglé :</span>
            <span className="font-black text-slate-900">{formatPrice(orderCreatedSuccess.total)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => viewTrackingForOrder(orderCreatedSuccess.id)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-baloo font-bold text-sm text-slate-900 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-md transition-all active:scale-98"
          >
            Suivre ma commande en direct
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-medium text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            Retourner à l’accueil
          </button>
        </div>
      </div>
    );
  }

  // STEP INDICATOR HEAD
  const steps = [
    { num: 1, title: 'Articles' },
    { num: 2, title: 'Récupération' },
    { num: 3, title: 'Collecte' },
    { num: 4, title: 'Paiement' },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Wizard Header & Steps Progress */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-baloo text-2xl sm:text-3xl font-extrabold text-slate-900">
              Commander un pressing
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Estimation transparente avant validation, aucun frais caché.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Annuler
          </button>
        </div>

        {/* Stepper bar */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="flex flex-col gap-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isDone || isCurrent ? 'bg-[#40e0d0]' : 'bg-slate-200'
                  }`} 
                />
                <span className={`text-[11px] font-bold ${isCurrent ? 'text-teal-900' : 'text-slate-400'}`}>
                  {s.num}. {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* STEP 1: SÉLECTION DES PRESTATIONS & ARTICLES */}
      {/* ============================================================ */}
      {currentStep === 1 && (
        <div className="space-y-6">
          
          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tous ({CATALOG_ITEMS.length})
            </button>
            {SERVICE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Catalog Grid (2 cols on large screen) */}
            <div className="lg:col-span-2 space-y-3">
              {CATALOG_ITEMS
                .filter(item => activeCategory === 'all' || item.category === activeCategory)
                .map((item) => {
                  const inCart = cart.find(c => c.item.id === item.id);
                  const isKg = item.unit === 'kg';

                  return (
                    <div
                      key={item.id}
                      className={`bg-white p-4 rounded-2xl border transition-all ${
                        inCart 
                          ? 'border-[#40e0d0] shadow-sm bg-linear-to-r from-white to-teal-50/20' 
                          : 'border-slate-200 shadow-xs hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-baloo font-bold text-sm sm:text-base text-slate-900 truncate">
                              {item.name}
                            </h3>
                            {isKg && (
                              <span className="text-[10px] font-bold bg-[#40e0d0]/20 text-teal-950 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Scale className="w-3 h-3 text-teal-700" />
                                <span>Tarif au kg</span>
                              </span>
                            )}
                            {item.popular && (
                              <span className="text-[10px] font-bold bg-[#ffa45b]/20 text-amber-900 px-1.5 py-0.5 rounded-md">
                                Populaire
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                          <div className="mt-1 text-xs flex items-center gap-2">
                            <strong className="font-baloo text-slate-900 font-bold">{formatPrice(item.price)}</strong>
                            <span className="text-[11px] text-slate-400"> /{item.unit}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] text-slate-500">{item.turnaroundHours}h</span>
                          </div>
                        </div>

                        {/* Controls (differentiated if item is au kg vs pièce) */}
                        <div className="shrink-0 flex items-center gap-2">
                          {isKg ? (
                            // Service au kg
                            inCart ? (
                              <div className="flex items-center gap-2">
                                <div className="text-right mr-1">
                                  <span className="text-[11px] text-slate-400 block">Sous-total :</span>
                                  <span className="font-baloo font-black text-xs sm:text-sm text-teal-900">
                                    {formatPrice(Math.round(item.price * inCart.quantity))}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, -1)}
                                    title="Diminuer de 1 kg"
                                    className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-xs"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenKgModal(item)}
                                    title="Modifier le poids en kg"
                                    className="px-2.5 py-1 rounded-lg bg-white border border-teal-300 hover:bg-teal-50 text-xs font-bold text-slate-900 flex items-center gap-1"
                                  >
                                    <span>{inCart.quantity} kg</span>
                                    <Edit3 className="w-3 h-3 text-teal-700" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateQuantity(item.id, 1)}
                                    title="Augmenter de 1 kg"
                                    className="w-8 h-8 rounded-lg bg-[#40e0d0] text-slate-950 flex items-center justify-center hover:bg-[#32c4b5] transition-colors shadow-xs"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleOpenKgModal(item)}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-xs active:scale-95 transition-all"
                              >
                                <Scale className="w-3.5 h-3.5" />
                                <span>Choisir les kg</span>
                              </button>
                            )
                          ) : (
                            // Service à la pièce / tenue / paire
                            inCart ? (
                              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-xs"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-slate-900">
                                  {inCart.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="w-8 h-8 rounded-lg bg-[#40e0d0] text-slate-950 flex items-center justify-center hover:bg-[#32c4b5] transition-colors shadow-xs"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddItem(item)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-[#40e0d0] transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Ajouter</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Sticky Cart Summary Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm sticky top-24 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-baloo font-bold text-slate-900 text-base">
                    Mon Panier ({totalItemCount})
                  </span>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Vider
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Votre panier est vide. Sélectionnez un article à gauche pour commencer.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {cart.map(item => {
                      const isKg = item.item.unit === 'kg';
                      return (
                        <div key={item.item.id} className="text-xs border-b border-slate-50 pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-slate-800">{item.item.name}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-slate-500 text-[11px]">
                                  {item.quantity} {item.item.unit} × {formatPrice(item.item.price)}
                                </span>
                                {isKg && (
                                  <button
                                    onClick={() => handleOpenKgModal(item.item)}
                                    title="Modifier le poids en kg"
                                    className="text-[10px] text-teal-800 font-bold hover:underline flex items-center gap-0.5"
                                  >
                                    <Edit3 className="w-2.5 h-2.5" />
                                    <span>modifier</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-slate-900">
                              {formatPrice(Math.round(item.item.price * item.quantity))}
                            </span>
                          </div>

                          {/* Finish option toggle */}
                          {item.item.availableFinishes && item.item.availableFinishes.length > 1 && (
                            <div className="mt-1.5 flex items-center justify-between text-[11px] bg-slate-50 p-1.5 rounded-lg">
                              <span className="text-slate-500">Conditionnement :</span>
                              <button
                                onClick={() => handleToggleFinish(item.item.id)}
                                className="font-bold text-teal-800 hover:underline"
                              >
                                {item.finishType === 'cintre' ? 'Sur cintre' : 'Plié sous film'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Subtotal & Action */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Sous-total estimé :</span>
                    <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Livraison :</span>
                    <span>{subtotal >= 15000 ? 'Offerte dès 15 000 FCFA' : '1 500 FCFA (ou retrait gratuit)'}</span>
                  </div>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={() => setCurrentStep(2)}
                  className={`w-full py-3.5 rounded-2xl font-baloo font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    cart.length > 0
                      ? 'bg-[#40e0d0] hover:bg-[#32c4b5] text-slate-950 shadow-md active:scale-98'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Programmer la collecte</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 2: MODE DE RÉCUPÉRATION & ADRESSES */}
      {/* ============================================================ */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          <div>
            <h2 className="font-baloo text-xl font-bold text-slate-900">
              Mode de récupération du linge
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choisissez comment vous souhaitez récupérer votre linge une fois soigné.
            </p>
          </div>

          {/* Recovery Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Option 1: Livraison à domicile */}
            <div
              onClick={() => setRecoveryMode('livraison')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                recoveryMode === 'livraison'
                  ? 'border-[#40e0d0] bg-[#40e0d0]/5 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-800">
                  <Truck className="w-5 h-5 text-[#40e0d0]" />
                </div>
                <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {subtotal >= 15000 ? 'Offerte dès 15 000 FCFA' : '1 500 FCFA'}
                </span>
              </div>
              <h3 className="font-baloo font-bold text-base text-slate-900 mt-3">
                Livraison à domicile
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Notre livreur dépose votre linge directement chez vous à l’heure convenue.
              </p>
            </div>

            {/* Option 2: Retrait en pressing DIGICLEAN */}
            <div
              onClick={() => setRecoveryMode('retrait')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                recoveryMode === 'retrait'
                  ? 'border-[#40e0d0] bg-[#40e0d0]/5 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800">
                  <Store className="w-5 h-5 text-[#ffa45b]" />
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Gratuit
                </span>
              </div>
              <h3 className="font-baloo font-bold text-base text-slate-900 mt-3">
                Retrait en pressing DIGICLEAN
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Récupérez votre linge dans l’un de nos points relais ou ateliers partenaires.
              </p>
            </div>

          </div>

          {/* Conditional details based on mode */}
          {recoveryMode === 'livraison' ? (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Adresse de prise en charge et de livraison
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userProfile.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-[#40e0d0] bg-[#40e0d0]/5 ring-2 ring-[#40e0d0]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{addr.label}</span>
                      {selectedAddressId === addr.id && (
                        <Check className="w-4 h-4 text-teal-700" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{addr.street}</p>
                    <p className="text-[11px] text-slate-400">{addr.postalCode} {addr.city}</p>
                    {addr.details && (
                      <p className="text-[10px] text-slate-500 mt-1 italic">{addr.details}</p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Consignes pour le livreur (digicode, sonnette, étage)
                </label>
                <input
                  type="text"
                  value={customInstructions}
                  onChange={e => setCustomInstructions(e.target.value)}
                  placeholder="Ex : Bâtiment B, code 45B2, 3ème gauche..."
                  className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Sélectionnez votre pressing DIGICLEAN de retrait
              </span>

              {DIGICLEAN_AGENCIES.map(agency => (
                <div
                  key={agency.id}
                  onClick={() => setSelectedAgency(agency.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedAgency === agency.id
                      ? 'border-[#40e0d0] bg-[#40e0d0]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{agency.name}</span>
                    <span className="text-[11px] text-teal-800 font-semibold">{agency.distance}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{agency.address}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{agency.openingHours}</p>
                </div>
              ))}
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux articles</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-2xl font-baloo font-bold text-xs text-slate-900 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-xs active:scale-98 transition-all flex items-center gap-2"
            >
              <span>Choisir les créneaux</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 3: PROGRAMMATION COLLECTE & PRÉFÉRENCES */}
      {/* ============================================================ */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          <div>
            <h2 className="font-baloo text-xl font-bold text-slate-900">
              Disponibilités &amp; Programmation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quand pouvons-nous collecter votre linge ?
            </p>
          </div>

          {/* Pickup Date Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Jour de collecte souhaité
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Aujourd’hui', 'Demain', 'Dans 2 jours', 'Samedi'].map(date => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setPickupDate(date)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    pickupDate === date
                      ? 'border-[#40e0d0] bg-[#40e0d0]/10 text-teal-950 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Time Slot */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Créneau horaire de passage du livreur
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['08h00 - 10h00', '10h00 - 12h00', '14h00 - 16h00', '18h00 - 20h00'].map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setPickupSlot(slot)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    pickupSlot === slot
                      ? 'border-[#40e0d0] bg-[#40e0d0]/10 text-teal-950 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Speed / Delivery Option */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">
              Délai de traitement souhaité
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setDeliveryOption('standard')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryOption === 'standard'
                    ? 'border-[#40e0d0] bg-[#40e0d0]/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-900">Standard 48h</span>
                  <span className="text-[11px] font-semibold text-slate-500">Inclus</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Retour impeccable sous 48 heures</p>
              </div>

              <div
                onClick={() => setDeliveryOption('express')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryOption === 'express'
                    ? 'border-[#ffa45b] bg-[#ffa45b]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-900">Express 24h</span>
                  <span className="text-[11px] font-bold text-amber-800">+ 2 000 FCFA</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Traitement prioritaire en atelier</p>
              </div>
            </div>
          </div>

          {/* Preferences Box */}
          <div className="space-y-3 pt-3 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl">
            <span className="text-xs font-bold text-slate-800 block">
              Vos préférences de lavage &amp; finition
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1 font-medium">Détergent</label>
                <select
                  value={detergentType}
                  onChange={e => setDetergentType(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-800"
                >
                  <option value="bio_ecologique">Bio Écologique</option>
                  <option value="hypoallergenique">Hypoallergénique</option>
                  <option value="standard">Standard d’atelier</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1 font-medium">Parfum</label>
                <select
                  value={scent}
                  onChange={e => setScent(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-800"
                >
                  <option value="fleur_coton">Fleur de Coton</option>
                  <option value="lavande_douce">Lavande Douce</option>
                  <option value="neutre">Sans parfum (Neutre)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1 font-medium">Amidon chemises</label>
                <select
                  value={starchLevel}
                  onChange={e => setStarchLevel(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-800"
                >
                  <option value="leger">Léger sur col</option>
                  <option value="aucun">Sans amidon</option>
                  <option value="moyen">Moyen (tenue ferme)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour récupération</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-2xl font-baloo font-bold text-xs text-slate-900 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-xs active:scale-98 transition-all flex items-center gap-2"
            >
              <span>Vérifier le récapitulatif</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 4: DEVIS ESTIMATIF TRANSPARENT & PAIEMENT FLUIDE */}
      {/* ============================================================ */}
      {currentStep === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Order Summary & Review */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="font-baloo text-xl font-bold text-slate-900">
                Devis estimatif garanti
              </h2>
              <p className="text-xs text-slate-500">
                Voici le récapitulatif détaillé de votre commande avant validation.
              </p>

              {/* Items List */}
              <div className="divide-y divide-slate-100 pt-2">
                {cart.map(item => (
                  <div key={item.item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{item.item.name}</span>
                      <span className="text-slate-500 block text-[11px]">
                        Quantité : {item.quantity} · Conditionnement : {item.finishType === 'cintre' ? 'Sur cintre' : 'Plié'}
                      </span>
                    </div>
                    <span className="font-black text-slate-900">
                      {formatPrice(item.item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Timing & Location Recap Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Collecte prévue :</span>
                  <span className="font-bold text-slate-900">{pickupDate} ({pickupSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode de remise :</span>
                  <span className="font-bold text-slate-900">
                    {recoveryMode === 'livraison' ? 'Livraison à domicile' : 'Retrait en boutique DIGICLEAN'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Formule :</span>
                  <span className="font-bold text-slate-900">
                    {deliveryOption === 'express' ? 'Express 24h' : 'Standard 48h'}
                  </span>
                </div>
              </div>

              {/* Promo code field */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Code promo ou bon de réduction
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ex: DIGISENEGAL ou BIENVENUE10"
                      value={promoCodeInput}
                      onChange={e => setPromoCodeInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Appliquer
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{promoError}</span>
                  </p>
                )}
                {appliedPromo && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Code {appliedPromo.code} appliqué (-{formatPrice(appliedPromo.discountAmount)})</span>
                  </p>
                )}
              </div>

            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-baloo text-lg font-bold text-slate-900">
                Moyen de paiement sécurisé
              </h3>
              <p className="text-xs text-slate-500">
                Paiement dématérialisé pour fluidifier les transactions et éliminer la gestion informelle.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Mobile Money (Primary in Senegal) */}
                <div
                  onClick={() => setPaymentMethod('mobile_money')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'mobile_money'
                      ? 'border-[#40e0d0] bg-[#40e0d0]/5 ring-2 ring-[#40e0d0]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-5 h-5 text-amber-700" />
                    <span className="font-bold text-xs text-slate-900">Wave &amp; Mobile Money</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Wave, Orange Money Sénégal, Free Money</p>
                </div>

                {/* Carte bancaire */}
                <div
                  onClick={() => setPaymentMethod('carte')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'carte'
                      ? 'border-[#40e0d0] bg-[#40e0d0]/5 ring-2 ring-[#40e0d0]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-teal-700" />
                    <span className="font-bold text-xs text-slate-900">Carte Bancaire</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Visa, Mastercard, GIM-UEMOA sécurisé</p>
                </div>

                {/* Apple Pay */}
                <div
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#40e0d0] bg-[#40e0d0]/5 ring-2 ring-[#40e0d0]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-slate-900" />
                    <span className="font-bold text-xs text-slate-900">Apple Pay / Google Pay</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Règlement instantané sécurisé</p>
                </div>

                {/* Espèces à la collecte avec reçu numérique */}
                <div
                  onClick={() => setPaymentMethod('especes')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'especes'
                      ? 'border-[#40e0d0] bg-[#40e0d0]/5 ring-2 ring-[#40e0d0]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-5 h-5 text-emerald-700" />
                    <span className="font-bold text-xs text-slate-900">Espèces à la collecte</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Reçu numérique envoyé par SMS &amp; e-mail</p>
                </div>

              </div>

              {/* Mobile money operator sub-selector */}
              {paymentMethod === 'mobile_money' && (
                <div className="pt-2 p-3 bg-slate-50 rounded-xl flex items-center gap-2 text-xs flex-wrap">
                  <span className="text-slate-600 font-medium">Opérateur sélectionné :</span>
                  {['Wave', 'Orange Money Sénégal', 'Free Money'].map(op => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setMobileMoneyOperator(op)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                        mobileMoneyOperator === op
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Final Total & Validation Button */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-24 space-y-4">
              <span className="font-baloo font-bold text-slate-900 text-lg block border-b border-slate-100 pb-3">
                Total à régler
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Prestations ({totalItemCount} articles) :</span>
                  <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Frais de livraison :</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Remise promo ({appliedPromo.code}) :</span>
                    <span>- {formatPrice(appliedPromo.discountAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-baloo font-bold text-base text-slate-900">Total TTC :</span>
                  <span className="font-baloo font-black text-xl text-slate-950">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Loyalty Reward Preview */}
              <div className="p-3 bg-[#40e0d0]/10 rounded-xl text-[11px] text-teal-900 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Cette commande vous rapporte +{Math.max(1, Math.floor(total / 100))} points DIGICLEAN Club.</span>
              </div>

              {/* ACTION PRINCIPALE : VISUELLEMENT DIFFÉRENCIÉE EN TURQUOISE */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalOrderSubmit}
                className="w-full py-4 rounded-2xl font-baloo font-extrabold text-base text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-lg shadow-teal-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Validation en cours...</span>
                ) : (
                  <>
                    <span>Confirmer et Payer ({formatPrice(total)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 pt-1"
              >
                Modifier mes disponibilités
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL / BOTTOM SHEET : SÉLECTION & CALCUL AUTOMATIQUE AU KILO */}
      {/* ============================================================ */}
      {kgModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-3 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-[360px] w-full p-3.5 border border-slate-200 space-y-2.5 animate-in zoom-in-95 duration-200 max-h-[82vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-1.5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-teal-800 uppercase tracking-wider">
                  <Scale className="w-3 h-3 text-teal-700" />
                  <span>Calcul au kilo</span>
                </div>
                <h3 className="font-baloo text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  {kgModalItem.name}
                </h3>
                <span className="text-[10px] text-slate-500">
                  Tarif : <strong className="text-slate-900 font-bold">{formatPrice(kgModalItem.price)}</strong> / kg
                </span>
              </div>

              <button
                onClick={() => setKgModalItem(null)}
                className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* DIRECT NUMERIC INSERTION (Saisie directe du nombre de kg) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 block">
                Insérez le nombre de kg :
              </label>

              <div className="flex items-center justify-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setKgInputValue(prev => Math.max(0.5, Math.round((prev - 0.5) * 10) / 10))}
                  title="Diminuer de 0.5 kg"
                  className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-2xs"
                >
                  -0.5
                </button>

                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0.5"
                    max="200"
                    step="0.5"
                    value={kgInputValue}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setKgInputValue(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-20 text-center text-lg font-baloo font-black text-slate-950 bg-white border-2 border-[#40e0d0] rounded-md py-0.5 px-1 shadow-inner focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                  <span className="ml-1 font-baloo font-bold text-xs text-slate-600">
                    kg
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setKgInputValue(prev => Math.round((prev + 0.5) * 10) / 10)}
                  title="Ajouter 0.5 kg"
                  className="w-8 h-8 rounded-md bg-[#40e0d0] text-slate-950 font-bold text-xs flex items-center justify-center hover:bg-[#32c4b5] active:scale-95 transition-all shadow-2xs"
                >
                  +0.5
                </button>
              </div>
            </div>

            {/* QUICK SELECTION PRESETS (Choix en un clic) */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 block">
                Formats rapides :
              </label>

              <div className="grid grid-cols-4 gap-1">
                {[
                  { kg: 2, label: '2 kg' },
                  { kg: 3, label: '3 kg' },
                  { kg: 5, label: '5 kg' },
                  { kg: 7, label: '7 kg' },
                  { kg: 10, label: '10 kg' },
                  { kg: 15, label: '15 kg' },
                  { kg: 20, label: '20 kg' },
                ].map((preset) => {
                  const isSelected = kgInputValue === preset.kg;
                  return (
                    <button
                      key={preset.kg}
                      type="button"
                      onClick={() => setKgInputValue(preset.kg)}
                      className={`py-1 px-1.5 rounded-md text-center transition-all border text-[11px] font-baloo font-bold ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-[#40e0d0] hover:bg-slate-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AUTOMATIC CALCULATION CARD (Calcul automatique instantané) */}
            <div className="bg-linear-to-r from-teal-50 via-white to-amber-50 border border-[#40e0d0] rounded-lg p-2 text-center space-y-0.5 shadow-2xs">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-teal-800 block">
                Calcul Automatique
              </span>

              <div className="flex items-center justify-center flex-wrap gap-1 text-slate-900 font-baloo">
                <span className="text-xs font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {kgInputValue} kg
                </span>
                <span className="text-slate-400 font-bold text-[10px]">×</span>
                <span className="text-[11px] font-bold text-slate-700">
                  {formatPrice(kgModalItem.price)}/kg
                </span>
                <span className="text-slate-400 font-bold text-[10px]">=</span>
                <span className="text-sm sm:text-base font-black text-slate-950 bg-[#40e0d0]/25 px-2 py-0.5 rounded-md border border-[#40e0d0]">
                  {formatPrice(Math.round(kgInputValue * kgModalItem.price))}
                </span>
              </div>
            </div>

            {/* FINISH SELECTION (if multiple available) */}
            {kgModalItem.availableFinishes && kgModalItem.availableFinishes.length > 1 && (
              <div className="flex items-center justify-between text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700">Conditionnement :</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setKgFinishChoice('plie')}
                    className={`px-2 py-0.5 rounded font-bold text-[10px] transition-colors ${
                      kgFinishChoice === 'plie'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Plié
                  </button>
                  <button
                    type="button"
                    onClick={() => setKgFinishChoice('cintre')}
                    className={`px-2 py-0.5 rounded font-bold text-[10px] transition-colors ${
                      kgFinishChoice === 'cintre'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Cintre
                  </button>
                </div>
              </div>
            )}

            {/* CONFIRMATION ACTION BUTTON */}
            <div className="pt-0.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setKgModalItem(null)}
                className="w-1/3 py-1.5 rounded-lg font-bold text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleConfirmKg}
                className="w-2/3 py-2 px-2 rounded-lg font-baloo font-bold text-xs text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Valider ({formatPrice(Math.round(kgInputValue * kgModalItem.price))})</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
