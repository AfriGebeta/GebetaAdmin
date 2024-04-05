//@ts-nocheck
import { createContext } from 'react'

export const AuthContext = createContext({
  signedIn: false,
  setSignedIn: (value: boolean) => {},
})
