<script lang="ts">
  import type { Group, Membership, MembershipInput, Person } from '$lib/pocketbase/types';

  export let membership: Partial<Membership> = {};
  export let people: Person[] = [];
  export let groups: Group[] = [];
  export let fixedPerson = '';
  export let fixedGroup = '';
  export let submitLabel = 'Save membership';
  export let submitting = false;
  export let error = '';
  export let onSubmit: (input: MembershipInput) => Promise<void> | void;

  let person = fixedPerson || membership.person || '';
  let group = fixedGroup || membership.group || '';
  let note = membership.note ?? '';

  async function submit() {
    await onSubmit({ person, group, note });
  }
</script>

<form class="card stack" on:submit|preventDefault={submit}>
  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if !fixedPerson}
    <label>
      Person
      <select bind:value={person} required>
        <option value="" disabled>Select a person</option>
        {#each people as option}
          <option value={option.id}>{option.name}</option>
        {/each}
      </select>
    </label>
  {/if}

  {#if !fixedGroup}
    <label>
      Group
      <select bind:value={group} required>
        <option value="" disabled>Select a group</option>
        {#each groups as option}
          <option value={option.id}>{option.name}</option>
        {/each}
      </select>
    </label>
  {/if}

  <label>
    Note
    <textarea bind:value={note} rows="4" placeholder="Context for this person in this group"></textarea>
  </label>

  <div class="actions">
    <button type="submit" disabled={submitting || !person || !group}>{submitLabel}</button>
    <slot name="actions" />
  </div>
</form>
