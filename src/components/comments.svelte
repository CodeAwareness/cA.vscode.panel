<script lang="ts">
  import type WSIO from '@/wsio'

  import moment from 'moment-timezone'
  import { fade } from 'svelte/transition'

  import { getURL, postData } from '@/services/connect'
  import { t } from '@/services/i18n'
  import { activeProject, settings } from '@/store/app.store'
  import { vscode } from '@/store/vscode.store'
  import logger from '@/services/logger'

  export let comments = []
  export let commentCount = 0
  export let newDates = {}
  export let _colorTheme = 1

  let newComment: string
  let project
  const loadPromise = fetchComments()
  let open = true
  let isCommenting = false

  const toggle = () => (open = !open)

  settings.subscribe(val => { logger.log('COLOR IS NOW', val); _colorTheme = val.colorTheme })

  // TODO: dispose of these when closing the panel
  activeProject.subscribe(val => {
    project = val
    fetchComments()
  })

  function showInput() {
    isCommenting = true
    setTimeout(() => {
      document.getElementById('commentInput').focus()
    }, 100)
  }

  function dayBreak() {
    let oldD = ''
    newDates = comments.reduce((acc, c) => {
      const newD = moment(new Date(c.updatedAt).toISOString()).format('YYYY-MM-DD')
      if (newD !== oldD) {
        acc[c._id] = newD
        oldD = newD
      }
      return acc
    }, {})
  }

  function addComment(comment) {
    comments.push(comment)
    dayBreak()
  }

  function fetchComments() {
    if (!project) return
    const { activePath, repo, origin } = project
    if (!origin || !repo || !repo.branch || !activePath) return
    return getURL(`/discussions?origin=${encodeURIComponent(origin)}&branch=${encodeURIComponent(repo.branch)}&file=${encodeURIComponent(activePath)}`)
      .then(response => {
        comments = response.data
        commentCount = comments.length
        dayBreak()
      })
  }

  function submitComment() {
    const comment = newComment
    if (!project) {
      vscode.API.postMessage({ command: 'alert', text: 'Cannot post comments on a project without a repository.' })
      return
    }
    const { line, activePath, origin } = project
    const { branch, commit } = project.repo
    return postData('/discussions', {
      comment,
      origin: origin,
      branch,
      commit,
      file: activePath,
      line,
    })
      .then(fetchComments) // TODO: optimize - fetch only new comments
      .then(() => {
        newComment = ''
        isCommenting = false
      })
      .catch(err => {
        logger.log('submitComment failed', err)
        vscode.API.postMessage({ command: 'alert', text: 'Could not post message. ' + err })
      })
  }

  function closeCommentInput() {
    isCommenting = false
  }

  function keyUp(ev) {
  }

  function keyDown(ev) {
    if (ev.key === 'Escape') isCommenting = false
  }
</script>

<svelte:window on:keydown="{keyDown}" />

<div class="{ [1, 3, undefined].includes(_colorTheme) ? 'light' : 'dark' }">
  <h2 class="drop-section" on:click={toggle}>{$t('comments.comments')} ({ commentCount })
    <span class="{ open ? 'chevron-down' : 'chevron-right' }"></span>
  </h2>

  <div class="comment-wrap">

  {#await loadPromise}
    <p>{$t('loading')}</p>
  {:then}
    {#if open}
      <ul in:fade="{{ delay: 100, duration: 90 }}" out:fade="{{ duration: 90 }}">
        {#each comments as comment}
          {#if newDates[comment._id]}
            <div><h4>{moment(new Date(comment.updatedAt).toISOString()).format('YYYY-MM-DD')}</h4></div>
          {/if}
          <li>
            <div class="comment-content">
              <img src="{comment.a.v}" alt="Profile avatar" />
              <ul>
                <li style="color: #2B91D8;">
                  <div><i class="clock"></i> ({moment(new Date(comment.updatedAt).toISOString()).format('h:mm a')}) <span>{comment.a.a || comment.a.e}</span></div>
                  <li>{comment.c}</li>
                  <li></li>
                </ul>
              </div>
              <hr>
              <ul class="comment-action">
                <li><i class="reply"></i></li>
                <li><i class="smile"></i></li>
                <li><i class="pen"></i></li>
                <li><i class="link"></i></li>
                <li><i class="trash"></i></li>
              </ul>
            </li>
          {/each}
        </ul>
    {/if}
    <!-- button type="submit" class="btn btn-primary" on:click={debugDiffs}>Send Diffs</button -->
  {:catch error}
    <p class="error">{error.message}</p>
  {/await}

  </div>

  <div class="comment-input">
    <textarea bind:value={newComment} on:keyup={keyUp} placeholder="{$t('comments.typeYourComment')}" id="commentInput"></textarea>
    <button type="submit" class="btn btn-primary" on:click={submitComment}><i class="share-square"></i>{$t('send')}</button>
  </div>

</div>

<style lang="scss">
  @import '../styles/variables.scss';

  h2 {
      &::before{
        background:url(https://ext.codeawareness.com/images/icons/comment-alt-regular.svg) no-repeat;
      }
  }

  ul li {
    margin-top: 0.5em;
    list-style: none;

      div span {
        padding-left: 1em;
        color: $peer8-dark;
      }
  }

  .light {
    color: black;

      .comment-input {
        background: white;
      }
      hr {
        border: 1px solid #eee;
      }
  }

  .dark {
    color: white;

      hr {
        border: 1px solid #444;
      }

      ul li {
        div span {
          color: $peer8-light;
        }
      }

      .comment-input {
        background: black;
      }
  }

  .comment-wrap {
    padding: 15px;
    margin-bottom: 10em;

      &::-webkit-scrollbar {
        width: 7px;
      }

      &::-webkit-scrollbar-thumb {
        background: linear-gradient(0deg,#43e2c6,#3183d0);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(100,100,100, .3);
      }
  }
  .comment-input {
    position: fixed;
    width: calc(100% - 40px);
    bottom: 0;

      textarea {
        border: 1px solid #9E9E9E;
        width: calc(100% - 20px);
        height: 4em;
        outline: none;
        -webkit-transition: all .3s;
        transition: all .2s;
        padding: 10px;

          &:focus {
            box-shadow: 0 0 7px #1abc9c;
            border: 1px solid #1abc9c;
          }
      }

      button {
        background: #aa3939;
        color: white;
        border-radius: 1em;
        border: none;
        margin-bottom: 5px;
        margin-right: 1em;
        padding: 0.5em 1em;
      }

      @media screen and (min-width: 1024px){
        width: 46%;
      }
  }

  .clock {
    background: url(https://ext.codeawareness.com/images/icons/clock-regular.svg) no-repeat;
  }

  .share-square {
    background: url(https://ext.codeawareness.com/images/icons/share-square-solid.svg) no-repeat;
  }

  .reply {
    background: url(https://ext.codeawareness.com/images/icons/reply-solid.svg) no-repeat;
  }

  .link {
    background: url(https://ext.codeawareness.com/images/icons/link-solid.svg) no-repeat;
  }

  .smile {
    background: url(https://ext.codeawareness.com/images/icons/smile-solid.svg) no-repeat;
  }

  .pen {
    background: url(https://ext.codeawareness.com/images/icons/pen-solid.svg) no-repeat;
  }

  .trash {
    background: url(https://ext.codeawareness.com/images/icons/trash-solid.svg) no-repeat;
  }

</style>
