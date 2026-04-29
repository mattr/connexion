<script lang="ts">
  import { goto } from '$app/navigation';
  import { login } from '$lib/pocketbase/auth';

  let email = '';
  let password = '';
  let error = '';
  let submitting = false;

  async function submit() {
    error = '';
    submitting = true;

    try {
      await login(email, password);
      await goto('/people');
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Could not sign in.';
    } finally {
      submitting = false;
    }
  }
</script>

<main class="login-shell">
  <section class="login-card card stack">
    <div>
      <p class="eyebrow">Connexion</p>
      <h1>Open the address book</h1>
      <p class="muted">Sign in with your PocketBase user account.</p>
    </div>

    <form class="stack" on:submit|preventDefault={submit}>
      {#if error}
        <p class="error">{error}</p>
      {/if}

      <label>
        Email
        <input bind:value={email} type="email" autocomplete="email" required />
      </label>

      <label>
        Password
        <input bind:value={password} type="password" autocomplete="current-password" required />
      </label>

      <button type="submit" disabled={submitting}>Sign in</button>
    </form>
  </section>
</main>

<style>
  .login-shell {
    display: grid;
    min-height: 100vh;
    padding: 1rem;
    place-items: center;
  }

  .login-card {
    max-width: 28rem;
    width: 100%;
  }

  .eyebrow {
    font-size: 0.8rem;
    font-weight: 900;
    letter-spacing: 0.16em;
    margin: 0 0 0.5rem;
    text-transform: uppercase;
  }

  h1 {
    font-size: clamp(2rem, 10vw, 4rem);
    letter-spacing: -0.065em;
    line-height: 0.95;
    margin: 0;
  }
</style>
