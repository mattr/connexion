<script lang="ts">
  import { logout, session } from '$lib/pocketbase/auth';
</script>

<div class="shell">
  <header class="topbar">
    <a class="brand" href="/people">Connexion</a>
    <nav>
      <a href="/people">People</a>
      {#if $session.user?.email}
        <span class="muted">{$session.user.email}</span>
      {/if}
      <button class="secondary" type="button" on:click={logout}>Sign out</button>
    </nav>
  </header>

  <main>
    <slot />
  </main>
</div>

<style>
  .shell {
    margin: 0 auto;
    max-width: 68rem;
    padding: 1rem;
  }

  .topbar {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .brand {
    font-weight: 900;
    letter-spacing: -0.04em;
    text-decoration: none;
  }

  nav {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    justify-content: flex-end;
  }

  nav a {
    font-weight: 700;
    text-decoration: none;
  }

  nav button {
    padding-block: 0.45rem;
  }

  @media (max-width: 720px) {
    .topbar {
      align-items: start;
      display: grid;
    }

    nav {
      justify-content: start;
    }
  }
</style>
