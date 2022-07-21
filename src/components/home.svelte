<script lang="ts">
  // @ts-check
  import type WSIO from '@/wsio'

  import { tokens } from '@/store/user.store'
  import { i18nReady, wsIO } from '@/store/app.store'

  import Login from './login.svelte'
  import Dashboard from './dashboard.svelte'

  let showUX: boolean
  let isAuthenticated = false

  tokens.subscribe((value: any) => {
    console.log('TOKENS', value)
    isAuthenticated = value && !!value.access
  })

  let wsEngine: WSIO
  wsIO.subscribe(val => {
    wsEngine = val
    console.log('wsEngine', wsEngine)
    wsEngine.rSocket?.on('updateAvailable', fetchDiffs)
  })

  i18nReady.subscribe((val) => setTimeout(() => (showUX = val), 100))

  // TODO: for paid plans, we could sync as soon as any peer file is changed / saved
  function fetchDiffs({ repoOrigin, uid }) {
    console.log('UPDATE AVAILABLE', uid, repoOrigin)
    // vscode.API.postMessage({ command: 'repo:fetchDiffs', repoOrigin })
  }
</script>

<style lang="scss">
  @import "../styles/variables.scss";
  @import "../styles/global.scss";

  div.login {
    margin-top: 4em;
  }
</style>

<div>
  {#if showUX}
    {#if isAuthenticated}
      <h1>AUTHENTICATED</h1>
      <Dashboard />
    {:else}
      <h1>PLEASE LOGIN</h1>
      <div class="login">
        <Login />
      </div>
    {/if}
  {/if}
</div>
