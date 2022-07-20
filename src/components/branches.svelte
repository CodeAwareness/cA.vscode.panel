<script lang="ts">
  import { _ } from '@/services/i18n'
  import { activeProject, settings } from '@/store/app.store'
  import { selectedBranch, selectedContributor } from '@/store/contributors.store'
  import { vscode } from '@/store/vscode.store'
  import { fade } from 'svelte/transition'

  export let _colorTheme = 1
  export let branches = []
  let ap = {}
  let selBranch = {}
  let refreshTimer

  settings.subscribe(val => (_colorTheme = val.colorTheme))

  activeProject.subscribe((val: any) => {
    branches = val.branches || []
    ap = val
    if (refreshTimer) clearInterval(refreshTimer)
  })

  selectedBranch.subscribe((branch: string) => {
    selBranch = {}
    if (branch) selBranch[branch] = 1
  })

  function selectBranch(branch: string) {
    if (!branch) return
    selectedContributor.set(undefined)
    selectedBranch.set(!selBranch[branch] && branch)
    const key = selBranch[branch] ? 'branch:select' : 'branch:unselect'
    const command = 'event'
    vscode.API.postMessage({ command, key, data: branch })
  }

  let rotation = 0
  let rotationTransform = ''
  function refresh() {
    refreshTimer = setInterval(() => {
      rotation += 30
      rotationTransform = `transform: rotate(${rotation}deg)`
    }, 100)
    vscode.API.postMessage({ command: 'event', key: 'branch:refresh' })
  }

  let open = false
  const toggle = () => (open = !open)
</script>

<div class="{ [1, 3, undefined].includes(_colorTheme) ? 'light' : 'dark' }">
  <h2>
    <div on:click={toggle}>
      {$_('branches.branches')} ({branches.length})
      <span class="{ open ? 'fas fa-chevron-down' : 'fas fa-chevron-right' }"></span>
    </div>
    <div on:click={refresh}>
      <i class="fas fa-sync-alt" style="{rotationTransform}"></i>
    </div>
  </h2>
  {#if open}
    <ul in:fade="{{ delay: 100, duration: 90 }}" out:fade="{{ duration: 90 }}">
      {#each branches as branch}
        <li on:click="{selectBranch(branch)}" class:active={selBranch[branch]}>
          <i class="fas fa-code-branch"></i>
          <span>{branch}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss">
  @import '../styles/variables.scss';

  .active {
    background: #F44336;
  }
  h2 {
    display: block;
    display: inline-block;
    font-size: 1em;
    color: #EF71E5;
    cursor: pointer;
    margin-bottom: 0;

    div {
      display: inline-block;
      margin-right: 1em;
    }

    &::before{
      content:"";
      display:inline-block;
      width:1em;
      height: .9em;
      margin-right: 5px;
      background:url(https://ext.peer8.com/images/icons/code-branch-solid.svg) no-repeat;
      background-size:contain;
    }

    span {
      margin-left: 10px;
      color: #607D8B;
    }
  }
  i.fas {
    padding-right: 0.5em;
  }
  i.fas.fa-sync-alt {
    transform-origin: center;
    padding: 0;
  }
  .light {
    color: $peer8-dark;
  }
  .dark {
    color: $peer8-light;
  }
  ul {
    margin-bottom: 0;
  }
  li {
    cursor: pointer;
    list-style-type: none;
    transition: .2s;
  }
  li:nth-child(5) {
    margin-right: 0;
  }
  li.active {
    background: #aa3939;
    color: white;
  }
  li:hover {
    background: #aa3939;
    color: white;
    transition: .2s;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.1),
    0 1px 6px rgba(0, 0, 0, 0.05),
    0 8px 8px rgba(0, 0, 0, 0.1),
    0 5px 5px rgba(0, 0, 0, 0.1),
    3px 5px 5px rgba(0, 0, 0, 0.1),
    3px 5px 5px rgba(0, 0, 0, 0.1);
  }
</style>
