import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DigiCleanLogo } from './DigiCleanLogo';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { register, login, authMode, setAuthMode, userProfile } = useApp();

  const [mode, setMode] = useState<'register' | 'login'>(authMode || 'register');

  // Registration Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+221 77 642 19 88');
  const [address, setAddress] = useState('Villa 42, Cité Sacré-Cœur 3 VDN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Login Form State
  const [loginPhone, setLoginPhone] = useState(userProfile.phone || '+221 77 642 19 88');
  const [loginPassword, setLoginPassword] = useState('123456');

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Veuillez renseigner votre prénom et votre nom.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Veuillez saisir votre numéro de téléphone pour organiser la collecte.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Le mot de passe doit comporter au moins 4 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Veuillez accepter les conditions d’utilisation de DIGICLEAN.');
      return;
    }

    register({
      firstName,
      lastName,
      phone,
      address,
      email,
      password
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginPhone.trim()) {
      setErrorMessage('Veuillez saisir votre numéro de téléphone.');
      return;
    }

    login(loginPhone, loginPassword);
  };

  const handleDemoQuickAccess = () => {
    register({
      firstName: 'Cheikh',
      lastName: 'Ndiaye',
      phone: '+221 77 642 19 88',
      address: 'Villa 42, Cité Sacré-Cœur 3 VDN',
      email: 'cheikh.ndiaye@example.sn',
      password: 'demo'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#40e0d0]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mt-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ffa45b]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20" />

      {/* Top Navbar with mandatory logo */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-5 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <DigiCleanLogo variant="horizontal" size="md" />
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Service actif à Dakar 7j/7</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand Story & Value Props (5 cols) */}
          <div className="lg:col-span-5 text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffa45b]/20 text-[#ffa45b] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pressing &amp; Blanchisserie à domicile</span>
            </div>

            <h1 className="font-baloo text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
              Votre linge impeccable sans vous déplacer.
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Pour accéder aux services DIGICLEAN, inscrivez-vous en 1 minute. Notre équipe prend en charge vos vêtements directement à votre porte partout à Dakar.
            </p>

            {/* 4 Pillars of DIGICLEAN */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-[#40e0d0]/20 text-[#40e0d0] flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-bold">Collecte &amp; Livraison à domicile</strong>
                  <span>Créneaux ponctuels à votre porte selon vos disponibilités.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-[#ffa45b]/20 text-[#ffa45b] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-bold">Estimation transparente &amp; Au kilo</strong>
                  <span>Calcul automatique immédiat en FCFA, aucun coût caché.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-lg bg-[#40e0d0]/20 text-[#40e0d0] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-bold">Suivi en direct étape par étape</strong>
                  <span>Visibilité complète de l'atelier jusqu'au retour de vos vêtements.</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDemoQuickAccess}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <span>Accès rapide démo (Cheikh Ndiaye)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#40e0d0]" />
              </button>
            </div>
          </div>

          {/* Right Column: Registration / Login Card (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6">
              
              {/* Mode Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className={`py-2.5 text-xs sm:text-sm font-baloo font-bold rounded-xl transition-all ${
                    mode === 'register'
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1. Créer un compte (Inscription)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className={`py-2.5 text-xs sm:text-sm font-baloo font-bold rounded-xl transition-all ${
                    mode === 'login'
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2. Se connecter
                </button>
              </div>

              {/* Error banner if any */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ====================================================== */}
              {/* REGISTRATION FORM */}
              {/* ====================================================== */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h2 className="font-baloo text-xl font-black text-slate-900">
                      Inscription DIGICLEAN
                    </h2>
                    <p className="text-xs text-slate-500">
                      Renseignez vos coordonnées pour permettre la collecte de votre linge à Dakar.
                    </p>
                  </div>

                  {/* Prénom & Nom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prénom <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: Cheikh"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] focus:ring-2 focus:ring-[#40e0d0]/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nom de famille <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Ndiaye"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] focus:ring-2 focus:ring-[#40e0d0]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Numéro de téléphone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Numéro de téléphone portable (Sénégal) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 text-slate-400 pointer-events-none">
                        <Phone className="w-4 h-4" />
                        <span className="text-xs font-bold text-slate-600">🇸🇳</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="+221 77 642 19 88"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full pl-16 pr-3 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] focus:ring-2 focus:ring-[#40e0d0]/20 outline-none transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Utilisé par le chauffeur pour coordonner la collecte et pour les paiements Wave / Orange Money.
                    </span>
                  </div>

                  {/* Adresse / Quartier */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Adresse principale de collecte à Dakar <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Villa 42, Cité Sacré-Cœur 3 VDN, Dakar"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] focus:ring-2 focus:ring-[#40e0d0]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email optionnel */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Adresse e-mail (optionnelle pour les reçus numériques)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="cheikh.ndiaye@example.sn"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Mot de passe & Confirmation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Créer un mot de passe <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirmer le mot de passe <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Conditions */}
                  <label className="flex items-start gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="text-[11px] text-slate-500">
                      J’accepte les conditions de collecte à domicile et le diagnostic soigné des fibres DIGICLEAN.
                    </span>
                  </label>

                  {/* Bouton d'action principale : Bleu turquoise */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl font-baloo font-black text-base text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-lg shadow-teal-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <span>S’inscrire &amp; Découvrir l’application</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* ====================================================== */}
              {/* LOGIN FORM */}
              {/* ====================================================== */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h2 className="font-baloo text-xl font-black text-slate-900">
                      Connexion à votre espace
                    </h2>
                    <p className="text-xs text-slate-500">
                      Accédez à vos commandes en cours, votre historique et vos adresses de collecte.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Numéro de téléphone portable
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+221 77 642 19 88"
                        value={loginPhone}
                        onChange={e => setLoginPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#40e0d0] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Bouton d'action principale : Bleu turquoise */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl font-baloo font-black text-base text-slate-950 bg-[#40e0d0] hover:bg-[#32c4b5] shadow-lg shadow-teal-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Se connecter</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Bottom Switcher */}
              <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
                {mode === 'register' ? (
                  <p>
                    Vous possédez déjà un compte DIGICLEAN ?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-bold text-teal-800 hover:underline"
                    >
                      Se connecter
                    </button>
                  </p>
                ) : (
                  <p>
                    Nouveau chez DIGICLEAN ?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="font-bold text-teal-800 hover:underline"
                    >
                      Créer mon compte maintenant
                    </button>
                  </p>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 sm:px-8 py-4 border-t border-slate-900 bg-slate-950/80 text-center text-[11px] text-slate-500">
        <span>DIGICLEAN Sénégal · Pressing &amp; Blanchisserie haut de gamme avec collecte à domicile · Dakar</span>
      </footer>
    </div>
  );
};
