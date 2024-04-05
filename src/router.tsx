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
import {
  AuthContext,
  PlacesContext,
  ProfilesContext,
  TransportationRoutesContext,
  Place,
  Profile,
  TransportationRoute,
} from '@/contexts'
import { arrayToHashMap } from '@/utils'

export function Router() {
  const [signedIn, setSignedIn] = useState(
    Boolean(localStorage.getItem('apiAccessToken'))
  )
  let [places, setPlaces] = useState({} as { [placeId: string]: Place })
  let [routes, setRoutes] = useState(
    {} as { [routeId: string]: TransportationRoute }
  )
  let [profiles, setProfiles] = useState({} as { [routeId: string]: Profile })

  const authContextProviderValue = useMemo(
    () => ({
      signedIn,
      setSignedIn,
    }),
    [signedIn, setSignedIn]
  )

  const placesContextProviderValue = useMemo(
    () => ({
      places,
      setPlaces,
      addPlaces: (places: Array<Place>) => {
        const placesHash = arrayToHashMap(places, 'id')

        setPlaces((_places) => ({
          ..._places,
          ...placesHash,
        }))
      },
      addPlace: (place: Place) => {
        setPlaces((_places) => ({
          ..._places,
          [place.id]: place,
        }))
      },
      removePlace: (placeId: string) => {
        delete places[placeId]
      },
      removePlaces: (placeIds: Array<string>) => {
        for (const placeId of placeIds) {
          delete places[placeId]
        }
      },
    }),
    [places, setPlaces]
  )

  const routesContextProviderValue = useMemo(
    () => ({
      routes,
      setRoutes,
      addRoute: (route: TransportationRoute) => {
        setRoutes((_routes) => ({
          ..._routes,
          [route.id]: route,
        }))
      },
      removeRoute: (routeId: string) => {
        delete routes[routeId]
      },
      removeRoutes: (routeIds: Array<string>) => {
        for (const routeId of routeIds) {
          delete routes[routeId]
        }
      },
    }),
    [routes, setRoutes]
  )

  const profilesContextProviderValue = useMemo(
    () => ({
      profiles,
      setProfiles,
      addProfile: (profile: Profile) => {
        setProfiles((_profiles) => ({
          ..._profiles,
          [profile.id]: profile,
        }))
      },
      removeProfile: (profileId: string) => {
        delete profiles[profileId]
      },
      removeProfiles: (profileIds: Array<string>) => {
        for (const profileId of profileIds) {
          delete profiles[profileId]
        }
      },
    }),
    [profiles, setProfiles]
  )

  return (
    <AuthContext.Provider value={authContextProviderValue}>
      <ProfilesContext.Provider value={profilesContextProviderValue}>
        <PlacesContext.Provider value={placesContextProviderValue}>
          <TransportationRoutesContext.Provider
            value={routesContextProviderValue}
          >
            <BrowserRouter>
              <Suspense fallback={<p> Loading...</p>}>
                <Routes>
                  <Route
                    path='/auth'
                    // @ts-ignore
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
                      // @ts-ignore
                      Component={React.lazy(
                        () => import('./pages/auth/sign-in')
                      )}
                    />
                    <Route
                      path='sign-up'
                      // @ts-ignore
                      Component={React.lazy(
                        () => import('./pages/auth/sign-up')
                      )}
                    />
                    <Route
                      path='forgot-password'
                      // @ts-ignore
                      Component={React.lazy(
                        React.lazy(() => import('./pages/auth/forgot-password'))
                      )}
                    />
                  </Route>

                  <Route
                    path='/'
                    // @ts-ignore
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
                      // @ts-ignore
                      Component={React.lazy(() => import('./pages/places'))}
                    />

                    <Route
                      path='places'
                      // @ts-ignore
                      Component={React.lazy(() => import('./pages/places'))}
                    />

                    <Route
                      path='/home'
                      // @ts-ignore
                      Component={React.lazy(() => import('./pages/dashboard'))}
                    />

                    <Route
                      path='transportation-routes'
                      // @ts-ignore
                      Component={React.lazy(
                        () => import('@/components/coming-soon')
                      )}
                    />

                    <Route
                      path='chats'
                      // @ts-ignore
                      Component={React.lazy(
                        () => import('@/components/coming-soon')
                      )}
                    />

                    <Route
                      path='users'
                      // @ts-ignore
                      Component={React.lazy(
                        () => import('@/components/coming-soon')
                      )}
                    />

                    <Route
                      path='analysis'
                      // @ts-ignore
                      Component={React.lazy(
                        () => import('@/components/coming-soon')
                      )}
                    />

                    <Route
                      path='extra-components'
                      // @ts-ignore
                      Component={React.lazy(
                        () => import('@/pages/extra-components')
                      )}
                    />

                    <Route
                      path='settings'
                      // @ts-ignore
                      Component={React.lazy(() => import('./pages/settings'))}
                      errorElement={<GeneralError />}
                    >
                      <Route
                        index
                        // @ts-ignore
                        Component={React.lazy(
                          () => import('./pages/settings/profile')
                        )}
                      />

                      <Route
                        path={'account'}
                        // @ts-ignore
                        Component={React.lazy(
                          () => import('./pages/settings/account')
                        )}
                      />

                      <Route
                        path={'appearance'}
                        // @ts-ignore
                        Component={React.lazy(
                          () => import('./pages/settings/appearance')
                        )}
                      />

                      <Route
                        path={'notifications'}
                        // @ts-ignore
                        Component={React.lazy(
                          () => import('./pages/settings/notifications')
                        )}
                      />

                      <Route
                        path={'display'}
                        // @ts-ignore
                        Component={React.lazy(
                          () => import('./pages/settings/display')
                        )}
                      />

                      <Route
                        path={'error-example'}
                        // @ts-ignore
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
          </TransportationRoutesContext.Provider>
        </PlacesContext.Provider>
      </ProfilesContext.Provider>
    </AuthContext.Provider>
  )
}

export default Router
