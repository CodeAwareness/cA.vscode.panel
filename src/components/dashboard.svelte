<script lang="ts">
  import { mode } from '@/store/app.store'
  import { activeProfile } from '@/store/user.store'
  import Users from './users.svelte'
  import Branches from './branches.svelte'
  import Profile from './profile.svelte'

  import Search from './search.svelte'

  let activeMode = 'repo'

  activeProfile.subscribe(user => (activeMode = !!user && 'profile'))

  // Modes: profile, repo
  mode.subscribe(m => (activeMode = m))
</script>

{#if activeMode === 'repo'}
  <Search/>
  <div class="container">
    <Users />
    <Branches />
  </div>
  <!-- div class="container">
    <Comments />
  </div -->
{:else if activeMode === 'profile'}
  <div class="container">
    <Profile />
  </div>
{/if}

<style lang="scss">
  @import '../styles/variables.scss';
</style>
