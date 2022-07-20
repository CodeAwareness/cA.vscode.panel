<script lang="ts">
  import { activeProfile } from '@/store/user.store'
  import { settings } from '@/store/app.store'

  let user: any
  let userAlias: string
  activeProfile.subscribe(p => {
    user = p
    if (p) userAlias = user.name || user.email.substr(0, user.email.indexOf('@'))
  })

  let colorTheme
  settings.subscribe((val: any) => colorTheme = val.colorTheme)

  settings.subscribe(val => (colorTheme = val.colorTheme))

  function goBack() {
    activeProfile.set(false)
  }

  function sendStars() {
  }

</script>

<div class="{ [1, 3, undefined].includes(colorTheme) ? 'light' : 'dark' }">
  <div class="back" on:click="{goBack}">Back</div>
  <div class="user-card">
    <div class="summary">
      <ul>
        <li>Years of experience: 14</li>
        <li>Overall stars: 213</li>
        <li>Stars received this year: 74</li>
      </ul>
      <div on:click="{sendStars}">
        <i class="fas fa-star gold"></i>
        <a href>Kudos {userAlias}!</a>
      </div>
    </div>
    <img src="{user.avatar}" alt="Profile avatar" />
    <h2>{user.name || ''}</h2>
    <h4>{user.email}</h4>
  </div>

  <div class="stars">
    <ul>
      <li>
        <span>React: </span>
        <i class="fas fa-star gold"></i> (53)
      </li>
      <li>
        <span>Javascript: </span>
        <i class="fas fa-star silver"></i> (14)
      </li>
      <li>
        <span>HTML5: </span>
        <i class="fas fa-star gold"></i> (231)
      </li>
      <li>
        <span>CSS3: </span>
        <i class="fas fa-star gold"></i> (102)
      </li>
      <li>
        <span>ThreeJS: </span>
        <i class="fas fa-star silver"></i> (14)
      </li>
      <li>
        <span>Web Design: </span>
        <i class="fas fa-star gold"></i> (89)
      </li>
    </ul>
  </div>
</div>

<style lang="scss">
  @import '../styles/variables.scss';

  .back {
    cursor: pointer;
    display: block;
    width: 100%;
    border-bottom: 1px solid #ccc;
    padding: 0.5em 1em;
    margin-bottom: 0.5em;
  }

  img {
    width: 65px;
    height: 65px;
    object-fit: cover;
    border-radius: 80px;
    cursor: pointer;
    margin-bottom: 8px;
  }

  .user-card {
    margin-left: 1em;
  }

  .stars {
    display: table;

    ul {
      margin: 0;
      padding: 0 1em;
    }

    li {
      display: table-row;

      span {
        display: table-cell;
        padding-right: 1em;
      }
    }
  }

  .summary {
    float: right;
    width: 60%;

    ul {
      float: left;
    }

    div {
      cursor: pointer;
      padding: 1em;
      text-align: center;
    }

    a {
      display: block;
      padding: 1em;
    }

    i.fa-star {
      font-size: 200%;
    }
  }

  .light {
    i.gold {
      color: #f8b84f;
    }

    i.silver {
      color: #8e9d9a;
    }

    .stars {
      color: gray;
    }
  }

  .dark {
    i.gold {
      color: #f8b84f;
    }

    i.silver {
      color: #888;
    }

    .stars {
      color: white;
    }
  }
</style>
