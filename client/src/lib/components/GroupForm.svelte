<script lang="ts">
  import type { Group, GroupInput } from '$lib/pocketbase/types';

  export let group: Partial<Group> = {};
  export let submitLabel = 'Save group';
  export let submitting = false;
  export let error = '';
  export let onSubmit: (input: GroupInput) => Promise<void> | void;

  let name = group.name ?? '';
  let description = group.description ?? '';

  async function submit() {
    await onSubmit({ name, description });
  }
</script>

<form class="card stack" on:submit|preventDefault={submit}>
  {#if error}
    <p class="error">{error}</p>
  {/if}

  <label>
    Name
    <input bind:value={name} maxlength="255" required />
  </label>

  <label>
    Description
    <textarea bind:value={description} rows="4"></textarea>
  </label>

  <div class="actions">
    <button type="submit" disabled={submitting}>{submitLabel}</button>
    <slot name="actions" />
  </div>
</form>
