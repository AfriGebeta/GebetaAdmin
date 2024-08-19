//@ts-nocheck
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import React, { Suspense, useMemo, useState } from 'react'
import { AuthContext } from '@/contexts'

import mapLoader from '/animation.webm'

export function Router() {
  const [signedIn, setSignedIn] = useState(
    Boolean(localStorage.getItem('apiAccessToken'))
  )

  const authContextProviderValue = useMemo(
    () => ({
      signedIn,
      setSignedIn,
    }),
    [signedIn, setSignedIn]
  )

  return (
    <AuthContext.Provider value={authContextProviderValue}>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className='flex h-svh w-full flex-col items-center justify-center'>
              <video autoPlay loop src={mapLoader} />
            </div>
          }
        >
          <Routes>
            <Route
              path='/auth'
              Component={
                signedIn
                  ? Navigate.bind(null, { to: '/', replace: true })
                  : Outlet
              }
              errorElement={<GeneralError />}
            >
              <Route
                index
                path='sign-in'
                Component={React.lazy(() => import('./pages/auth/sign-in'))}
              />
              <Route
                path='sign-up'
                Component={React.lazy(() => import('./pages/auth/sign-up'))}
              />
              <Route
                path='forgot-password'
                Component={React.lazy(
                  React.lazy(() => import('./pages/auth/forgot-password'))
                )}
              />
            </Route>

            <Route
              path='/'
              Component={
                !signedIn
                  ? Navigate.bind(null, {
                      to: '/auth/sign-in',
                      replace: true,
                    })
                  : React.lazy(() => import('./components/app-shell'))
              }
              errorElement={<GeneralError />}
            >
              <Route
                index
                path=''
                Component={React.lazy(() => import('./pages/places'))}
              />

              <Route
                path='places'
                Component={React.lazy(() => import('./pages/places'))}
              />

              <Route
                path='/home'
                Component={React.lazy(() => import('./pages/dashboard'))}
              />

              <Route
                path='transportation-routes'
                Component={React.lazy(() => import('@/components/coming-soon'))}
              />

              <Route
                path='boundary'
                Component={React.lazy(() => import('./pages/boundary'))}
              />

              <Route
                path='boundary/add'
                Component={React.lazy(
                  () => import('./pages/boundary/addBoundary')
                )}
              />

              <Route
                path='boundary/update/:id'
                Component={React.lazy(
                  () => import('./pages/boundary/updateBoundary')
                )}
              />

              <Route
                path='collectors'
                Component={React.lazy(() => import('./pages/collectors'))}
              />

              <Route
                path='admins'
                Component={React.lazy(() => import('./pages/admins'))}
              />

              <Route
                path='chats'
                Component={React.lazy(() => import('@/components/coming-soon'))}
              />

              <Route
                path='users'
                Component={React.lazy(() => import('@/components/coming-soon'))}
              />

              <Route
                path='analysis'
                Component={React.lazy(() => import('@/components/coming-soon'))}
              />

              <Route
                path='extra-components'
                Component={React.lazy(() => import('@/pages/extra-components'))}
              />

              <Route
                path='settings'
                Component={React.lazy(() => import('./pages/settings'))}
                errorElement={<GeneralError />}
              >
                <Route
                  index
                  Component={React.lazy(
                    () => import('./pages/settings/profile')
                  )}
                />

                <Route
                  path={'account'}
                  Component={React.lazy(
                    () => import('./pages/settings/account')
                  )}
                />

                <Route
                  path={'appearance'}
                  Component={React.lazy(
                    () => import('./pages/settings/appearance')
                  )}
                />

                <Route
                  path={'notifications'}
                  Component={React.lazy(
                    () => import('./pages/settings/notifications')
                  )}
                />

                <Route
                  path={'display'}
                  Component={React.lazy(
                    () => import('./pages/settings/display')
                  )}
                />

                <Route
                  path={'error-example'}
                  Component={React.lazy(
                    () => import('./pages/settings/error-example')
                  )}
                />
              </Route>
            </Route>

            <Route path='/500' Component={GeneralError} />
            <Route path='/404' Component={NotFoundError} />
            <Route path='/503' Component={MaintenanceError} />

            <Route path='*' Component={NotFoundError} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default Router
