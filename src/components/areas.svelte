<script lang="ts">
  import { settings } from '@/store/app.store'

  let activeArea: string
  let colorTheme = 1

  settings.subscribe((val) => (colorTheme = val.colorTheme))

  function selectArea(area: string) {
    return function() {
      activeArea = area
    }
  }
</script>

<div class="{ [1, 3, undefined].includes(colorTheme) ? 'light' : 'dark' }">
    <ul>
        <li><a href on:click="{selectArea('dashboard')}">Diffs</a></li>
        <li><a href on:click="{selectArea('issues')}">Issues</a></li>
        <li><a href on:click="{selectArea('docs')}">Docs</a></li>
        <li><a href on:click="{selectArea('policy')}">Policy</a></li>
    </ul>
</div>

<style lang="scss">
  @import '../styles/variables.scss';

  a {
    display: block;
    padding: 0.3em;
    cursor: pointer;
  }
  a:hover {
    text-decoration: none;
    background: #dcdcdc;
    transition: .3s;
  }
  ul {
    display: flex;
    padding-left: 0;
  }

  li {
    width: 25%;
    text-align: center;
    border-bottom: 1px solid #5A5A5A;
    border-left: 1px solid #5A5A5A;
    border-top: 1px solid #5A5A5A;
    list-style: none;
    font-size: 0.9em;
  }
  li:last-child {
    border-right: 1px solid #5A5A5A;
  }

  .light {
    color: $peer8-dark;
  }
  .dark {
    color: $peer8-light;
  }
  @media screen and (max-width: 375px) {
    li {
      font-size: .7em;
    }
  }
</style>
