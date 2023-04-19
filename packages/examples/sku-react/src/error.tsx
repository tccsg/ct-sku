import { useLocalStorage } from '@mantine/hooks'
import { Navigate, useLocation, useRouteError } from 'react-router-dom'

export function ErrorBoundary() {
  const error = useRouteError()
  const location = useLocation()
  const statusCode = Object(error).status

  if (statusCode === 401) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return null
}
