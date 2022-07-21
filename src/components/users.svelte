<script lang="ts">
  import type WSIO from '@/wsio'

  import config from '@/config'
  import { fade } from 'svelte/transition'

  import { _ } from '@/services/i18n'
  import { refreshUsers } from '@/services/users'

  import { activeProject, settings, wsIO } from '@/store/app.store'
  import { contributors, selectedBranch, selectedContributor } from '@/store/contributors.store'
  import { activeProfile } from '@/store/user.store'
  import { vscode } from '@/store/vscode.store'

  let participants = []
  let selUsers = {}
  let colorTheme = 1 // Color theme can be 1 or 2 (from VSCode 1 = light, 2 = dark)

  let project

  settings.subscribe(val => (colorTheme = val.colorTheme))

  let wsEngine: WSIO
  wsIO.subscribe(val => {
    wsEngine = val
    wsEngine.uSocket?.on('cameOnline', cameOnline)
  })

  function cameOnline(user) {
    console.log('USER CAME ONLINE', user)
  }

  selectedContributor.subscribe((ct: any) => {
    selUsers = {}
    if (ct) selUsers[ct._id] = 1
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
  contributors.subscribe(value => {
    if (!value) return (participants = [])
    let needsRefresh
    const pids = Object.keys(value).filter(pid => pid !== 'alines')
    selUsers = {}
    /* eslint-disable-next-line array-callback-return */
    pids.map(pid => {
      const p = value[pid]
      p.user = pid
      selUsers[pid] = 0
      needsRefresh = needsRefresh || !value[pid].email
    })
    if (needsRefresh) {
      refreshUsers(pids).then(({ data }) => {
        participants = data.results || []
        /* eslint-disable-next-line array-callback-return */
        participants.map(p => {
          p.s = value[p._id].s
          p.k = value[p._id].k
        })
      })
    }
  })

  function selectContributor(ct) {
    if (!ct) return
    if (selUsers[ct._id]) {
      selUsers[ct._id] = 0
      vscode.API.postMessage({ command: 'event', key: 'contrib:unselect', data: ct })
      // localService.unselectContributor(ct)
      return
    }
    selectedBranch.set(undefined)
    selectedContributor.set(ct)
    Object.keys(selUsers).map(id => (selUsers[id] = 0))
    selUsers[ct._id] = 1
    vscode.API.postMessage({ command: 'event', key: 'contrib:select', data: ct })
    // localService.selectContributor(ct)
  }

  // Toggle
  let open = true
  const toggle = () => (open = !open)
</script>

<div class="{ [1, 3, undefined].includes(colorTheme) ? 'light' : 'dark' }">
  <h2>
    <div on:click={toggle}>
      {$_('users.contributors')} ({participants.length})
      <span class="{ open ? 'chevron-down' : 'chevron-right' }"></span>
    </div>
  </h2>
  {#if open}
    <ul>
      {#each participants as ct (ct._id)}
        <li class:active={selUsers[ct._id]} in:fade="{{ delay: 100, duration: 190 }}">
          <img src="{ct.avatar}" alt="Profile avatar" on:click="{selectContributor(ct)}" />
          <div on:click="{showProfile(ct)}">
            <i class="id-card"></i><span>{shortEmail(ct)}</span>
          </div>
        </li>
      {/each}
      {#if !participants.length }
        <li><i>{$_('users.noContributors')}</i></li>
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
    display: block;
    display: inline-block;
    font-size: 1em;
    color: #EF71E5;
    cursor: pointer;
    margin-bottom: 0;
    width: 100%;

    div {
      display: inline-block;
      margin-right: 1em;
    }

    .chevron-down {
      width: 1em;
      height: 1em;
      padding: 0 0.5em;
      background: url(https://ext.peer8.com/images/icons/chevron-down-solid.svg) no-repeat;
      background-size: contain;
    }

    .chevron-right {
      width: 1em;
      height: 1em;
      padding: 0 0.5em;
      background: url(https://ext.peer8.com/images/icons/chevron-right-solid.svg) no-repeat;
      background-size: contain;
    }

    span {
      margin-left: 10px;
      color: #607D8B;
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
    background: url(https://ext.peer8.com/images/icons/id-card-solid.svg) no-repeat;
    background-size: contain;
  }
</style>
