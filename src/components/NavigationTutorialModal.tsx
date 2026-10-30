import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DigiCleanLogo } from './DigiCleanLogo';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Scale, 
  Truck, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  Layers, 
  Store, 
  CheckCircle2, 
  X
} from 'lucide-react';

export const NavigationTutorialModal: React.FC = () => {
  const { tutorialOpen, closeTutorial, setCurrentView } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!tutorialOpen) return null;

  const totalSteps = 5;

  const stepsData = [
    {
      step: 1,
      badge: 'Bienvenue & Découverte',
      title: 'Bienvenue sur votre pressing connecté DIGICLEAN',
      subtitle: 'Plus besoin de vous déplacer au pressing : nous collectons et livrons votre linge propre et repassé chez vous à Dakar.',
      icon: Sparkles,
      iconBg: 'bg-[#40e0d0]/20 text-teal-900',
      highlights: [
        { label: 'Accueil centralisé', desc: 'Accès instantané à la commande, notifications et suivi en direct.' },
        { label: 'Disponibilité 7j/7', desc: 'Ateliers et chauffeurs actifs à Dakar de 07h à 21h.' },
        { label: 'Logo officiel', desc: 'Repérez toujours le logo DIGICLEAN officiel en haut à gauche pour revenir à l’accueil.' },
      ],
      previewGraphic: (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 shadow-inner space-y-1.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="text-[11px] font-bold text-[#40e0d0]">Accueil DIGICLEAN</span>
            <span className="text-[9px] bg-[#ffa45b]/20 text-[#ffa45b] px-1.5 py-0.5 rounded-full font-bold">Dakar 🇸🇳</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="bg-white/10 p-1.5 rounded-lg border border-white/10">
              <span className="text-[#40e0d0] font-bold block">1. Commander</span>
              <span className="text-slate-400 text-[9px]">Panier en 2 min</span>
            </div>
            <div className="bg-white/10 p-1.5 rounded-lg border border-white/10">
              <span className="text-[#ffa45b] font-bold block">2. Suivi en direct</span>
              <span className="text-slate-400 text-[9px]">Statut en temps réel</span>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 2,
      badge: 'Prestations & Calcul au Kilo',
      title: 'Sélectionnez vos articles & insérez vos kilos',
      subtitle: 'Pour le linge au poids, insérez ou choisissez vos kilos : le calcul se fait en FCFA !',
      icon: Scale,
      iconBg: 'bg-[#ffa45b]/25 text-amber-950',
      highlights: [
        { label: 'Formules au kg', desc: 'Lavage simple (300 F/kg), à sec (400 F/kg), repassage (1 000 F/kg), couettes.' },
        { label: 'Calcul direct', desc: 'Tapez vos kg ou cliquez sur 2 kg, 3 kg, 5 kg : le montant exact en FCFA s’affiche.' },
        { label: 'Soin à la pièce', desc: 'Costumes, tenues traditionnelles (boubous), sneakers et articles délicats.' },
      ],
      previewGraphic: (
        <div className="bg-linear-to-r from-teal-50 to-amber-50 p-2.5 rounded-xl border border-[#40e0d0] text-slate-900 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-teal-800">
            <span>Formule : Lavage simple</span>
            <span className="bg-[#40e0d0] text-slate-950 px-1.5 py-0.5 rounded text-[9px]">300 FCFA/kg</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 font-baloo text-sm font-bold bg-white p-1.5 rounded-lg border border-teal-200">
            <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">5 kg</span>
            <span className="text-slate-400">×</span>
            <span className="text-slate-700">300 FCFA</span>
            <span className="text-slate-400">=</span>
            <span className="text-teal-900 font-black text-sm bg-[#40e0d0]/20 px-2 py-0.5 rounded">1 500 FCFA</span>
          </div>
          <span className="text-[9px] text-slate-500 block text-center">Calcul automatique instantané.</span>
        </div>
      )
    },
    {
      step: 3,
      badge: 'Collecte & Récupération',
      title: 'Programmez votre collecte selon vos disponibilités',
      subtitle: 'Choisissez la collecte à domicile ou le retrait auprès d’une boutique DIGICLEAN.',
      icon: Truck,
      iconBg: 'bg-[#40e0d0]/20 text-teal-900',
      highlights: [
        { label: 'Collecte à domicile', desc: 'Passage à l’heure convenue avec un sac scellé sécurisé.' },
        { label: 'Créneaux flexibles 7j/7', desc: 'Matin, après-midi ou soirée selon votre emploi du temps.' },
        { label: 'Retrait boutique', desc: 'Gratuit dans nos agences de Dakar (Sacré-Cœur, Almadies, Plateau).' },
      ],
      previewGraphic: (
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-[#40e0d0] shadow-xs">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#40e0d0]" />
              <span className="font-bold text-slate-800 text-[11px]">Livraison à domicile</span>
            </div>
            <span className="text-[10px] font-bold text-teal-800">Offerte dès 15 000 FCFA</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px]">Retrait en boutique</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Gratuit</span>
          </div>
        </div>
      )
    },
    {
      step: 4,
      badge: 'Devis & Paiement',
      title: 'Estimation claire avant validation & Paiement sécurisé',
      subtitle: 'Zéro frais caché : visualisez le coût exact avant de confirmer.',
      icon: CreditCard,
      iconBg: 'bg-[#ffa45b]/25 text-amber-950',
      highlights: [
        { label: 'Transparence totale', desc: 'Détail de chaque article, frais de transport et remises promotionnelles.' },
        { label: 'Paiements faciles', desc: 'Réglez en toute sérénité par Wave, Orange Money, carte ou à la livraison.' },
        { label: 'Code promo', desc: 'Utilisez DIGISENEGAL pour profiter d’une remise immédiate.' },
      ],
      previewGraphic: (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
          <div className="flex justify-between text-slate-400">
            <span>Sous-total articles :</span>
            <span className="text-white font-bold">12 500 FCFA</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Collecte &amp; Livraison :</span>
            <span className="text-[#40e0d0] font-bold">Offerte</span>
          </div>
          <div className="pt-1 border-t border-slate-800 flex justify-between font-baloo text-sm font-bold">
            <span className="text-white">Total garanti :</span>
            <span className="text-[#40e0d0] text-sm font-black">12 500 FCFA</span>
          </div>
          <div className="pt-0.5 flex items-center justify-center gap-2 text-[9px] text-slate-400">
            <span>Wave</span> · <span>Orange Money</span> · <span>Espèces</span>
          </div>
        </div>
      )
    },
    {
      step: 5,
      badge: 'Suivi en Temps Réel',
      title: 'Suivez le parcours de votre linge en direct',
      subtitle: 'Visualisez l’évolution de chaque étape, de la collecte jusqu’au retour de vos vêtements.',
      icon: Clock,
      iconBg: 'bg-[#40e0d0]/20 text-teal-900',
      highlights: [
        { label: 'Timeline en direct', desc: 'Collecte effectuée, tri en atelier, lavage, repassage, contrôle.' },
        { label: 'Chauffeur dédié', desc: 'Coordonnées de votre livreur DIGICLEAN avec bouton d’appel.' },
        { label: 'Reçu numérique', desc: 'Facture et reçu détaillés disponibles en 1 clic.' },
      ],
      previewGraphic: (
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-800">Commande DC-8492 en cours</span>
          </div>
          <div className="flex items-center justify-between text-[10px] bg-white p-2 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-700">Atelier Sacré-Cœur :</span>
            <span className="font-bold text-teal-800">Lavage &amp; Repassage</span>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-500">
            <span>Chauffeur : Ibrahima Fall</span>
            <span className="text-teal-700 font-bold">Moto cargo #04</span>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = stepsData[currentStep - 1];
  const StepIcon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      closeTutorial();
      setCurrentView('home');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    closeTutorial();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-3 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-[390px] w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[78vh]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5">
            <DigiCleanLogo variant="horizontal" size="sm" />
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Tuto express
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            title="Fermer le tutoriel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar & Step Numbers */}
        <div className="px-3 py-1.5 bg-slate-50/70 border-b border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-teal-900">
              Étape {currentStep}/{totalSteps}
            </span>
            <span className="text-[9px] font-semibold text-slate-500 truncate max-w-[200px]">
              {currentStepData.badge}
            </span>
          </div>

          {/* Stepper track */}
          <div className="grid grid-cols-5 gap-1">
            {stepsData.map((s) => (
              <div
                key={s.step}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  s.step <= currentStep ? 'bg-[#40e0d0]' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3 sm:p-3.5 space-y-2.5 overflow-y-auto flex-1 text-xs">
          
          {/* Step Header */}
          <div className="flex items-start gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${currentStepData.iconBg}`}>
              <StepIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#ffa45b] block">
                Guide DIGICLEAN
              </span>
              <h2 className="font-baloo text-sm font-bold text-slate-900 leading-tight">
                {currentStepData.title}
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                {currentStepData.subtitle}
              </p>
            </div>
          </div>

          {/* Interactive Preview Mockup Graphic */}
          <div className="scale-95 origin-top -my-1">
            {currentStepData.previewGraphic}
          </div>

          {/* Bullet Point Highlights */}
          <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {currentStepData.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[10px] text-slate-700 leading-snug">
                <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold">{h.label} : </strong>
                  <span>{h.desc}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-2 sm:px-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleSkip}
            className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 transition-colors px-1 py-0.5"
          >
            Passer
          </button>

          <div className="flex items-center gap-1.5">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Retour</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1.5 rounded-lg font-baloo font-bold text-xs text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] active:scale-95 transition-all flex items-center gap-1 shadow-2xs"
            >
              <span>{currentStep === totalSteps ? 'Commencer' : 'Suivant'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
