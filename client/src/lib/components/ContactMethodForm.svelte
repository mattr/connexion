<script lang="ts">
  import { contactMethodKinds, type ContactMethod, type ContactMethodInput } from '$lib/pocketbase/types';

  export let contactMethod: Partial<ContactMethod> = { kind: 'email' };
  export let submitLabel = 'Save contact method';
  export let submitting = false;
  export let error = '';
  export let onSubmit: (input: ContactMethodInput) => Promise<void> | void;

  let kind = contactMethod.kind ?? 'email';
  let label = contactMethod.label ?? '';
  let value = contactMethod.value ?? '';

  async function submit() {
    await onSubmit({
      kind,
      label,
      value
    });
  }
</script>

<form class="card stack" on:submit|preventDefault={submit}>
  {#if error}
    <p class="error">{error}</p>
  {/if}

  <label>
    Kind
    <select bind:value={kind} required>
      {#each contactMethodKinds as option}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </label>

  <label>
    Label
    <input bind:value={label} maxlength="255" placeholder="home, work, GitHub, Signal" />
  </label>

  <label>
    Value
    <textarea bind:value rows="4" required placeholder="matt@example.com, +61 400 000 000, https://example.com"></textarea>
  </label>

  <div class="actions">
    <button type="submit" disabled={submitting}>{submitLabel}</button>
    <slot name="actions" />
  </div>
</form>
