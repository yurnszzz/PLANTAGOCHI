/**
 * Plantagochi — Offline Firebase Simulator
 * 
 * This file provides a full mock implementation of Firebase (App, Auth, and Firestore)
 * that stores all data in the browser's LocalStorage. It allows the application to
 * run completely offline, with full functionality, without needing an actual Firebase project connection.
 */

// --- Helper Functions & Database Seeding ---

const LOCAL_STORAGE_PLANTS_KEY = 'plantagochi_mock_plants';
const LOCAL_STORAGE_USER_KEY = 'plantagochi_mock_user';
const LOCAL_STORAGE_ADMINS_KEY = 'plantagochi_mock_admins';

// Seed initial data if empty
function seedDatabase() {
  // 1. Seed Admin
  if (!localStorage.getItem(LOCAL_STORAGE_ADMINS_KEY)) {
    const mockAdmins = {
      'admin-uid-12345': {
        role: 'admin',
        email: 'admin@plantagochi.com'
      }
    };
    localStorage.setItem(LOCAL_STORAGE_ADMINS_KEY, JSON.stringify(mockAdmins));
  }

  // 2. Seed Plants
  if (!localStorage.getItem(LOCAL_STORAGE_PLANTS_KEY)) {
    const mockPlants = {
      'sample-cactus': {
        product_tier: 'standard',
        plant_name: 'Cacti Jack',
        owner_email: 'user@example.com',
        total_waters: 3,
        streak: 2,
        longest_streak: 2,
        level: 2,
        last_watered_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago (can water!)
        onboarded_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        unlocked_achievements: [
          { code: 'first_water', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
        ],
        status: 'active'
      },
      'new-cactus-pot': {
        product_tier: 'premium',
        plant_name: null,
        owner_email: null,
        total_waters: 0,
        streak: 0,
        longest_streak: 0,
        level: 1,
        last_watered_at: null,
        onboarded_at: null,
        created_at: new Date().toISOString(),
        is_active: false,
        unlocked_achievements: [],
        status: 'generated'
      }
    };
    localStorage.setItem(LOCAL_STORAGE_PLANTS_KEY, JSON.stringify(mockPlants));
  }
}

seedDatabase();

// --- 1. firebase/app Mock ---
export function initializeApp(config) {
  console.log('%c[Plantagochi Mock] Firebase Initialized (Offline Mode)', 'color: #059669; font-weight: bold;', config);
  return { name: '[PlantagochiMockApp]' };
}

// --- 2. firebase/auth Mock ---
const authListeners = [];

function getMockCurrentUser() {
  const userJson = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
  return null;
}

export function getAuth(app) {
  return { app, type: 'auth' };
}

export function onAuthStateChanged(auth, callback) {
  const currentUser = getMockCurrentUser();
  // Immediately call callback with current state
  callback(currentUser);

  authListeners.push(callback);
  return () => {
    const idx = authListeners.indexOf(callback);
    if (idx !== -1) authListeners.splice(idx, 1);
  };
}

export async function signInWithEmailAndPassword(auth, email, password) {
  console.log(`[Mock Auth] Attempting login for: ${email}`);
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network latency

  if (email === 'admin@plantagochi.com' && password === 'admin123') {
    const mockUser = {
      uid: 'admin-uid-12345',
      email: 'admin@plantagochi.com',
      emailVerified: true,
      displayName: 'Super Admin'
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
    // Notify listeners
    authListeners.forEach(cb => cb(mockUser));
    return { user: mockUser };
  } else {
    const error = new Error('Auth failed');
    error.code = 'auth/invalid-credential';
    throw error;
  }
}

export async function signOut(auth) {
  console.log('[Mock Auth] Signing out');
  await new Promise(resolve => setTimeout(resolve, 300));
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  authListeners.forEach(cb => cb(null));
}

// --- 3. firebase/firestore Mock ---
export function getFirestore(app) {
  return { app, type: 'firestore' };
}

// Reference builders
export function doc(db, collectionName, docId) {
  return { type: 'doc', collectionName, docId };
}

export function collection(db, collectionName, ...paths) {
  return { type: 'collection', collectionName, paths };
}

export function query(collectionRef, ...constraints) {
  return { type: 'query', collectionRef, constraints };
}

export function where(field, operator, value) {
  return { type: 'where', field, operator, value };
}

export function orderBy(field, direction) {
  return { type: 'orderBy', field, direction };
}

export function serverTimestamp() {
  return new Date().toISOString();
}

// Data actions
export async function getDoc(docRef) {
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate latency
  
  if (docRef.collectionName === 'admins') {
    const admins = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ADMINS_KEY) || '{}');
    const adminData = admins[docRef.docId];
    return {
      id: docRef.docId,
      exists: () => !!adminData,
      data: () => adminData
    };
  }

  if (docRef.collectionName === 'plants') {
    const plants = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLANTS_KEY) || '{}');
    const plantData = plants[docRef.docId];
    return {
      id: docRef.docId,
      exists: () => !!plantData,
      data: () => plantData
    };
  }

  return {
    id: docRef.docId,
    exists: () => false,
    data: () => null
  };
}

export async function setDoc(docRef, data) {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (docRef.collectionName === 'plants') {
    const plants = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLANTS_KEY) || '{}');
    plants[docRef.docId] = data;
    localStorage.setItem(LOCAL_STORAGE_PLANTS_KEY, JSON.stringify(plants));
    console.log(`[Mock Firestore] Saved plant ${docRef.docId}:`, data);
  }
}

export async function updateDoc(docRef, data) {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (docRef.collectionName === 'plants') {
    const plants = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLANTS_KEY) || '{}');
    if (plants[docRef.docId]) {
      plants[docRef.docId] = { ...plants[docRef.docId], ...data };
      localStorage.setItem(LOCAL_STORAGE_PLANTS_KEY, JSON.stringify(plants));
      console.log(`[Mock Firestore] Updated plant ${docRef.docId}:`, data);
    } else {
      throw new Error(`Document ${docRef.docId} not found`);
    }
  }
}

export async function addDoc(collectionRef, data) {
  await new Promise(resolve => setTimeout(resolve, 200));
  // In the app, this is used for: collection(db, 'plants', token, 'watering_logs')
  // We can just log it or simulate adding to subcollection
  console.log(`[Mock Firestore] Added doc to subcollection/collection ${collectionRef.collectionName}:`, data);
  const mockId = 'log-' + Math.random().toString(36).substring(2, 9);
  return { id: mockId };
}

export async function deleteDoc(docRef) {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (docRef.collectionName === 'plants') {
    const plants = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLANTS_KEY) || '{}');
    delete plants[docRef.docId];
    localStorage.setItem(LOCAL_STORAGE_PLANTS_KEY, JSON.stringify(plants));
    console.log(`[Mock Firestore] Deleted plant ${docRef.docId}`);
  }
}

export async function getDocs(queryOrCollectionRef) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let collectionName = '';
  let constraints = [];
  
  if (queryOrCollectionRef.type === 'collection') {
    collectionName = queryOrCollectionRef.collectionName;
  } else if (queryOrCollectionRef.type === 'query') {
    collectionName = queryOrCollectionRef.collectionRef.collectionName;
    constraints = queryOrCollectionRef.constraints || [];
  }

  if (collectionName === 'plants') {
    const plantsObj = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PLANTS_KEY) || '{}');
    let plantsList = Object.entries(plantsObj).map(([id, data]) => ({
      id,
      ...data
    }));

    // Apply where filters
    constraints.forEach(c => {
      if (c.type === 'where') {
        const { field, operator, value } = c;
        if (operator === '==') {
          plantsList = plantsList.filter(item => item[field] === value);
        }
      }
    });

    const docSnapshots = plantsList.map(item => {
      const { id, ...data } = item;
      return {
        id,
        data: () => data
      };
    });

    return {
      empty: docSnapshots.length === 0,
      docs: docSnapshots
    };
  }

  return {
    empty: true,
    docs: []
  };
}
