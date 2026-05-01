<script lang="ts">
  import { goto } from '$app/navigation';
  import MembershipForm from '$lib/components/MembershipForm.svelte';
  import { createMembership } from '$lib/pocketbase/memberships';
  import type { MembershipInput } from '$lib/pocketbase/types';
  import type { PageData } from './$types';

  export let data: PageData;

  let error = '';
  let submitting = false;
  $: memberIds = new Set(data.memberships.map((membership) => membership.person));
  $: availablePeople = data.people.filter((person) => !memberIds.has(person.id));

  async function submit(input: MembershipInput) {
    error = '';
    submitting = true;

    try {
      await createMembership(input);
      await goto(`/groups/${data.group.id}`);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Could not add person to group.';
    } finally {
      submitting = false;
    }
  }
</script>

<section class="page-header">
  <div>
    <h1>Add people</h1>
    <p class="muted">Add someone to {data.group.name} and optionally record context.</p>
  </div>
</section>

{#if availablePeople.length === 0}
  <article class="card stack">
    <h2>No available people</h2>
    <p class="muted">Everyone is already in this group, or there are no people yet.</p>
    <a class="button secondary" href={`/groups/${data.group.id}`}>Back to group</a>
  </article>
{:else}
  <MembershipForm people={availablePeople} fixedGroup={data.group.id} onSubmit={submit} {submitting} {error} submitLabel="Add to group">
    <a slot="actions" class="button secondary" href={`/groups/${data.group.id}`}>Cancel</a>
  </MembershipForm>
{/if}
