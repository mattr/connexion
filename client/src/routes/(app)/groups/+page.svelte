<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<section class="page-header">
  <div>
    <h1>Groups</h1>
    <p class="muted">Organise people by project, context, or relationship.</p>
  </div>
  <a class="button" href="/groups/new">Add group</a>
</section>

{#if data.groups.length === 0}
  <article class="card stack">
    <h2>No groups yet</h2>
    <p class="muted">Create a group to start organising people.</p>
    <a class="button" href="/groups/new">Add group</a>
  </article>
{:else}
  <div class="groups-list">
    {#each data.groups as group}
      <article class="group-card card">
        <a href={`/groups/${group.id}`}>
          <strong>{group.name}</strong>
          {#if group.description}
            <span>{group.description}</span>
          {/if}
        </a>
        <div class="actions">
          <a class="button secondary" href={`/groups/${group.id}`}>View</a>
          <a class="button secondary" href={`/groups/${group.id}/edit`}>Edit</a>
        </div>
      </article>
    {/each}
  </div>
{/if}

<style>
  .groups-list {
    display: grid;
    gap: 0.8rem;
  }

  .group-card {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  .group-card > a {
    display: grid;
    text-decoration: none;
  }

  .group-card strong {
    font-size: 1.2rem;
  }

  .group-card span {
    color: #6f6759;
  }

  @media (max-width: 720px) {
    .group-card {
      align-items: start;
      display: grid;
    }
  }
</style>
