import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Check if user is admin
        try {
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid))
          setIsAdmin(adminDoc.exists() && adminDoc.data().role === 'admin')
        } catch {
          setIsAdmin(false)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loginAdmin = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    // Verify admin role
    const adminDoc = await getDoc(doc(db, 'admins', result.user.uid))
    if (!adminDoc.exists() || adminDoc.data().role !== 'admin') {
      await signOut(auth)
      throw new Error('Akun ini bukan admin. Akses ditolak.')
    }
    setIsAdmin(true)
    return result.user
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext
