import { writable } from 'svelte/store'

export const peers = writable([])

export const selectedPeer = writable({})

export const selectedBranch = writable({})
