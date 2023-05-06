import { vscode, Req } from '@/store/vscode.store'
import logger from '@/services/logger'
import shortid from '@/services/shortid'

export type TWSRequest = {
  id: string
  resolve: (value: unknown) => void
  reject: (value: unknown) => void
}

let requests: TWSRequest[]
Req.subscribe(val => {
  requests = val
})

const CAWWS = {
  init: async function(caw): Promise<void> {
    console.log('WSS: initializing pipe IPC with CAW Local Service. Client ID: ', caw)
  },

  /*
   * Transmit an action, and perhaps some data. Recommend a namespacing format for the action, something like `<domain>:<action>`, e.g. `auth:login` or `users:query`.
   */
  transmit: function(action: string, data?: unknown) {
    const id = shortid()
    return new Promise(
      (resolve, reject) => {
        (data as any).id = shortid()
        logger.info(`WSS: will emit action: ${action}`)
        const command = 'api'
        const key = action
        requests.push({ id, resolve, reject })
        Req.set(requests)
        vscode.API.postMessage({ command, id, key, data })
      })
  },

  dispose: function() {
    console.log('disposing of CAWWS client')
  },
}

export default CAWWS
