<script lang="ts">
  import { tokens } from '@/store/user.store'
  import { i18nReady } from '@/store/app.store'

  import Login from './login.svelte'
  import Dashboard from './dashboard.svelte'

  let showUX: boolean
  let isAuthenticated = false

  tokens.subscribe((value: any) => {
    console.log('TOKENS', value)
    isAuthenticated = value && !!value.access
  })

  i18nReady.subscribe((val) => setTimeout(() => (showUX = val), 100))

</script>

<style lang="scss">
  @import "../styles/variables.scss";
  @import "../styles/global.scss";

  div.login {
    margin-top: 4em;
  }
</style>

{#if showUX}
  {#if isAuthenticated}
    <Dashboard />
  {:else}
    <div class="login">
      <Login />
    </div>
  {/if}
{/if}
