<script lang="ts">
  import { fade } from 'svelte/transition'

  import { settings } from '@/store/app.store'
  import { vscode } from '@/store/vscode.store'
  import { t } from '@/services/i18n'

  let colorTheme = 1 // Color theme can be 1 or 2 (from VSCode 1 = light, 2 = dark)
  settings.subscribe(val => (colorTheme = val.colorTheme))

  export let contextItems = []
  let newContext: string

  function addContext() {
    const citem = newContext.trim()
    contextItems.push(citem)
    contextItems = contextItems // svelte needs this to detect changes in the array
    vscode.API.postMessage({ command: 'event', key: 'context:add', data: citem })
    newContext = ''
  }

  function keyUp(ev) {
    // add Context upon pressing the Enter key
    if (ev.key === 'Enter') addContext()
  }

  function showContext(contextItem) {
    console.log('showing context', contextItem)
  }

  // Toggle
  let open = true
  const toggle = () => (open = !open)
</script>

<div class="{ [1, 3, undefined].includes(colorTheme) ? 'light' : 'dark' }">
  <h2 class="drop-section">
    <div on:click={toggle} on:keyup="{toggle}" tabindex="0" role="button">
      {$t('context.items')} ({contextItems.length})
      <span class="{ open ? 'chevron-down' : 'chevron-right' }"></span>
    </div>
  </h2>
  {#if open}
  <div>
    <input bind:value={newContext} on:keyup={keyUp} placeholder="{$t('context.typeNewContext')}" id="contextInput">
    <button on:click={addContext}>Add</button>
    <ul in:fade="{{ delay: 100, duration: 90 }}" out:fade="{{ duration: 90 }}">

      {#each contextItems as ci}
        <div on:mouseover={ showContext(ci) } on:focus="{ void(0) }" tabindex="0" role="button">
          <img src="https://vscode.codeawareness.com/icons/link-solid.svg" />
          <span>{ ci }</span>
        </div>
      {/each}

      {#if !contextItems.length }
        <li><i>{$t('context.noItems')}</i></li>
      {/if}
    </ul>
  </div>
  {/if}
</div>

<style lang="scss">
  @import '../styles/variables.scss';

  h2 {
    &::before {
      background:url(https://vscode.codeawareness.com/icons/link-solid.svg) no-repeat;
    }
  }

  input {
    margin: 2em 0 0 2em;
    border: 1px solid #9E9E9E;
    outline: none;
    -webkit-transition: all .3s;
    transition: all .2s;
    padding: 10px;
    font-size: 1rem;

      &:focus {
        box-shadow: 0 0 7px #1abc9c;
        border: 1px solid #1abc9c;
      }
  }

  button {
    cursor: pointer;
    background: #aa3939;
    color: white;
    border-radius: 1em;
    border: none;
    margin-bottom: 5px;
    margin-right: 1em;
    padding: 0.5em 1em;
    font-size: 1rem;
  }

  ul {
    display: flex;
    align-items: flex-start;

    div {
      margin: 5px;
      padding: 3px;

      img {
        display: inline-block;
        width: 16px;
      }
    }
  }
</style>