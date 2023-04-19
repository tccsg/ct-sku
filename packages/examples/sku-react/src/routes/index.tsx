import { Outlet } from 'react-router-dom'


import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunction } from 'react-router-dom'

export const loader =
  (queryClient: QueryClient): LoaderFunction =>
    async (): Promise<{ currentUser: any }> => {
      return {
        currentUser: {}
      }
    }

export default function Index() {
  return <Outlet />
}
