const admin = require('firebase-admin')
const dotenv = require('dotenv')

dotenv.config()

// Firebase configuration
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'caneiq',
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase Admin SDK
let db = null

try {
  // Try to initialize with service account if available
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: firebaseConfig.projectId,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    })
    console.log('Firebase Admin SDK initialized with service account')
  } else {
    // Initialize without service account (limited functionality)
    admin.initializeApp({
      projectId: firebaseConfig.projectId
    })
    console.log('Firebase Admin SDK initialized without service account')
  }
  
  db = admin.firestore()
  console.log(`Connected to Firestore: ${firebaseConfig.projectId}`)
  
} catch (error) {
  console.warn('Firebase initialization failed, using mock storage:', error.message)
  db = null
}

// Mock storage for development when Firebase is not available
class MockStorage {
  constructor() {
    this.collections = {
      rqi: [],
      equipment: [],
      alerts: []
    }
  }

  async collection(name) {
    return {
      add: async (data) => {
        const id = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const doc = { id, ...data, createdAt: new Date() }
        this.collections[name].push(doc)
        return { id }
      },
      
      doc: (id) => ({
        get: async () => {
          const doc = this.collections[name].find(d => d.id === id)
          return { exists: !!doc, data: () => doc || {} }
        },
        
        set: async (data) => {
          const existingIndex = this.collections[name].findIndex(d => d.id === id)
          const doc = { id, ...data, updatedAt: new Date() }
          
          if (existingIndex >= 0) {
            this.collections[name][existingIndex] = doc
          } else {
            this.collections[name].push(doc)
          }
          
          return { id }
        },
        
        delete: async () => {
          this.collections[name] = this.collections[name].filter(d => d.id !== id)
          return true
        }
      }),
      
      where: (field, operator, value) => ({
        get: async () => {
          let filtered = this.collections[name]
          
          if (operator === '==') {
            filtered = filtered.filter(doc => doc[field] === value)
          } else if (operator === '>') {
            filtered = filtered.filter(doc => doc[field] > value)
          } else if (operator === '<') {
            filtered = filtered.filter(doc => doc[field] < value)
          }
          
          return {
            docs: filtered.map(doc => ({
              id: doc.id,
              data: () => doc
            }))
          }
        }
      }),
      
      orderBy: (field, direction = 'asc') => ({
        get: async () => {
          const sorted = [...this.collections[name]].sort((a, b) => {
            if (direction === 'desc') {
              return b[field] > a[field] ? 1 : -1
            }
            return a[field] > b[field] ? 1 : -1
          })
          
          return {
            docs: sorted.map(doc => ({
              id: doc.id,
              data: () => doc
            }))
          }
        }
      }),
      
      limit: (count) => ({
        get: async () => {
          const limited = this.collections[name].slice(-count)
          
          return {
            docs: limited.map(doc => ({
              id: doc.id,
              data: () => doc
            }))
          }
        }
      }),
      
      get: async () => ({
        docs: this.collections[name].map(doc => ({
          id: doc.id,
          data: () => doc
        }))
      })
    }
  }
}

// Export database instance (real Firebase or mock)
const database = db || new MockStorage()

module.exports = {
  db: database,
  admin,
  firebaseConfig,
  isFirebaseAvailable: !!db
}
