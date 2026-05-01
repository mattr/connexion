<script lang="ts">
  import { goto } from '$app/navigation';
  import GroupForm from '$lib/components/GroupForm.svelte';
  import { deleteGroup, updateGroup } from '$lib/pocketbase/groups';
  import type { GroupInput } from '$lib/pocketbase/types';
  import type { PageData } from './$types';

  export let data: PageData;

  let error = '';
  let submitting = false;

  async function submit(input: GroupInput) {
    error = '';
    submitting = true;

    try {
      await updateGroup(data.group.id, input);
      await goto(`/groups/${data.group.id}`);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Could not update group.';
    } finally {
      submitting = false;
    }
  }

  async function remove() {
    if (!window.confirm(`Delete ${data.group.name}? This cannot be undone.`)) {
      return;
    }

    await deleteGroup(data.group.id);
    await goto('/groups');
  }
</script>

<section class="page-header">
  <div>
    <h1>Edit group</h1>
    <p class="muted">Update {data.group.name}.</p>
  </div>
</section>

<GroupForm group={data.group} onSubmit={submit} {submitting} {error} submitLabel="Save group">
  <a slot="actions" class="button secondary" href={`/groups/${data.group.id}`}>Cancel</a>
</GroupForm>

<section class="danger-zone card stack">
  <div>
    <h2>Delete group</h2>
    <p class="muted">Remove this group and its memberships.</p>
  </div>
  <button class="danger" type="button" on:click={remove}>Delete group</button>
</section>

<style>
  .danger-zone {
    margin-top: 1rem;
  }

  h2,
  p {
    margin-block: 0;
  }
</style>
