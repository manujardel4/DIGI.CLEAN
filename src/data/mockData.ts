import { ServiceItem, Order, UserProfile, NotificationItem } from '../types';

export const SERVICE_CATEGORIES = [
  { id: 'lavage_kg', label: 'Lavage & Pressing au kg', icon: 'Layers', color: '#40e0d0', desc: 'Formules au kilo : simple, à sec ou avec repassage' },
  { id: 'vetements', label: 'Costumes, Vêtements & Détachage', icon: 'Shirt', color: '#ffa45b', desc: 'Costumes, tailleurs, vêtements traditionnels et détachage expert' },
  { id: 'maison', label: 'Couettes, Rideaux & Tapis', icon: 'Home', color: '#40e0d0', desc: 'Entretien des couettes, draperies, tapis et moquettes' },
  { id: 'chaussures_cuir', label: 'Chaussures, Cuir & Daim', icon: 'Footprints', color: '#ffa45b', desc: 'Soin des chaussures, sneakers blanches, cuir et daim' },
] as const;

export const CATALOG_ITEMS: ServiceItem[] = [
  // 1. Lavage simple au kg
  {
    id: 'lavage-simple-kg',
    name: 'Lavage simple au kg',
    category: 'lavage_kg',
    price: 300,
    unit: 'kg',
    turnaroundHours: 48,
    popular: true,
    description: 'Lavage délicat à l’eau avec détergents doux, séchage et pliage soigné',
    iconName: 'Layers',
    availableFinishes: ['plie'],
  },
  // 2. Lavage à sec au kg
  {
    id: 'lavage-sec-kg',
    name: 'Lavage à sec au kg',
    category: 'lavage_kg',
    price: 400,
    unit: 'kg',
    turnaroundHours: 48,
    popular: true,
    description: 'Nettoyage à sec professionnel préservant la texture et les couleurs des textiles',
    iconName: 'Shield',
    availableFinishes: ['plie', 'cintre'],
  },
  // 3. Lavage à sec + Repassage au kg
  {
    id: 'lavage-sec-repassage-kg',
    name: 'Lavage à sec + Repassage au kg',
    category: 'lavage_kg',
    price: 1000,
    unit: 'kg',
    turnaroundHours: 48,
    popular: true,
    description: 'Nettoyage à sec intégral suivi d’un repassage artisanal soigné sous housse',
    iconName: 'Sparkles',
    availableFinishes: ['cintre', 'plie'],
  },
  // 4. Détachage spécifique
  {
    id: 'detachage-specifique',
    name: 'Détachage spécifique',
    category: 'vetements',
    price: 2000,
    unit: 'pièce',
    turnaroundHours: 48,
    popular: false,
    description: 'Traitement ciblé des taches tenaces (graisse, vin, encre, cambouis) sans altérer la fibre',
    iconName: 'Sparkles',
    availableFinishes: ['cintre', 'plie'],
  },
  // 5. Entretiens costumes et tailleurs
  {
    id: 'entretiens-costumes-tailleurs',
    name: 'Entretiens costumes et tailleurs',
    category: 'vetements',
    price: 5500,
    unit: 'pièce / ensemble',
    turnaroundHours: 48,
    popular: true,
    description: 'Nettoyage complet haute précision, défroissage vapeur et maintien du tombé sur cintre',
    iconName: 'Award',
    availableFinishes: ['cintre'],
  },
  // 6. Entretiens rideaux et draperies au kg
  {
    id: 'entretiens-rideaux-draperies-kg',
    name: 'Entretiens rideaux et draperies au kg',
    category: 'maison',
    price: 1000,
    unit: 'kg',
    turnaroundHours: 72,
    popular: false,
    description: 'Dépoussiérage, désinfection antibactérienne et lissage délicat pour rideaux et tentures',
    iconName: 'Columns',
    availableFinishes: ['cintre', 'plie'],
  },
  // 7. Nettoyage tapis et moquettes
  {
    id: 'nettoyage-tapis-moquettes',
    name: 'Nettoyage tapis et moquettes',
    category: 'maison',
    price: 5000,
    unit: 'pièce',
    turnaroundHours: 72,
    popular: true,
    description: 'Nettoyage en profondeur des fibres, élimination des acariens et ravivage des motifs',
    iconName: 'Home',
    availableFinishes: ['plie'],
  },
  // 8. Entretien couvertures et couettes au kg
  {
    id: 'entretien-couvertures-couettes-kg',
    name: 'Entretien couvertures et couettes au kg',
    category: 'maison',
    price: 1500,
    unit: 'kg',
    turnaroundHours: 72,
    popular: true,
    description: 'Lavage grand volume thermo-régulé, traitement hygiène et séchage volumateur',
    iconName: 'Cloud',
    availableFinishes: ['plie'],
  },
  // 9. Nettoyage vêtements traditionnels
  {
    id: 'nettoyage-vetements-traditionnels',
    name: 'Nettoyage vêtements traditionnels',
    category: 'vetements',
    price: 5000,
    unit: 'tenue',
    turnaroundHours: 48,
    popular: true,
    description: 'Soin spécialisé pour boubous en bazin riche, wax, broderies fines et tenues de cérémonie',
    iconName: 'Award',
    availableFinishes: ['cintre', 'plie'],
  },
  // 10. Nettoyages articles en cuir et daim au kg
  {
    id: 'nettoyages-cuir-daim-kg',
    name: 'Nettoyages articles en cuir et daim au kg',
    category: 'chaussures_cuir',
    price: 2000,
    unit: 'kg',
    turnaroundHours: 96,
    popular: false,
    description: 'Nourrissage du cuir, brossage du daim, imperméabilisation et protection durable',
    iconName: 'ShieldCheck',
    availableFinishes: ['cintre', 'plie'],
  },
  // 11. Entretien chaussures blanches
  {
    id: 'entretien-chaussures-blanches',
    name: 'Entretien chaussures blanches',
    category: 'chaussures_cuir',
    price: 2500,
    unit: 'paire',
    turnaroundHours: 48,
    popular: true,
    description: 'Blanchiment approfondi des semelles, empeignes, lacets et traitement désodorisant',
    iconName: 'Footprints',
    availableFinishes: ['plie'],
  },
  // 12. Entretien chaussures
  {
    id: 'entretien-chaussures',
    name: 'Entretien chaussures',
    category: 'chaussures_cuir',
    price: 1500,
    unit: 'paire',
    turnaroundHours: 48,
    popular: true,
    description: 'Nettoyage, cirage, lustrage et imperméabilisation de vos chaussures de ville ou baskets',
    iconName: 'Footprints',
    availableFinishes: ['plie'],
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Cheikh Ndiaye',
  email: 'cheikh.ndiaye@example.sn',
  phone: '+221 77 642 19 88',
  memberSince: 'Mars 2025',
  loyaltyPoints: 340,
  addresses: [
    {
      id: 'addr-1',
      label: 'Domicile',
      street: 'Villa 42, Cité Sacré-Cœur 3 VDN',
      city: 'Dakar',
      postalCode: '10000',
      details: 'En face de la boulangerie jaune, sonnette Ndiaye',
      phone: '+221 77 642 19 88',
    },
    {
      id: 'addr-2',
      label: 'Bureau',
      street: 'Immeuble Horizon, Route des Almadies',
      city: 'Dakar',
      postalCode: '10200',
      details: '2ème étage, Bureau 204',
      phone: '+221 77 642 19 88',
    }
  ],
  defaultPreferences: {
    detergentType: 'bio_ecologique',
    scent: 'fleur_coton',
    finishPreference: 'cintre',
    starchLevel: 'leger',
  }
};

export const DIGICLEAN_AGENCIES = [
  {
    id: 'agency-sacre-coeur',
    name: 'DIGICLEAN - Hub Central VDN (Sacré-Cœur)',
    address: 'Voie de Dégagement Nord (VDN), Sacré-Cœur 3, Dakar',
    openingHours: 'Lun-Sam : 07h30 - 20h30',
    phone: '+221 33 825 40 40',
    distance: '900 m de votre position',
  },
  {
    id: 'agency-almadies',
    name: 'DIGICLEAN - Boutique Almadies',
    address: 'Route des Almadies, en face King Fahd Palace, Dakar',
    openingHours: 'Lun-Sam : 08h00 - 21h00',
    phone: '+221 33 860 12 12',
    distance: '3.5 km',
  },
  {
    id: 'agency-plateau',
    name: 'DIGICLEAN - Point Relais Plateau',
    address: 'Avenue Georges Pompidou / Ponty, Dakar Plateau',
    openingHours: 'Lun-Ven : 08h00 - 19h30, Sam : 08h30 - 18h00',
    phone: '+221 33 821 77 88',
    distance: '4.8 km',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'DC-8492',
    createdAt: '2026-10-03T14:30:00Z',
    clientName: 'Cheikh Ndiaye',
    clientPhone: '+221 77 642 19 88',
    clientEmail: 'cheikh.ndiaye@example.sn',
    address: {
      id: 'addr-1',
      label: 'Domicile',
      street: 'Villa 42, Cité Sacré-Cœur 3 VDN',
      city: 'Dakar',
      postalCode: '10000',
      details: 'En face de la boulangerie jaune',
      phone: '+221 77 642 19 88',
    },
    recoveryMode: 'livraison',
    pickupDate: 'Aujourd’hui',
    pickupSlot: '10h00 - 12h00',
    deliveryDate: 'Demain',
    deliverySlot: '18h00 - 20h00',
    items: [
      {
        item: CATALOG_ITEMS[8], // Nettoyage vêtements traditionnels (5 000 FCFA)
        quantity: 1,
        finishType: 'cintre',
        specialInstructions: 'Amidon léger sur le col du grand boubou'
      },
      {
        item: CATALOG_ITEMS[2], // Lavage à sec + Repassage au kg (1 000 FCFA)
        quantity: 5,
        finishType: 'cintre',
      },
      {
        item: CATALOG_ITEMS[10], // Entretien chaussures blanches (2 500 FCFA)
        quantity: 1,
        finishType: 'plie',
      }
    ],
    subtotal: 12500,
    deliveryFee: 1500,
    discount: 1500,
    promoCode: 'DIGISENEGAL',
    total: 12500,
    paymentMethod: 'mobile_money',
    paymentStatus: 'paye',
    status: 'en_traitement',
    driver: {
      name: 'Ibrahima Fall',
      phone: '+221 77 555 43 21',
      vehicle: 'Moto-cargo électrique DIGICLEAN #04',
      eta: 'Livraison prévue demain entre 18h et 20h',
    },
    notes: 'Sonner chez Ndiaye ou appeler à l’arrivée',
    internalStaffNotes: 'Boubou traditionnel traité avec soin, chaussures blanches nettoyées',
    preferences: {
      detergentType: 'bio_ecologique',
      scent: 'fleur_coton',
      finishPreference: 'cintre',
      starchLevel: 'leger',
    },
    history: [
      { status: 'confirmee', timestamp: 'Hier, 14:30', note: 'Commande validée et payée via Wave' },
      { status: 'collecte_programmee', timestamp: 'Hier, 15:00', note: 'Collecte assignée au livreur Ibrahima' },
      { status: 'collecte_en_cours', timestamp: 'Aujourd’hui, 10:15', note: 'Chauffeur en route vers Sacré-Cœur 3' },
      { status: 'en_traitement', timestamp: 'Aujourd’hui, 11:45', note: 'Linge arrivé à l’atelier DIGICLEAN Sacré-Cœur, tri et nettoyage en cours' }
    ]
  },
  {
    id: 'ord-100',
    orderNumber: 'DC-8210',
    createdAt: '2026-09-27T09:15:00Z',
    clientName: 'Cheikh Ndiaye',
    clientPhone: '+221 77 642 19 88',
    clientEmail: 'cheikh.ndiaye@example.sn',
    address: {
      id: 'addr-1',
      label: 'Domicile',
      street: 'Villa 42, Cité Sacré-Cœur 3 VDN',
      city: 'Dakar',
      postalCode: '10000',
      details: 'En face de la boulangerie jaune',
      phone: '+221 77 642 19 88',
    },
    recoveryMode: 'livraison',
    pickupDate: '27 Septembre 2026',
    pickupSlot: '14h00 - 16h00',
    deliveryDate: '29 Septembre 2026',
    deliverySlot: '18h00 - 20h00',
    items: [
      {
        item: CATALOG_ITEMS[4], // Entretiens costumes et tailleurs (5 500 FCFA)
        quantity: 1,
        finishType: 'cintre',
      },
      {
        item: CATALOG_ITEMS[7], // Entretien couvertures et couettes au kg (1 500 FCFA)
        quantity: 4,
        finishType: 'plie',
      }
    ],
    subtotal: 11500,
    deliveryFee: 1500,
    discount: 0,
    total: 13000,
    paymentMethod: 'mobile_money',
    paymentStatus: 'paye',
    status: 'terminee',
    notes: 'Laisser au gardien si absent',
    preferences: {
      detergentType: 'hypoallergenique',
      scent: 'neutre',
      finishPreference: 'plie',
      starchLevel: 'aucun',
    },
    history: [
      { status: 'confirmee', timestamp: '27/09/2026 09:15', note: 'Commande confirmée via Orange Money' },
      { status: 'collecte_en_cours', timestamp: '27/09/2026 14:10', note: 'Collecte effectuée' },
      { status: 'en_traitement', timestamp: '28/09/2026 10:00', note: 'Lavage thermo-régulé couette et costume' },
      { status: 'prete', timestamp: '29/09/2026 11:30', note: 'Contrôle qualité validé' },
      { status: 'terminee', timestamp: '29/09/2026 18:45', note: 'Linge remis en mains propres' }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'DC-8550',
    createdAt: '2026-10-04T08:00:00Z',
    clientName: 'Aminata Sow',
    clientPhone: '+221 78 123 45 67',
    clientEmail: 'aminata.sow@example.sn',
    address: {
      id: 'addr-aminata',
      label: 'Résidence',
      street: 'Rue 10, Mermoz Pyrotechnie',
      city: 'Dakar',
      postalCode: '10000',
      details: 'Immeuble A, 1er étage',
      phone: '+221 78 123 45 67',
    },
    recoveryMode: 'retrait',
    pickupAgencyName: 'DIGICLEAN - Hub Central VDN (Sacré-Cœur)',
    pickupDate: 'Aujourd’hui',
    pickupSlot: '14h00 - 16h00',
    deliveryDate: '06 Octobre 2026',
    deliverySlot: 'À partir de 12h00',
    items: [
      {
        item: CATALOG_ITEMS[6], // Nettoyage tapis et moquettes (5 000 FCFA)
        quantity: 1,
        finishType: 'plie',
      },
      {
        item: CATALOG_ITEMS[11], // Entretien chaussures (1 500 FCFA)
        quantity: 2,
        finishType: 'plie',
      }
    ],
    subtotal: 8000,
    deliveryFee: 0,
    discount: 0,
    total: 8000,
    paymentMethod: 'mobile_money',
    paymentStatus: 'paye',
    status: 'collecte_programmee',
    notes: 'Point relais VDN',
    preferences: {
      detergentType: 'bio_ecologique',
      scent: 'fleur_coton',
      finishPreference: 'cintre',
      starchLevel: 'leger',
    },
    history: [
      { status: 'confirmee', timestamp: 'Aujourd’hui 08:00', note: 'Nouvelle commande enregistrée' },
      { status: 'collecte_programmee', timestamp: 'Aujourd’hui 08:15', note: 'Collecte programmée cet après-midi' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    orderId: 'DC-8492',
    title: 'Linge en cours de traitement 🫧',
    message: 'Vos vêtements traditionnels, linge au kg et chaussures blanches sont actuellement entre les mains expertes de nos artisans à l’atelier Sacré-Cœur VDN.',
    timestamp: 'Il y a 35 min',
    read: false,
    type: 'order_status'
  },
  {
    id: 'notif-2',
    orderId: 'DC-8492',
    title: 'Collecte effectuée avec succès 🚚',
    message: 'Notre chauffeur Ibrahima a bien récupéré votre linge à Sacré-Cœur. Merci !',
    timestamp: 'Il y a 3 heures',
    read: true,
    type: 'order_status'
  },
  {
    id: 'notif-3',
    title: 'Offre spéciale DIGICLEAN Dakar 🇸🇳',
    message: 'Profitez de 1 500 FCFA offerts sur votre commande avec le code DIGISENEGAL.',
    timestamp: 'Hier',
    read: true,
    type: 'promo'
  }
];
