<script lang="ts">
  import type WSIO from '@/wsio'

  import { onDestroy } from 'svelte'
  import { fade } from 'svelte/transition'
  import { get } from 'lodash-es'

  import config from '@/config'
  import { _ } from '@/services/i18n'
  import { logger } from '@/services/logger'
  import apiError from '@/services/api-error'

  import { locale, settings, wsIO } from '@/store/app.store'
  import { user, tokens } from '@/store/user.store'
  import { vscode } from '@/store/vscode.store'
  import { addToast } from "@/store/toast.store"

  let isLoading = false
  let isSigningIn = true
  let email = process.env.LOCAL ? 'hana@codeawareness.com' : ''
  let password = process.env.LOCAL ? 'qwe12309' : ''
  let showForgotPassword: number
  let userData: any // TODO
  let tokensData: any // TODO
  let language: string
  let colorTheme = 1

  let wsEngine: WSIO
  wsIO.subscribe(val => (wsEngine = val))
  wsEngine.uSocket
      .transmit('auth:info')
      .then(data => {
        user.set(data.user || null)
        tokens.set(data.tokens || null)
      })
      .catch(err => {
        logger.info('Not logged in yet', err)
      })

  const userSub = user.subscribe(val => (userData = val)) // TODO
  const tokensSub = tokens.subscribe(val => (tokensData = val)) // TODO
  const settingsSub = settings.subscribe(val => (colorTheme = val.colorTheme))
  const localeSub = locale.subscribe(val => (language = val))

  onDestroy(userSub)
  onDestroy(tokensSub)
  onDestroy(settingsSub)
  onDestroy(localeSub)

  function storeAuthInfo(data: any) {
    user.set(data.user || null)
    tokens.set(data.tokens || null)
  }

  function auth() {
    isLoading = true
    wsEngine.uSocket
      .transmit('auth:login', { strategy: 'local', email, password })
      .then(data => {
        storeAuthInfo(data)
      })
      .catch(err => {
        logger.error(err.message)
        addToast(`Login failed ! \r${apiError(err)}`, 'error')
      })
      .finally(() => {
        isLoading = false
      })
  }

  logger.log('API:', `${config.SERVER_URL}/log/log`)

</script>

<form on:submit|preventDefault={auth} in:fade="{{ delay: 300, duration: 600 }}" out:fade="{{ duration: 200 }}">

  <div class="login { [1, 3, undefined].includes(colorTheme) ? 'light' : 'dark' }">
    <h2><img src="https://codeawareness.com/img/cA-logo.svg" alt="Code Awareness logo" /> <div>{$_('auth.title')}</div></h2>
  </div>

  <div class="social { [1, 3, undefined].includes(colorTheme) ? 'light' : 'dark' }">
    <div>{$_('auth.loginWith')}</div>
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

  <div class="right">
    <p>{$_('auth.dontHaveAccount')} <a href on:click|preventDefault="{() => (isSigningIn = false)}">{$_('auth.ClickToSignup')}</a></p>
  </div>
</form>

<style lang="scss">
  @import '../styles/variables.scss';

  form {
    position:relative;
    max-width: 25em;
    min-height: 40em;
    margin: 0 auto;
    padding: 1em 2em;

    h2 {
      zoom: 0.8;
      color: #204f67;
      font-size: 2em;
      margin-top: 1em;
      margin-left: 1em;
      font-weight: 200;

      img {
        float: left;
        max-width: 2em;
        height: auto;
      }

      div {
        padding-left: 2.5em;
        line-height: 2em;
      }
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
</style>
