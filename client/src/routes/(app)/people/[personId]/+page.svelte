<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import MembershipForm from '$lib/components/MembershipForm.svelte';
  import { deleteContactMethod } from '$lib/pocketbase/contact-methods';
  import { deleteMembership, updateMembership } from '$lib/pocketbase/memberships';
  import type { MembershipInput } from '$lib/pocketbase/types';
  import type { PageData } from './$types';

  export let data: PageData;

  let editingMembershipId = '';

  async function removeContactMethod(id: string, value: string) {
    if (!window.confirm(`Delete ${value}?`)) {
      return;
    }

    await deleteContactMethod(id);
    await invalidateAll();
  }

  async function saveMembership(membershipId: string, input: MembershipInput) {
    await updateMembership(membershipId, input);
    editingMembershipId = '';
    await invalidateAll();
  }

  async function removeMembership(membershipId: string, groupName: string) {
    if (!window.confirm(`Remove ${data.person.name} from ${groupName}?`)) {
      return;
    }

    await deleteMembership(membershipId);
    await invalidateAll();
  }
</script>

<section class="page-header">
  <div>
    <h1>{data.person.name}</h1>
    {#if data.person.nickname}
      <p class="muted">Known as {data.person.nickname}</p>
    {/if}
  </div>
  <div class="actions">
    <a class="button secondary" href={`/people/${data.person.id}/edit`}>Edit person</a>
  </div>
</section>

<section class="stack">
  <article class="card stack">
    <div class="section-title">
      <div>
        <h2>Contact methods</h2>
        <p class="muted">Email, phone, web, and anything else useful.</p>
      </div>
      <a class="button" href={`/people/${data.person.id}/contact-methods/new`}>Add method</a>
    </div>

    {#if data.contactMethods.length === 0}
      <p class="muted">No contact methods yet.</p>
    {:else}
      <div class="methods">
        {#each data.contactMethods as method}
          <div class="method-row">
            <div>
              <span class="kind">{method.kind}</span>
              {#if method.label}
                <strong>{method.label}</strong>
              {/if}
              <p>{method.value}</p>
            </div>
            <div class="actions">
              <a class="button secondary" href={`/people/${data.person.id}/contact-methods/${method.id}/edit`}>Edit</a>
              <button class="danger" type="button" on:click={() => removeContactMethod(method.id, method.value)}>Delete</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </article>

  <article class="card stack">
    <div class="section-title">
      <h2>Groups</h2>
      <a class="button" href={`/people/${data.person.id}/memberships/new`}>Add to group</a>
    </div>

    {#if data.memberships.length === 0}
      <p class="muted">This person is not in any groups yet.</p>
    {:else}
      <div class="methods">
        {#each data.memberships as membership}
          <div class="method-row">
            {#if editingMembershipId === membership.id}
              <MembershipForm membership={membership} fixedPerson={data.person.id} fixedGroup={membership.group} onSubmit={(input) => saveMembership(membership.id, input)} submitLabel="Save note">
                <button slot="actions" class="secondary" type="button" on:click={() => (editingMembershipId = '')}>Cancel</button>
              </MembershipForm>
            {:else}
              <div>
                <a href={`/groups/${membership.group}`}><strong>{membership.expand?.group?.name ?? membership.group}</strong></a>
                {#if membership.note}
                  <p>{membership.note}</p>
                {/if}
              </div>
              <div class="actions">
                <button class="secondary" type="button" on:click={() => (editingMembershipId = membership.id)}>Edit note</button>
                <button class="danger" type="button" on:click={() => removeMembership(membership.id, membership.expand?.group?.name ?? 'this group')}>Remove</button>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </article>
</section>

<style>
  h2,
  p {
    margin-block: 0;
  }

  .section-title,
  .method-row {
    align-items: start;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  .methods {
    display: grid;
    gap: 0.8rem;
  }

  .method-row {
    border-top: 1px solid #e0d6c7;
    padding-top: 0.8rem;
  }

  .kind {
    background: #e6dccb;
    border-radius: 999px;
    display: inline-flex;
    font-size: 0.75rem;
    font-weight: 900;
    margin-bottom: 0.35rem;
    padding: 0.2rem 0.55rem;
    text-transform: uppercase;
  }

  .method-row strong {
    display: block;
  }

  @media (max-width: 720px) {
    .section-title,
    .method-row {
      display: grid;
    }
  }
</style>
