import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, UserProfile, NotificationItem, OrderStatus, ServiceItem } from '../types';
import { INITIAL_ORDERS, INITIAL_USER_PROFILE, INITIAL_NOTIFICATIONS } from '../data/mockData';

type ViewMode = 'home' | 'new_order' | 'tracking' | 'history' | 'profile' | 'admin';

interface AppContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  createOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (val: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  hasSeenTutorial: boolean;
  tutorialOpen: boolean;
  setTutorialOpen: (val: boolean) => void;
  login: (phone: string, password?: string) => boolean;
  register: (data: { firstName: string; lastName: string; phone: string; address?: string; email?: string; password?: string }) => void;
  logout: () => void;
  openTutorial: () => void;
  closeTutorial: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (val: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  viewTrackingForOrder: (orderId: string) => void;
  pendingCartItem: { item: ServiceItem; quantity: number; finishType?: 'cintre' | 'plie' } | null;
  setPendingCartItem: (val: { item: ServiceItem; quantity: number; finishType?: 'cintre' | 'plie' } | null) => void;
  startOrderWithItem: (item: ServiceItem, quantity: number, finishType?: 'cintre' | 'plie') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'digiclean_orders_v2';
const PROFILE_STORAGE_KEY = 'digiclean_profile_v2';
const NOTIFS_STORAGE_KEY = 'digiclean_notifs_v2';
const ADMIN_AUTH_KEY = 'digiclean_admin_auth_v2';
const AUTH_STATE_KEY = 'digiclean_auth_state_v3';
const TUTORIAL_SEEN_KEY = 'digiclean_tutorial_seen_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [pendingCartItem, setPendingCartItem] = useState<{ item: any; quantity: number; finishType?: 'cintre' | 'plie' } | null>(null);

  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_STATE_KEY) === 'true';
  });

  // Tutorial tracking state
  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean>(() => {
    return localStorage.getItem(TUTORIAL_SEEN_KEY) === 'true';
  });
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(AUTH_STATE_KEY, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(TUTORIAL_SEEN_KEY, hasSeenTutorial ? 'true' : 'false');
  }, [hasSeenTutorial]);

  const login = (phone: string, _password?: string): boolean => {
    setIsAuthenticated(true);
    if (!hasSeenTutorial) {
      setTutorialOpen(true);
    }
    return true;
  };

  const register = (data: { firstName: string; lastName: string; phone: string; address?: string; email?: string; password?: string }) => {
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
    setUserProfile(prev => ({
      ...prev,
      name: fullName || prev.name,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || prev.email,
      addresses: data.address ? [
        {
          id: 'addr-main',
          label: 'Domicile',
          street: data.address.trim(),
          city: 'Dakar',
          postalCode: '10000',
          phone: data.phone.trim(),
        },
        ...prev.addresses.filter(a => a.id !== 'addr-main')
      ] : prev.addresses
    }));

    setIsAuthenticated(true);
    // Première connexion : lancer immédiatement le tutoriel de navigation !
    setTutorialOpen(true);

    const welcomeNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Bienvenue chez DIGICLEAN, ${data.firstName} ! 🫧`,
      message: 'Votre compte a été créé avec succès. Découvrez nos 12 prestations de pressing et blanchisserie à Dakar.',
      timestamp: 'À l’instant',
      read: false,
      type: 'promo'
    };
    setNotifications(prev => [welcomeNotif, ...prev]);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STATE_KEY);
    setCurrentView('home');
  };

  const openTutorial = () => {
    setTutorialOpen(true);
  };

  const closeTutorial = () => {
    setTutorialOpen(false);
    setHasSeenTutorial(true);
  };

  const startOrderWithItem = (item: any, quantity: number, finishType: 'cintre' | 'plie' = 'plie') => {
    setPendingCartItem({ item, quantity, finishType });
    setCurrentView('new_order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Persistent Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  // Active tracked order (default to first active order or first order)
  const [activeOrderId, setActiveOrderId] = useState<string>(() => {
    const active = INITIAL_ORDERS.find(o => o.status !== 'terminee' && o.status !== 'annulee');
    return active ? active.id : INITIAL_ORDERS[0]?.id || '';
  });

  // Persistent User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER_PROFILE;
  });

  // Persistent Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Admin authentication state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  useEffect(() => {
    sessionStorage.setItem(ADMIN_AUTH_KEY, isAdminUnlocked ? 'true' : 'false');
  }, [isAdminUnlocked]);

  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0] || null;

  const setActiveOrder = (order: Order | null) => {
    if (order) {
      setActiveOrderId(order.id);
    }
  };

  const viewTrackingForOrder = (orderId: string) => {
    setActiveOrderId(orderId);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    // Add confirmation notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      orderId: newOrder.orderNumber,
      title: 'Commande confirmée ! ✨',
      message: `Votre commande ${newOrder.orderNumber} a été prise en compte avec succès. Collecte prévue le ${newOrder.pickupDate} (${newOrder.pickupSlot}).`,
      timestamp: 'À l’instant',
      read: false,
      type: 'order_status'
    };
    setNotifications(prev => [newNotif, ...prev]);
    // Increase loyalty points (1 point per 100 FCFA)
    setUserProfile(prev => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + Math.max(1, Math.floor(newOrder.total / 100))
    }));
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const statusLabels: Record<OrderStatus, string> = {
          confirmee: 'Commande validée',
          collecte_programmee: 'Collecte programmée avec le chauffeur',
          collecte_en_cours: 'Chauffeur en route pour collecte',
          en_traitement: 'Linge en cours de traitement à l’atelier',
          repassage_finition: 'Repassage soigné et contrôle qualité',
          prete: 'Commande prête',
          en_livraison: ord.recoveryMode === 'retrait' ? 'Disponible en boutique' : 'Chauffeur en cours de livraison',
          terminee: ord.recoveryMode === 'retrait' ? 'Linge retiré' : 'Linge livré avec succès',
          annulee: 'Commande annulée'
        };

        const updatedHistory = [
          ...ord.history,
          {
            status: newStatus,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            note: note || statusLabels[newStatus]
          }
        ];

        return {
          ...ord,
          status: newStatus,
          history: updatedHistory
        };
      }
      return ord;
    }));

    // Also push user notification
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        orderId: targetOrder.orderNumber,
        title: `Mise à jour commande ${targetOrder.orderNumber}`,
        message: note || `Le statut de votre commande est désormais : ${newStatus.replace('_', ' ')}.`,
        timestamp: 'À l’instant',
        read: false,
        type: 'order_status'
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        orders,
        activeOrder,
        setActiveOrder,
        userProfile,
        setUserProfile,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        createOrder,
        updateOrderStatus,
        isAdminUnlocked,
        setIsAdminUnlocked,
        isAuthenticated,
        setIsAuthenticated,
        hasSeenTutorial,
        tutorialOpen,
        setTutorialOpen,
        login,
        register,
        logout,
        openTutorial,
        closeTutorial,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        viewTrackingForOrder,
        pendingCartItem,
        setPendingCartItem,
        startOrderWithItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
