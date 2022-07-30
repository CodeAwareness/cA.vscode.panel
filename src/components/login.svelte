<script lang="ts">
  import { fade } from 'svelte/transition'
  import { onDestroy } from 'svelte'
  import { vscode } from '@/store/vscode.store'

  import config from '@/config'
  import type WSIO from '@/wsio'
  import apiError from '@/services/api-error'
  import { t } from '@/services/i18n'
  import { logger } from '@/services/logger'

  import { wsIO, settings } from '@/store/app.store'
  import { user, tokens } from '@/store/user.store'
  import { addToast } from "@/store/toast.store"

  let colorTheme = 1
  let isLoading = false
  let stage = 'login'
  let email = 'admin@peer8.com'
  let password = 'qwe12309'
  let wsEngine: WSIO

  const vscodeAuth = data => {
    const key = 'auth:login',
    const command = 'event'
    vscode.API.postMessage({ command, key, data })
  }

  const wsSub = wsIO.subscribe(val => {
    wsEngine = val
    if (!wsEngine?.uSocket) return
    wsEngine.uSocket
        .transmit('auth:info')
        .then(data => {
          user.set(data.user || null)
          tokens.set(data.tokens || null)
          vscodeAuth(data)
        })
        .catch(err => {
          logger.info('Not logged in yet', err)
        })
  })

  const settingsSub = settings.subscribe(val => (colorTheme = val.colorTheme))

  onDestroy(wsSub)
  onDestroy(settingsSub)

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
        vscodeAuth(data)
      })
      .catch(err => {
        logger.error(err.message)
        addToast(`Login failed ! \r${apiError(err)}`, 'error')
      })
      .finally(() => {
        isLoading = false
      })
  }

  function signup() {
    isLoading = true
    wsEngine.uSocket
      .transmit('auth:signup', { email, password })
      .then(auth)
      .catch(err => {
        logger.error('Cannot register new account.', err)
        addToast(`Registration failed. \r${apiError(err)}`, 'error')
      })
      .finally(() => {
        isLoading = false
      })
  }

  function resetPassword() {
    isLoading = true
    wsEngine.uSocket
      .transmit('auth:sendPasswordReset', { email })
      .then(() => {
        addToast('Please check your email to reset your password.', 'success')
      })
      .catch(err => {
        addToast(`Could not send email. \r${apiError(err)}`, 'error')
      })
      .finally(() => {
        isLoading = false
      })
  }

  logger.log('API:', `${config.SERVER_URL}/v1/log/log`)

</script>

{#if stage === 'login' }
  <form on:submit|preventDefault={auth} in:fade="{{ delay: 300, duration: 600 }}" out:fade="{{ duration: 200 }}">
    <div class="login { [1, 3, undefined].includes(colorTheme) ? 'light' : 'dark' }">
      <h2><img src="https://codeawareness.com/img/cA-logo.svg" alt="Code Awareness logo" /> <div>{$t('auth.title')}</div></h2>
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
          <div class="right small"><a href="/reset-password" on:click|preventDefault="{() => stage = 'forgotPassword'}">{$t('auth.forgotPassword')}</a></div>

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
      <p>{$t('auth.dontHaveAccount')} <a href on:click|preventDefault="{() => (stage = 'signup')}">{$t('auth.clickToSignup')}</a></p>
    </div>
  </form>

{:else if stage === 'forgotPassword'}

  <form on:submit|preventDefault={resetPassword} in:fade="{{ delay: 300, duration: 600 }}" out:fade="{{ duration: 200 }}">
    <div class="login">
      <h2><img src="https://codeawareness.com/img/cA-logo.svg" alt="Code Awareness logo" /> <div>{$t('auth.title')}</div></h2>
      <h4>{$t('auth.resetPasswordWithEmail')}</h4>
      <div>
        <div>
          <input type="text" placeholder="{$t('email')}" bind:value={email} />
          <i class="fas fa-user"></i>
        </div>
      </div>

      {#if isLoading }
        <input type="submit" disabled value="{$t('auth.sendingEmail')}..." />
      {:else}
        <input type="submit" value="{$t('auth.sendEmail')}" />
      {/if}

    </div>

    <div class="right small padding">
      <hr />
      <p><a href on:click|preventDefault="{() => (stage = 'login')}">{$t('auth.returnToLogin')}</a></p>
    </div>
  </form>

{:else if stage === 'signup'}

  <form on:submit|preventDefault={signup} in:fade="{{ delay: 300, duration: 600 }}" out:fade="{{ duration: 200 }}">
    <div class="login">
      <h2><img src="https://codeawareness.com/img/cA-logo.svg" alt="Code Awareness logo" /> <div>{$t('auth.title')}</div></h2>
      <h4>{$t('auth.signUpWithEmail')}</h4>
      <div>
        <input type="text" placeholder="{$t('email')}" bind:value={email} />
        <i class="fas fa-user"></i>
      </div>
      <div>
        <input type="password" placeholder="{$t('password')}" bind:value={password} />
        <i class="fas fa-key"></i>
      </div>

      {#if isLoading }
        <input type="submit" disabled value="{$t('auth.registeringNow')}..." />
      {:else}
        <input type="submit" value="{$t('auth.register')}" />
      {/if}

    </div>

    <div class="right small padding">
      <hr />
      <p><a href on:click|preventDefault="{() => (stage = 'login')}">{$t('auth.returnToLogin')}</a></p>
    </div>
  </form>

{/if}

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
          border-color: #1abc9c;
          color: #5A5A5A;
          font-weight: bold;
          outline: 0;
        }

        &[type="submit"]{
          background: #F55A5A;
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

    .light {

      h4 {
        color: black;
      }

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
