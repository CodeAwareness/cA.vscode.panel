import { vscode } from '@/store/vscode.store'
import logger from '@/services/logger'
import shortid from '@/services/shortid'
import { Req } from '@/store/vscode.store'

let requests: any
Req.subscribe(val => {
  requests = val
})

const CΩWS = {
  init: async function(_guid): Promise<void> {
    console.log('WSS: initializing pipe IPC with CΩ Local Service')
  },

  /*
   * Transmit an action, and perhaps some data. Recommend a namespacing format for the action, something like `<domain>:<action>`, e.g. `auth:login` or `users:query`.
   */
  transmit: function(action: string, data?: any) {
    const id = shortid()
    return new Promise(
      (resolve, reject) => {
        logger.info(`WSS: will emit action: ${action}`)
        data.id = shortid()
        const command = 'api'
        const key = action
        requests.push({ id, resolve, reject })
        Req.set(requests)
        vscode.API.postMessage({ command, id, key, data })
      })
  },

  dispose: function() {
  },
}

export default CΩWS
