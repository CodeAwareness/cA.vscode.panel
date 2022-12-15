import { writable } from 'svelte/store'

export const user = writable({})
export const tokens = writable({})
export const activeProfile = writable(false)

export type TTokens = {
  access: {
    _id: string
    token: string
    user: string
    kind: 'access'
    denied: boolean
    expires: string
    createdAt: string
  },
  refresh: {
    _id: string
    token: string
    user: string
    kind: 'access'
    denied: boolean
    expires: string
    createdAt: string
  }
}

export type TUser = {
  _id: string
  email: string
  lang: string
  createdAt: string
  updatedAt: string
}
