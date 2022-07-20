import type { Socket } from 'socket.io-client'
import io from 'socket.io-client'
import config from '@/config'

import { logger } from '@/services/logger'

export type CΩSocket = Socket & {
  transmit: (action: string, data?: any, options?: any) => Promise<any>
}

export type Class<T> = new (...args: any[]) => T

export class WSIO {
  public rootSocket: CΩSocket
  public uSocket: CΩSocket
  public rSocket: CΩSocket

  private _delay: number
  private expDelay(): number {
    this._delay = this._delay * 2
    return this._delay
  }

  private resetDelay() {
    this._delay = 200
  }

  public init(): void {
    this.rootSocket = io(config.SERVER_WSS, {
      reconnectionDelayMax: 10000,
      timestampRequests: true,
      transports: ['websocket'],
    }) as CΩSocket

    logger.log('initializing sockets')
    this.rootSocket.on('connect', () => {
      logger.log('rootSocket CONNECT')
      connectNamespace('users')
        .then((socket: CΩSocket) => {
          socket.on('connect', () => { logger.log('socketUser connected') })
          socket.transmit = this.transmit(socket)
          this.uSocket = socket
        })

      connectNamespace('repos')
        .then((socket: CΩSocket) => {
          socket.on('connect', () => { logger.log('socketRepo connected') })
          socket.transmit = this.transmit(socket)
          this.rSocket = socket
        })
    })
  }

  /*
   * Transmit an action, and perhaps some data. Recommend a namespacing format for the action, something like `<domain>:<action>`, e.g. `auth:login` or `users:query`.
   * The response from Transient.server comes in the form of `res:<domain>:<action>` with the `domain` and `action` being the same as the transmitted ones.
   *
   * TODO: prevent multiple transmit requests to overload the system with pendingConnection (consider reconnect fn too)
   */
  private transmit(wsocket: CΩSocket) {
    return (action: string, data?: any, options?: any) => {
      let handled = false
      return new Promise((resolve, reject) => {
        this.resetDelay()
        const pendingConnection: any = () => {
          logger.info(`Transient.client: pending connection (delay: ${this._delay})`)
          setTimeout(() => {
            if (!handled) reject({ message: 'Request timed out' })
          }, options?.timeout || 3000)
          if (!wsocket.connected) {
            setTimeout(pendingConnection, this.expDelay())
            return
          }
          this.resetDelay()
          logger.info(`Transient.client: will emit action: ${action}`)
          wsocket.emit(action, data)
          wsocket.on(`res:${action}`, data => {
            handled = true
            resolve(data)
          })
          wsocket.on(`error:${action}`, err => {
            logger.log('wsocket error', action, err)
            handled = true
            reject(err)
          })
        }

        pendingConnection()
      })
    }
  }
}

function connectNamespace(nsp: string) {
  logger.log(`will setup namespace ${nsp}`)
  const socket = io(`/${nsp}`)

  socket.on('connection', () => {
    logger.log(`${nsp} socket connection ready`)
  })

  socket.on('reconnect', () => {
    logger.log(`${nsp} socket reconnected`, socket)
  })

  socket.on('error', logger.error)

  return Promise.resolve(socket)
}

export default WSIO
