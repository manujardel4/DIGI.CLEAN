export type ServiceCategory = 
  | 'lavage_kg'
  | 'vetements'
  | 'maison'
  | 'chaussures_cuir';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number; // in EUR (or currency display)
  unit: string;
  turnaroundHours: number;
  popular?: boolean;
  description: string;
  iconName: string;
  availableFinishes?: ('cintre' | 'plie')[];
}

export interface OrderCartItem {
  item: ServiceItem;
  quantity: number;
  finishType: 'cintre' | 'plie';
  specialInstructions?: string;
}

export type RecoveryMode = 'livraison' | 'retrait';

export type PaymentMethod = 'carte' | 'mobile_money' | 'apple_pay' | 'especes';

export type OrderStatus =
  | 'confirmee'
  | 'collecte_programmee'
  | 'collecte_en_cours'
  | 'en_traitement'
  | 'repassage_finition'
  | 'prete'
  | 'en_livraison'
  | 'terminee'
  | 'annulee';

export interface TrackingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  timestamp?: string;
  agent?: string;
}

export interface DriverInfo {
  name: string;
  phone: string;
  photoUrl?: string;
  vehicle: string;
  eta?: string;
}

export interface GarmentPreferences {
  detergentType: 'standard' | 'hypoallergenique' | 'bio_ecologique';
  scent: 'neutre' | 'fleur_coton' | 'lavande_douce';
  finishPreference: 'cintre' | 'plie';
  starchLevel: 'aucun' | 'leger' | 'moyen';
}

export interface AddressInfo {
  id: string;
  label: string; // 'Domicile', 'Bureau', etc.
  street: string;
  city: string;
  postalCode: string;
  details?: string; // Etage, code porte, batiment
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  address: AddressInfo;
  recoveryMode: RecoveryMode;
  pickupAgencyName?: string; // for retrait mode
  pickupDate: string;
  pickupSlot: string;
  deliveryDate: string;
  deliverySlot: string;
  items: OrderCartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paye' | 'en_attente' | 'a_la_collecte';
  status: OrderStatus;
  driver?: DriverInfo;
  notes?: string;
  internalStaffNotes?: string;
  preferences: GarmentPreferences;
  history: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface UserProfile {
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  memberSince: string;
  loyaltyPoints: number;
  addresses: AddressInfo[];
  defaultPreferences: GarmentPreferences;
}

export interface NotificationItem {
  id: string;
  orderId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order_status' | 'promo' | 'reminder';
}
