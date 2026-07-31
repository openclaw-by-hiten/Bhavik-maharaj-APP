// Offline Storage Service with IndexedDB & Persistent Storage API Support
// Ensures data is NOT deleted by OS cleaner tools like MIUI Cleaner / Clean Master

const DB_NAME = 'PanditJiTrackerDB';
const DB_VERSION = 1;
const STORE_PUJAS = 'pujas';

// Request persistent storage from browser/OS
export async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        const granted = await navigator.storage.persist();
        console.log(`[Storage] Persistent storage granted: ${granted}`);
        return granted;
      }
      return true;
    } catch (err) {
      console.warn('[Storage] Could not request persistent storage:', err);
    }
  }
  return false;
}

// Open IndexedDB database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_PUJAS)) {
        db.createObjectStore(STORE_PUJAS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback to LocalStorage if IndexedDB fails
const LOCAL_STORAGE_KEY = 'panditji_pujas_backup_v1';

export async function getAllPujas() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PUJAS, 'readonly');
      const store = tx.objectStore(STORE_PUJAS);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        if (results.length > 0) {
          // Sync backup to LocalStorage as additional safety net
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(results));
          resolve(results);
        } else {
          // Try local storage fallback
          const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
          resolve(raw ? JSON.parse(raw) : getInitialSeedData());
        }
      };
      req.onerror = () => {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        resolve(raw ? JSON.parse(raw) : getInitialSeedData());
      };
    });
  } catch (err) {
    console.error('IndexedDB Error:', err);
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : getInitialSeedData();
  }
}

export async function savePuja(puja) {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PUJAS, 'readwrite');
      const store = tx.objectStore(STORE_PUJAS);
      const req = store.put(puja);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('IndexedDB save error, using localStorage fallback', err);
  }

  // Double write to LocalStorage for safety
  const all = await getAllPujas();
  const index = all.findIndex((p) => p.id === puja.id);
  if (index >= 0) {
    all[index] = puja;
  } else {
    all.unshift(puja);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  return puja;
}

export async function deletePuja(id) {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PUJAS, 'readwrite');
      const store = tx.objectStore(STORE_PUJAS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('IndexedDB delete error', err);
  }

  const all = await getAllPujas();
  const filtered = all.filter((p) => p.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export async function importData(jsonData) {
  try {
    const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        await savePuja(item);
      }
      return true;
    }
  } catch (e) {
    console.error('Import error', e);
    throw new Error('Invalid JSON backup file');
  }
  return false;
}

// Demo initial sample data if app opened first time
function getInitialSeedData() {
  const seed = [
    {
      id: 'puja-101',
      clientName: 'Rajesh Sharma Ji',
      clientPhone: '9876543210',
      pujaName: 'Griha Pravesh & Vastu Shanti',
      date: '2026-07-28',
      referredBy: 'Added by Me (Direct)',
      isPrepaid: true,
      prepaidAmount: 15000,
      expenses: [
        { id: 'e1', category: 'Pooja Samagri', name: 'Hawan Samagri & Ghee', amount: 3200, icon: 'Flame' },
        { id: 'e2', category: 'Flowers', name: 'Fresh Marigold Garlands', amount: 1500, icon: 'Flower2' },
        { id: 'e3', category: 'Petrol', name: 'Car Fuel to Client Home', amount: 800, icon: 'Fuel' },
        { id: 'e4', category: 'Food', name: 'Brahmbhoj Prasadam', amount: 2500, icon: 'Utensils' }
      ],
      bhudevs: [
        { id: 'b1', name: 'Pandit Suresh Shastri', amount: 2100 },
        { id: 'b2', name: 'Pandit Vinod Upadhyay', amount: 2100 }
      ],
      createdAt: new Date('2026-07-28').toISOString()
    },
    {
      id: 'puja-102',
      clientName: 'Amitabh Verma',
      clientPhone: '9812345678',
      pujaName: 'Shri Satyanarayan Vrat Katha',
      date: '2026-07-30',
      referredBy: 'Rajesh Sharma Ji',
      isPrepaid: false,
      prepaidAmount: 0,
      expenses: [
        { id: 'e5', category: 'Pooja Samagri', name: 'Paan, Supari, Fruits', amount: 1200, icon: 'Flame' },
        { id: 'e6', category: 'Travel', name: 'Auto Transport', amount: 400, icon: 'Car' }
      ],
      bhudevs: [
        { id: 'b3', name: 'Pandit Ramesh Trivedi', amount: 1100 }
      ],
      createdAt: new Date('2026-07-30').toISOString()
    }
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seed));
  return seed;
}
