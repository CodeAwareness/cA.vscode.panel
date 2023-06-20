import logger from '@/services/logger'
import { vscode, Req } from '@/store/vscode.store'
import { settings, activeProject, mode } from '@/store/app.store'
import { peers, selectedPeer } from '@/store/peers.store'
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
const query = location.search.substr(1).split('&').map(p => p.split('='))
const params: Record<string, string> = {}
query.map(p => params[p[0]] = p[1])
const EDITOR_LOCALE = IS_WEB ? params.lang : window.EDITOR_LOCALE || 'en'
const DEBUG = IS_WEB && params.debug
const THEME = IS_WEB && params.color

if (+THEME === 2) {
  document.body.style.backgroundColor = '#000'
  settings.set({ colorTheme: 2 })
}

i18n.setup(EDITOR_LOCALE || 'en')

// For dev purposes
let ignore_second_render
const win = window as unknown as any
if (!win.CAW_DEBUG) {
  win.CAW_DEBUG = DEBUG
} else {
  ignore_second_render = true
}

/****************************************************************
 * VSCode IPC
 ****************************************************************/
vscode.API = typeof window.acquireVsCodeApi !== 'undefined'
  /* eslint-disable-next-line no-undef */
  ? window.acquireVsCodeApi()
  : {
    postMessage: function postMessage(...args) {
      logger.log('POST MESSAGE TO VSCODE', args)
      if (DEBUG && args[0] && args[0].key === 'webview:loaded') cawEvent({ command: 'initWithData', data: initData })
    },
  }

/****************************************************************
 * Initial settings:
 * - don't display the peers UX, just a welcome page (empty)
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
 * get peers for the current file
 *
 * Retrieve all users who have touched the file since the common SHA.
 * The file in question is the activePath, showing in the focussed editor.
 ************************************************************************************/
function getActivePeers(project) {
  const extraSlash = ['/', '\\'].includes(project.root[project.root.length - 1]) ? 0 : 1
  const relativePath = project.activePath.substr(project.root.length + extraSlash).replace(/\\/g, '/')
  console.log('CONTRIB', relativePath, project.changes[relativePath]?.users)
  return project.changes[relativePath]?.users || []
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

    case 'setPeers':
      logger.info('setPeers')
      peers.set(data.peers)
      break

    case 'selectPeer':
      logger.info('selectPeer', data)
      selectedPeer.set(data.peer)
      break

    case 'setProject':
      logger.info('setProject')
      activeProject.set(data)
      peers.set(getActivePeers(data))
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

    case 'initWithData':
      tokens.set(data.tokens)
      user.set(data.user)
      activeProject.set(data.activeProject)
      peers.set(getActivePeers(data.activeProject))
      settings.set({ colorTheme: parseInt(data.colorTheme) })
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

const app = ignore_second_render ? {} : new App({
  target: document.body,
  props: {},
})

export default app
