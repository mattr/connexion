<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import MembershipForm from '$lib/components/MembershipForm.svelte';
  import { deleteMembership, updateMembership } from '$lib/pocketbase/memberships';
  import type { MembershipInput } from '$lib/pocketbase/types';
  import type { PageData } from './$types';

  export let data: PageData;

  let editingId = '';

  async function save(membershipId: string, input: MembershipInput) {
    await updateMembership(membershipId, input);
    editingId = '';
    await invalidateAll();
  }

  async function remove(membershipId: string, personName: string) {
    if (!window.confirm(`Remove ${personName} from ${data.group.name}?`)) {
      return;
    }

    await deleteMembership(membershipId);
    await invalidateAll();
  }
</script>

<section class="page-header">
  <div>
    <h1>{data.group.name}</h1>
    {#if data.group.description}
      <p class="muted">{data.group.description}</p>
    {/if}
  </div>
  <a class="button secondary" href={`/groups/${data.group.id}/edit`}>Edit group</a>
</section>

<section class="stack">
  <article class="card stack">
    <div class="section-title">
      <h2>Members</h2>
      <a class="button" href={`/groups/${data.group.id}/memberships/new`}>Add people</a>
    </div>
    {#if data.memberships.length === 0}
      <p class="muted">No members yet.</p>
    {:else}
      {#each data.memberships as membership}
        <div class="member-row">
          {#if editingId === membership.id}
            <MembershipForm membership={membership} fixedPerson={membership.person} fixedGroup={data.group.id} onSubmit={(input) => save(membership.id, input)} submitLabel="Save note">
              <button slot="actions" class="secondary" type="button" on:click={() => (editingId = '')}>Cancel</button>
            </MembershipForm>
          {:else}
            <div>
              <a href={`/people/${membership.person}`}><strong>{membership.expand?.person?.name ?? membership.person}</strong></a>
              {#if membership.note}
                <p>{membership.note}</p>
              {/if}
            </div>
            <div class="actions">
              <button class="secondary" type="button" on:click={() => (editingId = membership.id)}>Edit note</button>
              <button class="danger" type="button" on:click={() => remove(membership.id, membership.expand?.person?.name ?? 'this person')}>Remove</button>
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </article>
</section>

<style>
  h2,
  p {
    margin-block: 0;
  }

  .section-title,
  .member-row {
    align-items: start;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  .member-row {
    border-top: 1px solid #e0d6c7;
    padding-top: 0.8rem;
  }

  .member-row:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  @media (max-width: 720px) {
    .section-title,
    .member-row {
      display: grid;
    }
  }
</style>
