import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
}

// Validate Firebase config
const isFirebaseConfigValid = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.authDomain && 
         firebaseConfig.projectId && 
         firebaseConfig.appId
}

let app: any = null
let db: any = null
let analytics: any = null

// Initialize Firebase only if config is valid
if (isFirebaseConfigValid()) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
  } catch (error) {
    console.warn('Firebase initialization failed:', error)
  }
} else {
  console.warn('Firebase configuration is incomplete. Firebase features will be disabled.')
}

// Export Firebase services (may be null if not configured)
export { db, analytics }
export default app

// Helper to check if Firebase is available
export const isFirebaseAvailable = () => {
  return app !== null && db !== null
}
