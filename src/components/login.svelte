<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onDestroy } from 'svelte'
  import { vscode } from '@/store/vscode.store'

  import config from '@/config'
  import apiError from '@/services/api-error'
  import { t } from '@/services/i18n'
  import logger from '@/services/logger'
  import CAWWS from '@/services/wsio'

  import { settings } from '@/store/app.store'
  import { user, tokens } from '@/store/user.store'
  import { success, failure } from "@/store/toast.store"

  let colorTheme = 1
  let isLoading = false
  let stage = 'login'
  let email = ''
  let password = ''

  const vscodeAuth = data => {
    const key = 'auth:login',
    const command = 'event'
  }

  const settingsSub = settings.subscribe(val => (colorTheme = val.colorTheme))

  onDestroy(settingsSub)

  function storeAuthInfo(data: any) {
    user.set(data.user || null)
    tokens.set(data.tokens || null)
  }

  function auth() {
    isLoading = true
    CAWWS.transmit('auth:login', { strategy: 'local', email, password })
      .then(data => {
        storeAuthInfo(data)
        vscodeAuth(data)
      })
      .catch(err => {
        console.log('AUTH ERR', err)
        logger.error(err.message)
        failure(`Login failed ! \r${apiError(err)}`)
      })
      .finally(() => {
        isLoading = false
      })
  }

  logger.log('API:', `${config.EXT_MEDIA}/logger/log`)

</script>

  <form on:submit|preventDefault={auth}
        in:fade="{{ delay: 300, duration: 600 }}" out:fade="{{ duration: 200 }}"
        class="login { [1, 3, undefined].includes(colorTheme) ? 'light' : 'dark' }"
        >
    <div class="login">
      <h2><img src="https://vscode.codeawareness.com/images/codeawareness-logo.svg" alt="Code Awareness logo" /> <div>{$t('auth.title')}</div></h2>
      <div>
        <div>
          <input type="text" placeholder="{$t('email')}" bind:value={email} />
          <i class="fas fa-user"></i>
        </div>
      </div>
      <div>
        <div>
          <input type="password" placeholder="{$t('password')}" bind:value={password} />
          <i class="fas fa-key"></i>
          <div class="right small"><a href="https://codeawareness.com/login?s=reset">{$t('auth.forgotPassword')}</a></div>

          {#if isLoading }
            <input type="submit" disabled value="{$t('auth.loggingIn')}..." />
          {:else}
            <input type="submit" value="{$t('login')}" />
          {/if}
        </div>
      </div>
    </div>

    <div class="social">
      <div>{$t('auth.loginWith')}</div>
      <a href>
        <i class="fab fa-google"></i>
      </a>
      <a href>
        <i class="fab fa-github"></i>
      </a>
      <a href>
        <i class="fab fa-reddit"></i>
      </a>
      <a href>
        <i class="fab fa-facebook"></i>
      </a>
      <a href>
        <i class="fab fa-twitter"></i>
      </a>
      <a href>
        <i class="fab fa-line"></i>
      </a>
    </div>

    <div class="center small">
      <p>{$t('auth.dontHaveAccount')} <a href="https://codeawareness.com/login?s=signup">{$t('auth.clickToSignup')}</a></p>
    </div>
  </form>

<style lang="scss">
  @import '../styles/variables.scss';

  form {
    position:relative;
    max-width: 40em;
    min-height: 40%;
    margin: 0 auto;
    padding: 1em 2em;
    background: linear-gradient( 45deg, #b7dbe8, #ffebf0);
    filter: drop-shadow(10px 10px 10px rgba(0,0,0,0.6));

    &.light {
      h4 {
        color: black;
      }

      .login {
        input:focus {
          color: $marine;
        }
      }
    }

    &.dark {
      background: transparent;

      input {
        color: white;
      }

      h2 {
        color: $peer8-yellow;
      }
    }

    h2 {
      color: #204f67;
      font-size: 2em;
      margin-top: 1em;
      margin-left: 1em;
      font-weight: 200;

      img {
        float: left;
        max-width: 2em;
        height: auto;
        padding-right: 1rem;
      }

      div {
        margin-left: 0.5em;
        line-height: 2em;
      }
    }

    h4 {
      padding: 0 2em;
    }

    a {
      text-decoration: none;
      transition: .4s;
    }

    a:hover {
      opacity: .5;
      transition: .4s;
    }

    .login {

      > div {
        position: relative;
        display: inline-table;
        order: 2;
        padding: 0 2em;
        box-sizing: border-box;
        width: 100%;

        div {
        }
      }

      input {
        display: block;
        width: 100%;
        margin-top: 3em;
        border: 0;
        border-bottom: 1px solid #1b2538;
        background-color: transparent;

        &:focus {
          border-color: $marine;
          color: $peer8-yellow;
          outline: 0;
        }

        &[type="submit"]{
          background: $marine;
          padding: 0.7em;
          border-radius: 1.5em;
          border: unset;
          color: white;
          transition: .4s;
          cursor: pointer;
          max-width: 300px;
          margin: 1em auto;
        }

        &[type="submit"]:hover{
          background: #FF9800;
          transition: .4s;
        }
      }

      i {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 4px;
        left: 2em;
      }
    }

    .social {
      display: none;
      text-align: center;
      order: 1;

      div {
        margin: 2em auto;
        color: black;
      }

      a {
        margin: 0.7em 0.3em;
        &:hover {
          opacity: .5;
          transition: .4s;
        }
        &:nth-of-type(1) {
          color: #DF4A32;
        }
        &:nth-of-type(2) {
          color: #4D4D4D;
        }
        &:nth-of-type(3) {
          color: #E1301A;
        }
        &:nth-of-type(4) {
          color: #3B5998;
        }
        &:nth-of-type(5) {
          color: #5599F8;
        }
        &:nth-of-type(6) {
          color: #1DC321;
        }
        i {
          font-size: 2em;
          margin-right: 0.25em;
        }
      }
    }

    .right {
      text-align: right;
      margin: 1em 0.5em 2em;
      color: black;
    }

  }

  .center {
    text-align: center;
    padding: 0 0.5rem;
  }

  @media screen and (max-width: 400px) {
    form {
      padding: 1em 0;

      .login {
        h2 {
          margin-left: 0.5em;
        }

        div {
          i {
            left: 1em;
          }
        }
      }
    }
  }

  @media screen and (max-width: 400px) {
    .login {
      h2 {
        font-size: 1.4rem;

        img {
          max-width: 1.5em;
          padding-right: 0.4rem;
        }
      }
    }
  }
</style>
