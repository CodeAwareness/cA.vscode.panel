import { writable } from 'svelte/store'

const vscode = {
  API: undefined,
}

const Req = writable([])
export {
  Req,
  vscode,
}
