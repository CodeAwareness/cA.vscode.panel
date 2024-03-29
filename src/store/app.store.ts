import { writable } from 'svelte/store'

export const activeProject = writable({})

/**
 * `mode` can have one the following values:
 *  'profile': showing the user profile UX;
 *  'repo': showing the repository UX, with Users, Branches and Comments;
 */
export const mode = writable('repo')

export const i18nReady = writable({})

export const locale = writable('en')

export const settings = writable({ colorTheme: 1 })
