import logger from '@/services/logger'
import { vscode, Req } from '@/store/vscode.store'
import { settings, activeProject, mode } from '@/store/app.store'
import { contributors, selectedContributor } from '@/store/contributors.store'
import { tokens, user } from '@/store/user.store'

import CAWWS, { type TWSRequest } from '@/services/wsio'
import i18n from '@/services/i18n'

import App from './App.svelte'

import initData from './debug'

declare global {
  interface Window {
    EDITOR_LOCALE: string
    acquireVsCodeApi: () => { postMessage: () => void }
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
    postMessage: function postMessage(...args) {
      logger.log('POST MESSAGE TO VSCODE', args)
      if (DEBUG && args[0] && args[0].key === 'initialized') cawEvent({ command: 'initWithData', data: initData })
    },
  }

/****************************************************************
 * Initial settings:
 * - don't display the contributors UX, just a welcome page (empty)
 * - setup the activeProject
 * - redirect error handler to VSCode
 ****************************************************************/
mode.set('repo')

let ap
activeProject.subscribe(val => (ap = val))

window.addEventListener('error', vsCodeErrorListener)
window.addEventListener('message', cawEvent)

/* Remove loading message from VSCode webpanel */
const panelLoading = document.getElementById('panelLoading')
if (panelLoading) panelLoading.style.display = 'none'

function vsCodeErrorListener(event) {
  // TODO: send this to the Gardener instead, not sure if VSCode can do anything about it.
  vscode.API.postMessage({
    command: 'alert',
    text: event.message,
  })
  return false
}
/************************************************************************************
 * get contributors for the current file
 *
 * Retrieve all users who have touched the file since the common SHA.
 * The file in question is the activePath, showing in the focussed editor.
 ************************************************************************************/
function getActiveContributors(project) {
  const extraSlash = ['/', '\\'].includes(project.root[project.root.length - 1]) ? 0 : 1
  const relativePath = project.activePath.substr(project.root.length + extraSlash).replace(/\\/g, '/')
  const contributors = Object
    .keys(project.changes[relativePath] || {})
    .filter(k => k !== 'alines')
    .map(uid => project.contributors[uid])

  contributors?.forEach(contrib => {
    contrib.changes = project.changes[relativePath][contrib._id]
  })

  return contributors
}

let requests: TWSRequest[]
Req.subscribe(val => {
  requests = val
})

/****************************************************************
 * Repo IPC (VSCode)
 ****************************************************************/
function cawEvent(event) {
  const { id, command, data } = event.data
  console.log('Received caw event', command, data)
  switch (command) {
    case 'authInfo':
      tokens.set(data.tokens)
      user.set(data.user)
      break

    case 'wssGuid':
      logger.info('WEBVIEW received WSS GUID', data)
      CAWWS.init(data)
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

    case 'setProject':
      logger.info('setProject')
      activeProject.set(data)
      contributors.set(getActiveContributors(data))
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

    default:
      apiCallResponse()
  }

  function apiCallResponse() {
    const index = requests.findIndex(e => e.id === id)
    if (index === -1) {
      logger.log('API response to a non existent request', id, command)
      return
    }
    const { resolve, reject } = requests[index]
    if (command.indexOf('res:') !== -1) resolve(data)
    else reject(data)
    requests.splice(index, 1)
  }
}

/** ping-pong to get the client GUID (enabling multiple instances) */
vscode.API.postMessage({
  command: 'event',
  key: 'webview:loaded',
})

const app = new App({
  target: document.body,
  props: {},
})

export default app
