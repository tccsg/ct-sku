import {
  ColorSchemeProvider,
  MantineProvider
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClientProvider } from '@tanstack/react-query'
import React, { useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { mantineTheme } from '@seivt/ui'

import modals from './components/modals'
import router from './router'
import queryClient from './vendor/queryClient'

import type {
  ColorScheme,
  MantineThemeOverride
} from '@mantine/core'

const theme: MantineThemeOverride = {
  ...mantineTheme
}

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true
  })
  const toggleColorScheme = useCallback(
    (value: ColorScheme) =>
      setColorScheme(value || colorScheme === 'light' ? 'dark' : 'light'),
    [colorScheme]
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{
            ...theme,
            colorScheme
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <ModalsProvider modals={modals}>
            <Notifications position="top-center" zIndex={2077} />
            <RouterProvider router={router} />
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
