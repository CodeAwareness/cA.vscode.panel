import { logger } from '@/services/logger'
import { vscode } from '@/store/vscode.store'
import { settings, activeProject, mode, wsIO } from '@/store/app.store'
import { contributors, selectedContributor } from '@/store/contributors.store'

import i18n from '@/services/i18n'

import WSIO from './wsio'
import App from './App.svelte'

import initData from './debug'

declare global {
  interface Window {
    EDITOR_LOCALE: string
    acquireVsCodeApi: Function
    peer8: any
  }
}

const IS_WEB = /^http/.test(location.href) && location.search
const EDITOR_LOCALE = IS_WEB ? location.search.substr(3, 2) : window.EDITOR_LOCALE || 'en'
const DEBUG = IS_WEB && location.search.substr(6, 3) === 'd=1'
const THEME = IS_WEB && location.search.substr(10, 2) === 'c=' && location.search.substr(12, 1)

if (+THEME === 2) document.body.style.backgroundColor = '#000'
i18n.setup(EDITOR_LOCALE || 'en')

/****************************************************************
 * VSCode IPC
 ****************************************************************/
vscode.API = typeof window.acquireVsCodeApi !== 'undefined'
  /* eslint-disable-next-line no-undef */
  ? window.acquireVsCodeApi()
  : {
    postMessage: function postMessage() {
      logger.log('POST MESSAGE TO VSCODE', arguments)
      if (DEBUG && arguments[0] && arguments[0].key === 'initialized') peer8Event({ command: 'initWithData', data: initData })
    },
  }

/****************************************************************
 * Initial settings:
 * - don't display the contributors UX, just a welcome page (empty)
 * - setup the activeProject
 * - redirect error handler to VSCode
 ****************************************************************/
mode.set('repo')
const wsEngine = new WSIO()
wsIO.set(wsEngine)

let ap
activeProject.subscribe(val => (ap = val))

window.addEventListener('error', vsCodeErrorListener)
window.addEventListener('message', peer8Event)

function vsCodeErrorListener(event) {
  // TODO: send this to the Gardener instead, not sure if VSCode can do anything about it.
  vscode.API.postMessage({
    command: 'alert',
    text: event.message,
  })
  return false
}

/****************************************************************
 * Repo IPC (VSCode)
 ****************************************************************/
function peer8Event(event) {
  const { command, data } = event.data
  logger.log('Received peer8 event', command, data)
  switch (command) {
    case 'wss-guid':
      logger.info('received WSS GUID', data)
      wsEngine.guid = data
      break

    case 'setColorTheme':
      logger.info('setColorTheme', data.colorTheme)
      settings.set({ colorTheme: parseInt(data.colorTheme) }) // TODO: better settings control, editor agnostic
      break

    case 'setContributors':
      logger.info('setContributors')
      contributors.set(data.contributors)
      break

    case 'selectedContributor':
      logger.info('selectedContributor')
      selectedContributor.set(data.selectedContributor)
      break

    case 'selectProject':
      logger.info('selectProject')
      activeProject.set(data.activeProject)
      break

    case 'setBranches':
      logger.info('setBranches', data)
      ap.repo.branch = data.branch
      ap.repo.commit = data.commit
      ap.repo.branches = data.branches
      activeProject.set(ap)
      break

    case 'setMode':
      mode.set(data.mode)
      break
  }
}

const app = new App({
  target: document.body,
  props: {},
})

export default app
