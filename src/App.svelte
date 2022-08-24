<script lang="ts">
  import Home from '@/components/home.svelte'
  import { settings } from '@/store/app.store'
  import { SvelteToast } from '@zerodevx/svelte-toast'

  let _colorTheme = 'light'
  settings.subscribe(val => {
    _colorTheme = [1, 3, undefined].includes(val.colorTheme) ? 'light' : 'dark'
  })

  let toastOptions = {
    intro: { y: 256 }
  }

</script>

<main class="{ _colorTheme }">
  <Home />
  <SvelteToast options={toastOptions} />
</main>

<style lang="scss">
  @import './styles/variables.scss';

  * {
    margin:0;
    padding:0;
  }

  :global(body) {
    font-family: 'Source Sans Pro', sans-serif;
  }

  main {
    width: 100%;
    /* zoom: 0.8; */
    margin: 0 auto;
  }

  .light {
    color: black;
  }

  .dark {
    color: white;
  }
</style>
