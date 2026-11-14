import { AppNotification } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  updateDoc,
  writeBatch,
  getDocs
} from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'nova_notifications_cache';

// Web Audio API cash-register / sales victory chime
export const playPurchaseChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // Harmonic 1: C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Harmonic 2: E5 (659.25 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(659.25, now + 0.09);
    gain2.gain.setValueAtTime(0.22, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.48);

    // Harmonic 3: G5 (783.99 Hz)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(783.99, now + 0.18);
    gain3.gain.setValueAtTime(0.25, now + 0.18);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.18);
    osc3.stop(now + 0.65);

    // Harmonic 4: C6 (1046.5 Hz) crisp chime peak
    const osc4 = ctx.createOscillator();
    const gain4 = ctx.createGain();
    osc4.type = 'sine';
    osc4.frequency.setValueAtTime(1046.5, now + 0.28);
    gain4.gain.setValueAtTime(0.3, now + 0.28);
    gain4.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
    osc4.connect(gain4);
    gain4.connect(ctx.destination);
    osc4.start(now + 0.28);
    osc4.stop(now + 0.95);
  } catch (err) {
    console.warn('Audio chime could not play:', err);
  }
};

export const requestWebNotificationPermission = async () => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (e) {
        // ignore
      }
    }
  }
};

export const showWebNotification = (title: string, body: string) => {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    } catch (e) {
      // ignore
    }
  }
};

export const notificationService = {
  subscribeNotifications: (callback: (notifications: AppNotification[]) => void) => {
    // Read local cache first for instant render
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        callback(JSON.parse(local));
      } catch (e) {
        // ignore
      }
    }

    try {
      const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'), limit(50));
      return onSnapshot(q, (snapshot) => {
        const list: AppNotification[] = snapshot.docs.map(d => ({
          ...(d.data() as AppNotification),
          id: d.id,
        }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
        callback(list);
      }, (error) => {
        console.error('Firestore notifications subscription error:', error);
      });
    } catch (e) {
      console.warn('Could not subscribe to firestore notifications:', e);
      return () => {};
    }
  },

  addPurchaseNotification: async (params: {
    productName: string;
    amount?: number;
    clientName?: string;
    phone?: string;
    channel?: string;
  }) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const formattedAmount = params.amount ? ` por $${params.amount.toLocaleString()}` : '';
    const title = '🎉 ¡Nueva Compra Recibida!';
    const message = `${params.clientName ? params.clientName + ' compró ' : 'Se ha registrado compra de '}"${params.productName}"${formattedAmount}${params.channel ? ` vía ${params.channel}` : ''}.`;

    const newNotification: AppNotification = {
      id,
      title,
      message,
      type: 'sale',
      timestamp: new Date().toISOString(),
      read: false,
      amount: params.amount,
      productName: params.productName,
      clientName: params.clientName,
      phone: params.phone,
    };

    // 1. Play sound chime locally
    playPurchaseChime();

    // 2. Trigger browser notification if allowed
    showWebNotification(title, message);

    // 3. Save to Firestore
    try {
      await setDoc(doc(db, 'notifications', id), newNotification);
    } catch (err) {
      console.error('Error saving notification to Firestore:', err);
      // Fallback local storage
      const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const updated = [newNotification, ...current].slice(0, 50);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }

    return newNotification;
  },

  markAsRead: async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      // update local
      const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const updated = current.map((n: AppNotification) => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  },

  markAllAsRead: async (notifications: AppNotification[]) => {
    try {
      const batch = writeBatch(db);
      notifications.filter(n => !n.read).forEach(n => {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      });
      await batch.commit();
    } catch (e) {
      const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      const updated = current.map((n: AppNotification) => ({ ...n, read: true }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  },

  clearAll: async () => {
    try {
      const snap = await getDocs(collection(db, 'notifications'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
};
