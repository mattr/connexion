<script lang="ts">
  import type { Person, PersonInput } from '$lib/pocketbase/types';

  export let person: Partial<Person> = {};
  export let submitLabel = 'Save person';
  export let submitting = false;
  export let error = '';
  export let onSubmit: (input: PersonInput) => Promise<void> | void;

  let name = person.name ?? '';
  let nickname = person.nickname ?? '';

  async function submit() {
    await onSubmit({
      name,
      nickname
    });
  }
</script>

<form class="card stack" on:submit|preventDefault={submit}>
  {#if error}
    <p class="error">{error}</p>
  {/if}

  <label>
    Name
    <input bind:value={name} maxlength="255" required autocomplete="name" />
  </label>

  <label>
    Nickname
    <input bind:value={nickname} maxlength="255" />
  </label>

  <div class="actions">
    <button type="submit" disabled={submitting}>{submitLabel}</button>
    <slot name="actions" />
  </div>
</form>
