import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DigiCleanLogo } from './DigiCleanLogo';
import { X, Mail, Lock, User, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    userProfile, 
    register,
    login 
  } = useApp();

  const [formData, setFormData] = useState({
    firstName: userProfile.firstName || userProfile.name.split(' ')[0] || '',
    lastName: userProfile.lastName || userProfile.name.split(' ').slice(1).join(' ') || '',
    email: userProfile.email || '',
    phone: userProfile.phone || '',
    password: '',
    street: userProfile.addresses[0]?.street || 'Villa 42, Cité Sacré-Cœur 3 VDN',
    city: userProfile.addresses[0]?.city || 'Dakar',
    postalCode: userProfile.addresses[0]?.postalCode || '10000',
    details: userProfile.addresses[0]?.details || '',
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      register({
        firstName: formData.firstName || 'Client',
        lastName: formData.lastName || 'DIGICLEAN',
        phone: formData.phone,
        address: formData.street,
        email: formData.email,
        password: formData.password
      });
    } else {
      login(formData.phone, formData.password);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setAuthModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-[360px] w-full overflow-hidden border border-slate-100 max-h-[82vh] overflow-y-auto">
        
        {/* Modal Header with Close Button */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100">
          <DigiCleanLogo variant="horizontal" size="sm" />
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-3.5 pt-2.5">
          <div className="grid grid-cols-2 p-0.5 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-1 text-[11px] font-bold rounded-md transition-all ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`py-1 text-[11px] font-bold rounded-md transition-all ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Créer un compte
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-3.5 space-y-2">
          {isSuccess ? (
            <div className="py-6 text-center flex flex-col items-center justify-center animate-in zoom-in-95">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
                <CheckCircle2 className="w-6 h-6 text-[#40e0d0]" />
              </div>
              <h3 className="font-baloo text-base font-bold text-slate-900">
                {authMode === 'login' ? 'Connexion réussie !' : 'Compte créé avec succès !'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Bienvenue sur votre pressing DIGICLEAN.</p>
            </div>
          ) : (
            <>
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Cheikh"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#40e0d0] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Nom
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ndiaye"
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#40e0d0] outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="cheikh.ndiaye@example.sn"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#40e0d0] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Téléphone (Orange Money / Wave)
                </label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 642 19 88"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#40e0d0] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#40e0d0] outline-none"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div className="pt-1.5 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Adresse de collecte à Dakar
                  </span>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Sacré-Cœur 3 VDN, Villa 42"
                      value={formData.street}
                      onChange={e => setFormData({ ...formData, street: e.target.value })}
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#40e0d0] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Code (10000)"
                      value={formData.postalCode}
                      onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#40e0d0] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Ville (Dakar)"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#40e0d0] outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-lg font-baloo font-bold text-sm text-slate-900 bg-[#40e0d0] hover:bg-[#34cebe] shadow-xs transition-all active:scale-98"
              >
                {authMode === 'login' ? 'Se connecter' : 'Valider mon inscription'}
              </button>
            </>
          )}
        </form>

        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-500">
            {authMode === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-teal-700 hover:underline"
                >
                  S’inscrire gratuitement
                </button>
              </>
            ) : (
              <>
                Déjà inscrit ?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
};
