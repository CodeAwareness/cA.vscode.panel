<script lang="ts">
  import { t } from '@/services/i18n'
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
  <h2 class="drop-section">
    <div on:click={toggle} on:keyup="{toggle}" tabindex="0" role="button">
      {$t('branches.branches')} ({branches.length})
      <span class="{ open ? 'chevron-down' : 'chevron-right' }"></span>
    </div>
    <div on:click={refresh} on:keyup="{refresh}" tabindex="0" role="button">
      <i class="fas fa-sync-alt" style="{rotationTransform}"></i>
    </div>
  </h2>
  {#if open}
    <ul in:fade="{{ delay: 100, duration: 90 }}" out:fade="{{ duration: 90 }}">
      {#each branches as branch}
        <li on:click="{selectBranch(branch)}" class:active={selBranch[branch]} on:keyup="{selectBranch(branch)}" tabindex="0" role="button">
          <i class="fas fa-code-branch"></i>
          <span>{branch}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss">
  @import '../styles/variables.scss';

  h2 {
    &::before{
      background: url(https://vscode.codeawareness.com/icons/code-branch-solid.svg) no-repeat;
    }
  }

  ul {
    margin-bottom: 0;

      li {
        cursor: pointer;
        list-style-type: none;
        transition: .2s;
        line-height: 1.8em;
        padding-left: 1em;

          &.active {
            background: #F44336;
          }
          &:nth-child(5) {
            margin-right: 0;
          }

          &.active {
            background: #aa3939;
            color: white;
          }

          &:hover {
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
      }
  }
</style>
