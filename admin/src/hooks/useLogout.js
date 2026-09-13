import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = () => {
    localStorage.removeItem('host')
    dispatch({ type: 'LOGOUT' })
  }

  return { logout }
}
