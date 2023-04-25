<script lang="ts">
  import { settings } from '@/store/app.store'

  let colorTheme = 1
  settings.subscribe((val: any) => (colorTheme = val.colorTheme))
</script>

<div>
  <form class="clearfix searchform">
    <label for="search-box">
    </label>
    <input type="search" id="search-box" placeholder="" />
  </form>
</div>

<style lang="scss">
  label {
    position: absolute;
    top: 20px;

    &::before{
      content:"";
      display:inline-block;
      width:1.4em;
      height: 1.4em;
      margin-right: 5px;
      background:url(https://ext.codeawareness.com/images/icons/search-solid.svg) no-repeat;
      background-size:contain;
    }
  }

  .searchform {
    margin: 20px 0 15px 0;

      input[type=search] {
        border: 1px solid #737373;
        border-width: 0 0 1px;
        background-color: transparent;
        padding: 0.2em 2em 0.5em;
        width: 99%;

          &:focus {
            box-shadow: 0px 10px 10px -8px #1abc9c;
            border-color: #1abc9c;
            color: #5A5A5A;
            font-weight: bold;
            outline: 0;
          }

          @media only screen and (min-width: 48em) {
            width: 100%;
          }
      }
  }

</style>
