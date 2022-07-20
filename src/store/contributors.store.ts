import { writable } from 'svelte/store'

export const contributors = writable([])

export const selectedContributor = writable({})

export const selectedBranch = writable({})
