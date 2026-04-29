<script lang="ts">
  import { goto } from '$app/navigation';
  import PersonForm from '$lib/components/PersonForm.svelte';
  import { createPerson } from '$lib/pocketbase/people';
  import type { PersonInput } from '$lib/pocketbase/types';

  let error = '';
  let submitting = false;

  async function submit(input: PersonInput) {
    error = '';
    submitting = true;

    try {
      const person = await createPerson(input);
      await goto(`/people/${person.id}`);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Could not create person.';
    } finally {
      submitting = false;
    }
  }
</script>

<section class="page-header">
  <div>
    <h1>Add person</h1>
    <p class="muted">Store the name as you want to see it.</p>
  </div>
</section>

<PersonForm onSubmit={submit} {submitting} {error} submitLabel="Create person">
  <a slot="actions" class="button secondary" href="/people">Cancel</a>
</PersonForm>
