import { Navigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

export function AdminGuard() {
  const { isAdmin } = useAdmin()
  if (!isAdmin) {
    return <Navigate to="/admin" replace />
  }
  return <Outlet />
}
