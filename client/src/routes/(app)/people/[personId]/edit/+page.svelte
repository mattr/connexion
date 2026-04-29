<script lang="ts">
  import { goto } from '$app/navigation';
  import PersonForm from '$lib/components/PersonForm.svelte';
  import { deletePerson, updatePerson } from '$lib/pocketbase/people';
  import type { PersonInput } from '$lib/pocketbase/types';
  import type { PageData } from './$types';

  export let data: PageData;

  let error = '';
  let submitting = false;

  async function submit(input: PersonInput) {
    error = '';
    submitting = true;

    try {
      await updatePerson(data.person.id, input);
      await goto(`/people/${data.person.id}`);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Could not update person.';
    } finally {
      submitting = false;
    }
  }

  async function remove() {
    if (!window.confirm(`Delete ${data.person.name}? This cannot be undone.`)) {
      return;
    }

    await deletePerson(data.person.id);
    await goto('/people');
  }
</script>

<section class="page-header">
  <div>
    <h1>Edit person</h1>
    <p class="muted">Update {data.person.name}.</p>
  </div>
</section>

<PersonForm person={data.person} onSubmit={submit} {submitting} {error} submitLabel="Save person">
  <a slot="actions" class="button secondary" href={`/people/${data.person.id}`}>Cancel</a>
</PersonForm>

<section class="danger-zone card stack">
  <div>
    <h2>Delete person</h2>
    <p class="muted">Remove this person and their contact methods from the address book.</p>
  </div>
  <button class="danger" type="button" on:click={remove}>Delete person</button>
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
