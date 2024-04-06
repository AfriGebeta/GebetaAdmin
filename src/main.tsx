import ReactDOM from 'react-dom/client'
import React from 'react'
import './index.css'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import { store } from '@/data/redux/store.ts'
import { Provider } from 'react-redux'
import Router from '@/router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <Router />
        <Toaster />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
