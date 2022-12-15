import * as _ from 'lodash'
import { postData } from '@/services/connect'
import config from '@/config'

/* eslint-disable no-console */
const logger = {
  log: function(...args: unknown[]): void {
    console.log('cΩ.web.', _.map(args, JSON.stringify))
    args.unshift('VSCode')
    postData(`${config.SERVER_URL}/logger/log`, args)
  },
  info: function(...args: unknown[]): void {
    console.info('cΩ.web.', _.map(args, JSON.stringify))
    args.unshift('VSCode')
    postData(`${config.SERVER_URL}/logger/info`, args)
  },
  warn: function(...args: unknown[]): void {
    console.warn('cΩ.web.', _.map(args, JSON.stringify))
    args.unshift('VSCode')
    postData(`${config.SERVER_URL}/logger/warn`, args)
  },
  debug: function(...args: unknown[]): void {
    console.info('cΩ.web.', _.map(args, JSON.stringify))
    args.unshift('VSCode')
    postData(`${config.SERVER_URL}/logger/debug`, args)
  },
  error: function(...args: unknown[]): void {
    console.error('cΩ.web.', _.map(args, JSON.stringify))
    args.unshift('VSCode')
    postData(`${config.SERVER_URL}/logger/error`, args)
  },
}

export default logger
