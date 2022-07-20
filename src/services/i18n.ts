import {
  _,
  register,
  init,
} from 'svelte-i18n'
import ky from 'ky'
import config from '@/config'
import { i18nReady, locale } from '@/store/app.store'

async function setupI18n(lang = 'en') {
  locale.set(lang)
  init({
    fallbackLocale: 'en',
    initialLocale: lang,
  })
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

export { _, setupI18n }
