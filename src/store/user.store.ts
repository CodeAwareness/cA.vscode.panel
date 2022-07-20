import { writable } from 'svelte/store'

export const user = writable({})
export const tokens = writable({})
export const activeProfile = writable(false)
