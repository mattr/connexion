<script lang="ts">
  import { goto } from '$app/navigation';
  import MembershipForm from '$lib/components/MembershipForm.svelte';
  import { createMembership } from '$lib/pocketbase/memberships';
  import type { MembershipInput } from '$lib/pocketbase/types';
  import type { PageData } from './$types';

  export let data: PageData;

  let error = '';
  let submitting = false;
  $: joinedGroupIds = new Set(data.memberships.map((membership) => membership.group));
  $: availableGroups = data.groups.filter((group) => !joinedGroupIds.has(group.id));

  async function submit(input: MembershipInput) {
    error = '';
    submitting = true;

    try {
      await createMembership(input);
      await goto(`/people/${data.person.id}`);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Could not add group.';
    } finally {
      submitting = false;
    }
  }
</script>

<section class="page-header">
  <div>
    <h1>Add to group</h1>
    <p class="muted">Add {data.person.name} to a group.</p>
  </div>
</section>

{#if availableGroups.length === 0}
  <article class="card stack">
    <h2>No available groups</h2>
    <p class="muted">This person is already in every group, or there are no groups yet.</p>
    <a class="button secondary" href={`/people/${data.person.id}`}>Back to person</a>
  </article>
{:else}
  <MembershipForm groups={availableGroups} fixedPerson={data.person.id} onSubmit={submit} {submitting} {error} submitLabel="Add to group">
    <a slot="actions" class="button secondary" href={`/people/${data.person.id}`}>Cancel</a>
  </MembershipForm>
{/if}
