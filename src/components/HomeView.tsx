import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES, CATALOG_ITEMS } from '../data/mockData';
import { formatPrice } from '../utils/format';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Calendar, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Info,
  Layers,
  Shirt,
  Award,
  Footprints,
  Home as HomeIcon,
  RefreshCw,
  Scale,
  Calculator,
  Check
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    setCurrentView, 
    activeOrder, 
    viewTrackingForOrder, 
    userProfile,
    setAuthModalOpen,
    startOrderWithItem
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interactive Simulator for services au kg
  const kgServices = CATALOG_ITEMS.filter(it => it.unit === 'kg');
  const [simServiceId, setSimServiceId] = useState<string>('lavage-simple-kg');
  const [simKg, setSimKg] = useState<number>(5);

  const activeSimService = kgServices.find(s => s.id === simServiceId) || kgServices[0];
  const simCalculatedTotal = Math.round(activeSimService.price * simKg);

  const filteredItems = selectedCategory === 'all' 
    ? CATALOG_ITEMS
    : CATALOG_ITEMS.filter(item => item.category === selectedCategory);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'lavage_kg': return Layers;
      case 'vetements': return Shirt;
      case 'maison': return HomeIcon;
      case 'chaussures_cuir': return Footprints;
      default: return Sparkles;
    }
  };

  const hasActiveOrder = activeOrder && activeOrder.status !== 'terminee' && activeOrder.status !== 'annulee';

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-xl">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_laundry_pressing_1791114898332.jpg"
            alt="Atelier de pressing haute qualité DIGICLEAN"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105 transition-transform duration-1000"
            onError={(e) => {
              // Graceful fallback if image is not reachable
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
          {/* Trust Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#ffa45b] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ffa45b] animate-ping" />
            <span>Service Premium de Pressing &amp; Blanchisserie</span>
          </div>

          <h1 className="font-baloo text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight text-balance">
            Le pressing sans bouger de chez vous.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            DIGICLEAN collecte votre linge directement à votre porte, lui apporte un soin d’atelier d’exception, et vous le rapporte frais, repassé et prêt à porter sous 48h.
          </p>

          {/* Value Props Inline */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-200">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#40e0d0]" />
              <span>Collecte &amp; Livraison à domicile</span>
            </div>
            <span className="text-slate-500">·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#ffa45b]" />
              <span>Créneaux ponctuels 7j/7</span>
            </div>
            <span className="text-slate-500">·</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#40e0d0]" />
              <span>Devis estimatif garanti</span>
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => {
                setCurrentView('new_order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-baloo font-bold text-base text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-lg shadow-teal-500/20 active:scale-98 transition-all"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Commander une prestation</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3.5 rounded-2xl font-medium text-sm text-slate-200 bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/20 transition-all text-center"
            >
              Consulter nos tarifs
            </button>
          </div>
        </div>
      </section>

      {/* 2. ACTIVE ORDER STATUS CARD (If user has an active order) */}
      {hasActiveOrder && (
        <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#40e0d0]/10 rounded-full blur-2xl -mr-10 -mt-10" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#40e0d0]/20 flex items-center justify-center text-teal-800 shrink-0">
                <RefreshCw className="w-6 h-6 animate-spin text-teal-700" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ffa45b]">
                    Commande en cours · {activeOrder.orderNumber}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <h3 className="font-baloo text-lg font-bold text-slate-900 mt-0.5">
                  {activeOrder.status === 'en_traitement' ? 'Linge en cours de traitement à l’atelier' :
                   activeOrder.status === 'collecte_programmee' ? 'Collecte programmée à votre domicile' :
                   activeOrder.status === 'collecte_en_cours' ? 'Chauffeur en route pour récupérer le linge' :
                   activeOrder.status === 'repassage_finition' ? 'Repassage & Contrôle qualité en cours' :
                   activeOrder.status === 'prete' ? 'Commande prête pour la livraison' :
                   activeOrder.status === 'en_livraison' ? 'En cours de livraison chez vous !' : 'Commande confirmée'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeOrder.recoveryMode === 'livraison' 
                    ? `Livraison estimée : ${activeOrder.deliveryDate} (${activeOrder.deliverySlot})`
                    : `Retrait prévu : ${activeOrder.pickupAgencyName || 'Atelier DIGICLEAN'}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => viewTrackingForOrder(activeOrder.id)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-baloo font-bold text-xs text-slate-900 bg-[#40e0d0] hover:bg-[#34cbbe] shadow-xs active:scale-98 transition-all shrink-0"
            >
              <span>Suivre ma commande en direct</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Micro Progress Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-[#40e0d0] to-[#ffa45b] rounded-full transition-all duration-500"
                style={{
                  width: activeOrder.status === 'confirmee' ? '15%' :
                         activeOrder.status === 'collecte_programmee' ? '30%' :
                         activeOrder.status === 'collecte_en_cours' ? '45%' :
                         activeOrder.status === 'en_traitement' ? '65%' :
                         activeOrder.status === 'repassage_finition' ? '80%' :
                         activeOrder.status === 'prete' || activeOrder.status === 'en_livraison' ? '92%' : '100%'
                }}
              />
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              Étape {activeOrder.status === 'confirmee' ? '1/6' :
                     activeOrder.status === 'collecte_programmee' ? '2/6' :
                     activeOrder.status === 'collecte_en_cours' ? '3/6' :
                     activeOrder.status === 'en_traitement' ? '4/6' :
                     activeOrder.status === 'repassage_finition' ? '5/6' : '6/6'}
            </span>
          </div>
        </section>
      )}

      {/* 3. COMMENT ÇA MARCHE (The 4 Steps of Digiclean) */}
      <section className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
            Simplicité &amp; Sérénité
          </span>
          <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Le parcours de votre linge en 4 étapes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Depuis votre smartphone jusqu’au retour de vos vêtements impeccables.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-[#40e0d0]/20 text-teal-900 font-baloo font-bold text-sm flex items-center justify-center">
                  01
                </span>
                <span className="text-[11px] font-bold text-slate-400">Étape</span>
              </div>
              <h3 className="font-baloo font-bold text-base text-slate-900">
                Vous commandez
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Sélectionnez vos pièces, consultez l’estimation claire des coûts et choisissez votre créneau de collecte.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-[#ffa45b]/30 text-amber-950 font-baloo font-bold text-sm flex items-center justify-center">
                  02
                </span>
                <span className="text-[11px] font-bold text-slate-400">Étape</span>
              </div>
              <h3 className="font-baloo font-bold text-base text-slate-900">
                Collecte à domicile
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Notre chauffeur DIGICLEAN passe à l’heure convenue et récupère votre linge dans un sac sécurisé.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-[#40e0d0]/20 text-teal-900 font-baloo font-bold text-sm flex items-center justify-center">
                  03
                </span>
                <span className="text-[11px] font-bold text-slate-400">Étape</span>
              </div>
              <h3 className="font-baloo font-bold text-base text-slate-900">
                Soin d’atelier expert
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Aquanettoyage éco-responsable, détachage ciblé, repassage à la main et contrôle qualité minutieux.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-full bg-[#ffa45b]/30 text-amber-950 font-baloo font-bold text-sm flex items-center justify-center">
                  04
                </span>
                <span className="text-[11px] font-bold text-slate-400">Étape</span>
              </div>
              <h3 className="font-baloo font-bold text-base text-slate-900">
                Retour prêt à porter
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Livraison soignée sur cintre ou plié selon vos vœux, ou retrait sans frais en point pressing DIGICLEAN.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SIMULATEUR DE LAVAGE AU KILO (Calcul automatique transparent) */}
      <section className="bg-linear-to-br from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-teal-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#40e0d0]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#40e0d0]/20 text-[#40e0d0] text-xs font-bold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Simulateur &amp; Calcul Automatique au Kg</span>
            </div>
            <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-white">
              Estimez le coût de votre linge au kilo en 1 clic
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Choisissez votre formule de lavage, insérez ou choisissez le nombre de kg, et DIGICLEAN calcule automatiquement le montant exact avant commande.
            </p>
          </div>

          {/* Formules au kg pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              1. Choisissez la formule au kilo :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {kgServices.map(s => {
                const isSelected = s.id === simServiceId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSimServiceId(s.id)}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-[#40e0d0] text-slate-950 border-[#40e0d0] shadow-md font-bold'
                        : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                    }`}
                  >
                    <div className="text-xs font-baloo leading-snug">{s.name}</div>
                    <div className={`text-[11px] mt-1 ${isSelected ? 'text-slate-900 font-extrabold' : 'text-teal-300'}`}>
                      {formatPrice(s.price)} / kg
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weight Selection (Saisie ou Choix direct des kg) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              2. Insérez ou choisissez le nombre de kg à laver :
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Numeric input with steppers */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-1.5 rounded-2xl border border-white/20 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={() => setSimKg(prev => Math.max(0.5, Math.round((prev - 0.5) * 10) / 10))}
                  className="w-10 h-10 rounded-xl bg-white/20 text-white font-bold flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all"
                >
                  - 0.5
                </button>

                <div className="relative flex items-center px-2">
                  <input
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={simKg}
                    onChange={(e) => setSimKg(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    className="w-20 text-center text-2xl font-baloo font-black text-white bg-transparent focus:outline-none"
                  />
                  <span className="font-baloo font-bold text-slate-300 text-sm">kg</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSimKg(prev => Math.round((prev + 0.5) * 10) / 10)}
                  className="w-10 h-10 rounded-xl bg-[#40e0d0] text-slate-950 font-bold flex items-center justify-center hover:bg-[#32c4b5] active:scale-95 transition-all"
                >
                  + 0.5
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[2, 3, 5, 7, 10, 15].map(kg => (
                  <button
                    key={kg}
                    onClick={() => setSimKg(kg)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      simKg === kg
                        ? 'bg-[#40e0d0] text-slate-950 border-[#40e0d0]'
                        : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                    }`}
                  >
                    {kg} kg
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Calculation Result Bar & CTA */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffa45b] block">
                Calcul automatique instantané :
              </span>
              <div className="flex items-baseline gap-2 font-baloo flex-wrap justify-center sm:justify-start">
                <span className="text-lg text-slate-300 font-bold">{simKg} kg</span>
                <span className="text-slate-400 font-bold">×</span>
                <span className="text-lg text-slate-300 font-bold">{formatPrice(activeSimService.price)}/kg</span>
                <span className="text-slate-400 font-bold">=</span>
                <span className="text-3xl font-black text-[#40e0d0]">
                  {formatPrice(simCalculatedTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => startOrderWithItem(activeSimService, simKg, 'plie')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-baloo font-bold text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Commander avec ce poids</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. PRESTATIONS & TARIFS CLAIRS (Interactive Catalogue Section) */}
      <section id="catalog-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Catalogue &amp; Tarifs
            </span>
            <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Des tarifs transparents, sans surprise
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Tous nos prix comprennent le diagnostic des fibres, le détachage et le repassage soigné.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('new_order');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-baloo font-bold text-xs text-slate-900 bg-[#40e0d0] hover:bg-[#32c4b5] transition-all shadow-xs"
          >
            <span>Créer une commande</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filters (Horizontal scroll on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tous les services ({CATALOG_ITEMS.length})
          </button>

          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isCatActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Catalog Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isKg = item.unit === 'kg';
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-[#40e0d0]/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-baloo font-bold text-base text-slate-900 group-hover:text-teal-900 transition-colors">
                        {item.name}
                      </h3>
                      {isKg && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#40e0d0]/20 text-teal-950 px-2 py-0.5 rounded-md mt-1">
                          <Scale className="w-3 h-3 text-teal-700" />
                          <span>Tarif au kg</span>
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-baloo text-base sm:text-lg font-black text-slate-900">
                        {formatPrice(item.price)}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-medium">
                        /{item.unit}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Délai standard {item.turnaroundHours}h</span>
                  </div>

                  <button
                    onClick={() => {
                      if (isKg) {
                        startOrderWithItem(item, 5, 'plie');
                      } else {
                        startOrderWithItem(item, 1, (item.availableFinishes?.[0] || 'cintre') as any);
                      }
                    }}
                    className="font-baloo font-bold text-xs text-slate-950 bg-slate-100 hover:bg-[#40e0d0] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                  >
                    <span>{isKg ? 'Choisir les kg' : 'Ajouter'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. QUALITY & ECO COMMITMENT BANNER */}
      <section className="bg-linear-to-r from-teal-50 via-white to-amber-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#40e0d0]/30 text-teal-950 font-bold text-xs">
              Éco-responsable
            </span>
            <span className="text-xs text-slate-500">· 100% Aquanettoyage biodégradable</span>
          </div>
          <h3 className="font-baloo text-xl sm:text-2xl font-extrabold text-slate-900">
            Un soin doux pour vos vêtements et pour la planète
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Nous n’utilisons aucun perchloroéthylène ni solvant agressif. Nos détergents certifiés Écolabel respectent les peaux les plus sensibles et préservent la texture originale de vos soies, lins et lainages.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs text-center">
            <span className="font-baloo text-2xl font-black text-slate-900 block">4.9 / 5</span>
            <span className="text-[11px] text-slate-500 font-medium">Avis clients vérifiés</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs text-center">
            <span className="font-baloo text-2xl font-black text-[#ffa45b] block">25 000+</span>
            <span className="text-[11px] text-slate-500 font-medium">Articles traités</span>
          </div>
        </div>
      </section>

    </div>
  );
};
