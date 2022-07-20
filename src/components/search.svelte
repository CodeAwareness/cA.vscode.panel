<script lang="ts">
  import { settings } from '@/store/app.store'

  let colorTheme = 1
  settings.subscribe((val: any) => (colorTheme = val.colorTheme))
</script>

<div class="{ [1, 3, undefined].includes(colorTheme) ? 'light' : 'dark' }">
  <form class="clearfix searchform">
    <label for="search-box">
      <span><i class="fas fa-search"></span>
    </label>
    <input type="search" id="search-box" placeholder="" />
  </form>
</div>

<style lang="scss">
  .searchform {
    display: block;
    margin: 0 0 15px 0;
    position: relative;
  }

  .searchform label,
  .searchform input {
    color: #737373;
    vertical-align: baseline;
  }

  .searchform label {
    margin: .125em .125em 0 0;
  }
  span {
    position: absolute;
    width: 20px;
    bottom: 20px;
    left: 10px;
  }

  .searchform input[type=search] {
    font: 1em/1.618 Open Sans, Arial, Sans-serif;
    border: 1px solid #737373;
    border-width: 0 0 1px;
    background-color: transparent;
    padding: .1875em 2em;
    width: 99%;
    font-size: 20px;
  }

  .searchform input[type=search]:focus {
    box-shadow: 0px 10px 10px -8px #1abc9c;
    border-color: #1abc9c;
    color: #5A5A5A;
    font-weight: bold;
    outline: 0;
  }
  @media only screen and (min-width: 48em) {
    .searchform input[type=search]{ width: 100%; }
  }
</style>
