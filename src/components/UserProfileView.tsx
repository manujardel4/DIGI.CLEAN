import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddressInfo, GarmentPreferences } from '../types';
import { 
  User, 
  MapPin, 
  Sparkles, 
  Phone, 
  Mail, 
  CreditCard, 
  Award, 
  Plus, 
  Check, 
  Edit3, 
  Trash2,
  ShieldCheck,
  LogOut,
  Save
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { userProfile, setUserProfile, setAuthModalOpen, openTutorial, logout } = useApp();

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
  });

  const [preferences, setPreferences] = useState<GarmentPreferences>(userProfile.defaultPreferences);
  const [prefSavedMessage, setPrefSavedMessage] = useState(false);

  // Address modal or editing
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<AddressInfo>({
    id: '',
    label: 'Bureau',
    street: '',
    city: 'Dakar',
    postalCode: '10200',
    details: '',
    phone: userProfile.phone,
  });

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    }));
    setIsEditingInfo(false);
  };

  const handleSavePreferences = () => {
    setUserProfile(prev => ({
      ...prev,
      defaultPreferences: preferences,
    }));
    setPrefSavedMessage(true);
    setTimeout(() => setPrefSavedMessage(false), 2000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street) return;

    const fullAddr: AddressInfo = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };

    setUserProfile(prev => ({
      ...prev,
      addresses: [...prev.addresses, fullAddr],
    }));

    setShowAddAddress(false);
    setNewAddr({
      id: '',
      label: 'Autre',
      street: '',
      city: 'Dakar',
      postalCode: '10000',
      details: '',
      phone: userProfile.phone,
    });
  };

  const handleDeleteAddress = (id: string) => {
    if (userProfile.addresses.length <= 1) return; // Keep at least one
    setUserProfile(prev => ({
      ...prev,
      addresses: prev.addresses.filter(a => a.id !== id),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#40e0d0]/20 border-2 border-[#40e0d0]/40 flex items-center justify-center font-baloo font-bold text-2xl text-teal-900">
            {userProfile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-baloo text-2xl font-bold text-slate-900">
                {userProfile.name}
              </h1>
              <span className="text-[10px] font-bold bg-[#ffa45b]/20 text-amber-950 px-2 py-0.5 rounded-full">
                Membre Privilège
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Client DIGICLEAN depuis {userProfile.memberSince} · {userProfile.email}
            </p>
          </div>
        </div>

        {/* Loyalty Points Capsule */}
        <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 text-center w-full sm:w-auto">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>DIGICLEAN Club</span>
          </div>
          <span className="font-baloo text-2xl font-black text-slate-900 block mt-0.5">
            {userProfile.loyaltyPoints} pts
          </span>
          <span className="text-[10px] text-teal-800 font-bold block">
            Prochaine remise : 5 000 FCFA à 500 pts
          </span>
        </div>
      </div>

      {/* Grid: Personal Info & Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-baloo text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-700" />
              <span>Coordonnées</span>
            </h3>
            {!isEditingInfo ? (
              <button
                onClick={() => setIsEditingInfo(true)}
                className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingInfo(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Annuler
              </button>
            )}
          </div>

          {!isEditingInfo ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-600">
                <User className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-800">{userProfile.name}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{userProfile.phone}</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Votre numéro de téléphone est utilisé par nos chauffeurs pour vous prévenir 15 minutes avant la collecte.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSaveInfo} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#40e0d0]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Adresse e-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#40e0d0]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Téléphone mobile</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#40e0d0]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-baloo font-bold text-xs text-slate-900 bg-[#40e0d0] hover:bg-[#32c4b5] transition-all"
              >
                Enregistrer mes coordonnées
              </button>
            </form>
          )}
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-baloo text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-700" />
              <span>Adresses de collecte</span>
            </h3>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </button>
          </div>

          {/* List of addresses */}
          <div className="space-y-3">
            {userProfile.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{addr.label}</span>
                  <p className="text-slate-700 font-medium mt-0.5">{addr.street}</p>
                  <p className="text-[11px] text-slate-400">{addr.postalCode} {addr.city}</p>
                  {addr.details && (
                    <p className="text-[10px] text-slate-500 mt-1 italic">{addr.details}</p>
                  )}
                </div>

                {userProfile.addresses.length > 1 && (
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Address Mini Form */}
          {showAddAddress && (
            <form onSubmit={handleAddAddress} className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Libellé (ex: Bureau, Maison)"
                  value={newAddr.label}
                  onChange={e => setNewAddr({ ...newAddr, label: e.target.value })}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Code postal (75008)"
                  value={newAddr.postalCode}
                  onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Rue et numéro (ex: 25 Rue de la Paix)"
                value={newAddr.street}
                onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                required
              />
              <input
                type="text"
                placeholder="Consignes (digicode, sonnette, étage)"
                value={newAddr.details}
                onChange={e => setNewAddr({ ...newAddr, details: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg font-bold text-xs bg-slate-900 text-white hover:bg-slate-800"
                >
                  Ajouter l’adresse
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-100"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* Garment Care Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-baloo text-xl font-bold text-slate-900">
              Préférences par défaut de vos soins linge
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ces consignes seront automatiquement appliquées à chacune de vos nouvelles commandes.
            </p>
          </div>

          <button
            onClick={handleSavePreferences}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-baloo font-bold text-xs text-slate-900 bg-[#40e0d0] hover:bg-[#32c4b5] transition-all shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer</span>
          </button>
        </div>

        {prefSavedMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Préférences enregistrées avec succès !</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Type de Détergent</label>
            <select
              value={preferences.detergentType}
              onChange={e => setPreferences({ ...preferences, detergentType: e.target.value as any })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
            >
              <option value="bio_ecologique">Bio Écologique (100% végétal)</option>
              <option value="hypoallergenique">Hypoallergénique (Peaux sensibles)</option>
              <option value="standard">Standard d’atelier</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Parfum délicat</label>
            <select
              value={preferences.scent}
              onChange={e => setPreferences({ ...preferences, scent: e.target.value as any })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
            >
              <option value="fleur_coton">Fleur de Coton</option>
              <option value="lavande_douce">Lavande Douce</option>
              <option value="neutre">Sans parfum (Neutre)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Finition chemises &amp; hauts</label>
            <select
              value={preferences.finishPreference}
              onChange={e => setPreferences({ ...preferences, finishPreference: e.target.value as any })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
            >
              <option value="cintre">Sur cintre recyclé DIGICLEAN</option>
              <option value="plie">Plié sous film protecteur</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Niveau d’Amidon</label>
            <select
              value={preferences.starchLevel}
              onChange={e => setPreferences({ ...preferences, starchLevel: e.target.value as any })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
            >
              <option value="leger">Léger (sur cols et poignets)</option>
              <option value="aucun">Aucun amidon</option>
              <option value="moyen">Moyen (tenue impeccable)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Account actions: Tutorial guide & logout */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={openTutorial}
          className="flex items-center gap-2 text-xs font-bold text-teal-800 bg-[#40e0d0]/20 hover:bg-[#40e0d0]/30 px-4 py-2.5 rounded-xl transition-all"
        >
          <Sparkles className="w-4 h-4 text-teal-700" />
          <span>Revoir le tutoriel de navigation de la plateforme</span>
        </button>

        <button
          onClick={logout}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Se déconnecter</span>
        </button>
      </div>

    </div>
  );
};
