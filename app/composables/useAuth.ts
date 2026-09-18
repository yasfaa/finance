// Auth State Management Composable
import type { Ref } from 'vue'

export interface UserSession {
  username: string
  role: 'marketing' | 'supervisor' | 'admin'
}

interface UseAuthReturn {
  isAuthenticated: Ref<boolean>
  user: Ref<UserSession | null>
  isLoading: Ref<boolean>
  isInitialized: Ref<boolean>
  showSplash: Ref<boolean>
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  checkSession: () => void
}

export function useAuth(): UseAuthReturn {
  // Global shared state across components using Nuxt's useState
  const isAuthenticated = useState<boolean>('auth_authenticated', () => false)
  const user = useState<UserSession | null>('auth_user', () => null)
  const isLoading = useState<boolean>('auth_loading', () => false)
  const isInitialized = useState<boolean>('auth_initialized', () => false)
  const showSplash = useState<boolean>('auth_show_splash', () => false)

  // Check if session exists in localStorage (client-side only)
  const checkSession = () => {
    if (!import.meta.client) return

    try {
      const savedUser = localStorage.getItem('jkl_auth_user')
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as UserSession
        isAuthenticated.value = true
        user.value = parsed
      } else {
        isAuthenticated.value = false
        user.value = null
      }
    } catch {
      logout()
    } finally {
      isInitialized.value = true
    }
  }

  // Simulated login with validation
  const login = async (username: string, password: string): Promise<void> => {
    if (!username || !password) {
      throw new Error('Username dan password tidak boleh kosong')
    }

    isLoading.value = true

    try {
      // Simulate network latency (600ms)
      await new Promise(resolve => setTimeout(resolve, 600))

      const session: UserSession = {
        username,
        role: 'marketing'
      }

      isAuthenticated.value = true
      user.value = session

      if (import.meta.client) {
        localStorage.setItem('jkl_auth_user', JSON.stringify(session))
      }
    } catch (error) {
      throw error as Error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    showSplash.value = false
    if (import.meta.client) {
      localStorage.removeItem('jkl_auth_user')
    }
  }

  return {
    isAuthenticated,
    user,
    isLoading,
    isInitialized,
    showSplash,
    login,
    logout,
    checkSession
  }
}
