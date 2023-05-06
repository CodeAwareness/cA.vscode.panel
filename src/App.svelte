<script lang="ts">
  import Home from '@/components/home.svelte'
  import { settings } from '@/store/app.store'
  import { SvelteToast } from '@zerodevx/svelte-toast'

  let _colorTheme = 'light'
  settings.subscribe(val => {
    console.log('color theme', val)
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

  :global(.light) {
    color: black;

      :global(textarea) {
        background-color: white;
        color: black;
      }
  }

  :global(.dark) {
    color: $peer8-light;

      :global(textarea) {
        background-color: black;
        color: white;
      }

      :global(a) {
        color: $marine;

          &:hover {
            color: white;
          }
      }
  }

  :global(.drop-section) {
    display: inline-block;
    font-size: 1em;
    color: #175068;
    cursor: pointer;
    margin-bottom: 0;

    :global(div) {
      display: inline-block;
      margin-right: 1em;
    }

    &::before{
      content:"";
      display:inline-block;
      width:1em;
      height: .9em;
      margin-right: 5px;
      background-size:contain;
    }

    :global(.chevron-down) {
      width: 1em;
      height: 1em;
      padding: 0 0.5em;
      background: url(https://ext.codeawareness.com/images/icons/chevron-down-solid.svg) no-repeat;
      background-size: contain;
    }

    :global(.chevron-right) {
      width: 1em;
      height: 1em;
      padding: 0 0.5em;
      background: url(https://ext.codeawareness.com/images/icons/chevron-right-solid.svg) no-repeat;
      background-size: contain;
    }

    :global(span) {
      margin-left: 10px;
      color: #607D8B;
    }
  }
</style>
