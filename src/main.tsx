import ReactDOM from 'react-dom/client'
import React from 'react'
import './index.css'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import Router from '@/router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
)
