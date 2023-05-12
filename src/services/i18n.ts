import { _, register, init } from 'svelte-i18n'
import ky from 'ky'

import config from '@/config'
import { i18nReady } from '@/store/app.store'
import logger from '@/services/logger'

async function setup(lang = 'en'): Promise<unknown> {
  init({
    fallbackLocale: 'en',
    initialLocale: lang,
  })
  logger.log('INIT i18n', lang)
  const dictPromise = ky.get(`${config.EXT_SERVER}/i18n/${lang}.json?t=${new Date().toISOString()}`).json()
    .then(response => {
      i18nReady.set(true)
      return response
    })
  register(lang, () => dictPromise)
  init({
    fallbackLocale: 'en',
    initialLocale: lang,
  })

  return dictPromise
}

export const t = _

export default {
  _,
  setup,
}
