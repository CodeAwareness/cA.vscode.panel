import * as _ from 'lodash'
import { postData } from '@/services/connect'
import config from '@/config'

/* eslint-disable no-console */
const logger = {
  log: function(...args: any[]): void {
    console.log('PeerWeb.', _.map(args, JSON.stringify))
    args.unshift('VSCode')
    postData(`${config.SERVER_URL}/log/log`, args)
  },
  info: function(...args: any[]): void {
    console.info('PeerWeb.', _.map(args, JSON.stringify))
    args.unshift('VSCode')
    postData(`${config.SERVER_URL}/log/info`, args)
  },
  warn: function(...args: any[]): void {
    console.warn('PeerWeb.', _.map(args, JSON.stringify))
    args.unshift('VSCode')
    postData(`${config.SERVER_URL}/log/warn`, args)
  },
  debug: function(...args: any[]): void {
    console.info('PeerWeb.', _.map(args, JSON.stringify))
    args.unshift('VSCode')
    postData(`${config.SERVER_URL}/log/debug`, args)
  },
  error: function(...args: any[]): void {
    console.error('PeerWeb.', _.map(args, JSON.stringify))
    args.unshift('VSCode')
    postData(`${config.SERVER_URL}/log/error`, args)
  },
}

export {
  logger,
}
