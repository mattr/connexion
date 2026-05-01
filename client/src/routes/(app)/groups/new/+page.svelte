<script lang="ts">
  import { goto } from '$app/navigation';
  import GroupForm from '$lib/components/GroupForm.svelte';
  import { createGroup } from '$lib/pocketbase/groups';
  import type { GroupInput } from '$lib/pocketbase/types';

  let error = '';
  let submitting = false;

  async function submit(input: GroupInput) {
    error = '';
    submitting = true;

    try {
      const group = await createGroup(input);
      await goto(`/groups/${group.id}`);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Could not create group.';
    } finally {
      submitting = false;
    }
  }
</script>

<section class="page-header">
  <div>
    <h1>Add group</h1>
    <p class="muted">Create a context that people can belong to.</p>
  </div>
</section>

<GroupForm onSubmit={submit} {submitting} {error} submitLabel="Create group">
  <a slot="actions" class="button secondary" href="/groups">Cancel</a>
</GroupForm>
