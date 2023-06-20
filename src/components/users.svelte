<script lang="ts">
  import type WSIO from '@/wsio'

  import config from '@/config'
  import { fade } from 'svelte/transition'

  import { t } from '@/services/i18n'
  import { refreshUsers } from '@/services/users'

  import { activeProject, settings } from '@/store/app.store'
  import { peers, selectedBranch, selectedPeer } from '@/store/peers.store'
  import { activeProfile } from '@/store/user.store'
  import { vscode } from '@/store/vscode.store'

  let participants = []
  let selUsers = {}
  let colorTheme = 1 // Color theme can be 1 or 2 (from VSCode 1 = light, 2 = dark)

  let project

  settings.subscribe(val => (colorTheme = val.colorTheme))

  function cameOnline(user) {
    console.log('USER CAME ONLINE', user)
  }

  type TPeerBlock = {
    _id: string
    changes: {
      s3key: string
      sha: string
    }
  }

  selectedPeer.subscribe((peer: TPeerBlock) => {
    selUsers = {}
    console.log('SELECTED PEER', peer)
    if (peer) selUsers[peer._id] = 1
  })

  function showProfile(ct) {
    activeProfile.set(ct)
  }

  // TODO: dispose of these when closing the panel
  activeProject.subscribe(val => { project = val })

  function shortEmail(ct) {
    const fullString = (ct.alias || ct.fullName || ct.email)
    let shortString = fullString.substr(0, config.MAX_USER_NAME_LENGTH)
    if (shortString.length !== fullString.length) shortString += '...'
    return shortString
  }

  // TODO: unsubscribe ( needed ? )
  peers.subscribe(value => {
    if (!value) return (participants = [])
    selUsers = {}
    /* eslint-disable-next-line array-callback-return */
    participants = value.map(contrib => {
      selUsers[contrib._id] = 0
      return contrib
    })
  })

  function selectPeer(ct) {
    if (!ct) return
    if (selUsers[ct._id]) {
      selUsers[ct._id] = 0
      vscode.API.postMessage({ command: 'event', key: 'contrib:unselect', data: ct })
      // localService.unselectPeer(ct)
      return
    }
    selectedBranch.set(undefined)
    selectedPeer.set(ct)
    Object.keys(selUsers).map(id => (selUsers[id] = 0))
    selUsers[ct._id] = 1
    vscode.API.postMessage({ command: 'event', key: 'contrib:select', data: ct })
  }

  // Toggle
  let open = true
  const toggle = () => (open = !open)
</script>

<div class="{ [1, 3, undefined].includes(colorTheme) ? 'light' : 'dark' }">
  <h2 class="drop-section">
    <div on:click={toggle} on:keyup="{toggle}" tabindex="0" role="button">
      {$t('users.peers')} ({participants.length})
      <span class="{ open ? 'chevron-down' : 'chevron-right' }"></span>
    </div>
  </h2>
  {#if open}
    <ul>
      {#each participants as ct (ct._id)}
        <li class:active={selUsers[ct._id]} in:fade="{{ delay: 100, duration: 190 }}">
          <img src="{ct.avatar || 'https://vscode.codeawareness.com/icons/user-solid.svg'}" :alt="{ct.email}" on:click="{selectPeer(ct)}" on:keyup="{selectPeer(ct)}" alt="select peer" />
          <div on:click="{showProfile(ct)}" on:keyup="{showProfile(ct)}" tabindex="0" role="button">
            <i class="id-card"></i><span>{shortEmail(ct)}</span>
          </div>
        </li>
      {/each}
      {#if !participants.length }
        <li><i>{$t('users.noPeers')}</i></li>
      {/if}
    </ul>
  {/if}
</div>

<style lang="scss">
  @import '../styles/variables.scss';

  .active {
    filter: drop-shadow(0px 4px 10px rgba(0,0,0,0.8));

    span {
      background: #aa3939;
      color: white;
    }
  }

  h2 {
    &::before{
      background:url(https://vscode.codeawareness.com/icons/users-solid.svg) no-repeat;
    }
  }
  img {
    width: 65px;
    height: 65px;
    object-fit: cover;
    border-radius: 80px;
    cursor: pointer;
    margin-bottom: 8px;
  }
  img:hover {
    opacity: .9;
    filter: drop-shadow(0px 4px 10px rgba(0,0,0,0.8));
  }
  .light {
    color: $peer8-dark;
  }
  .dark {
    color: $peer8-light;
  }
  ul {
    display: flex;
    padding-left: 0;
    flex-wrap: wrap;
  }
  li {
    list-style-type: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em;
    margin-bottom: 20px;

      img {
        width: 2.5em;
        height: auto;
      }

    div:hover {
      background: #aa3939;
      color: white;
    }

    span {
      padding: 0.3em 1em;
    }
  }
  li:nth-child(4n) {
    margin-right: 0;
  }
  .id-card {
    width: 1em;
    height: 1em;
    padding: 0 0.5em;
    background: url(https://vscode.codeawareness.com/icons/id-card-solid.svg) no-repeat;
    background-size: contain;
  }
</style>
