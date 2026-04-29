<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<section class="page-header">
  <div>
    <h1>People</h1>
    <p class="muted">Your address book starts with the people you know.</p>
  </div>
  <a class="button" href="/people/new">Add person</a>
</section>

{#if data.people.length === 0}
  <article class="card stack">
    <h2>No people yet</h2>
    <p class="muted">Add the first person to start building the address book.</p>
    <a class="button" href="/people/new">Add person</a>
  </article>
{:else}
  <div class="people-list">
    {#each data.people as person}
      <article class="person-card card">
        <a href={`/people/${person.id}`}>
          <strong>{person.name}</strong>
          {#if person.nickname}
            <span>{person.nickname}</span>
          {/if}
        </a>
        <div class="actions">
          <a class="button secondary" href={`/people/${person.id}`}>View</a>
          <a class="button secondary" href={`/people/${person.id}/edit`}>Edit</a>
        </div>
      </article>
    {/each}
  </div>
{/if}

<style>
  .people-list {
    display: grid;
    gap: 0.8rem;
  }

  .person-card {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  .person-card > a {
    display: grid;
    text-decoration: none;
  }

  .person-card strong {
    font-size: 1.2rem;
  }

  .person-card span {
    color: #6f6759;
  }

  @media (max-width: 720px) {
    .person-card {
      align-items: start;
      display: grid;
    }
  }
</style>
