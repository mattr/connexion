<script lang="ts">
  import { goto } from '$app/navigation';
  import ContactMethodForm from '$lib/components/ContactMethodForm.svelte';
  import { updateContactMethod } from '$lib/pocketbase/contact-methods';
  import type { ContactMethodInput } from '$lib/pocketbase/types';
  import type { PageData } from './$types';

  export let data: PageData;

  let error = '';
  let submitting = false;

  async function submit(input: ContactMethodInput) {
    error = '';
    submitting = true;

    try {
      await updateContactMethod(data.contactMethod.id, data.person.id, input);
      await goto(`/people/${data.person.id}`);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Could not update contact method.';
    } finally {
      submitting = false;
    }
  }
</script>

<section class="page-header">
  <div>
    <h1>Edit method</h1>
    <p class="muted">Update a way to reach {data.person.name}.</p>
  </div>
</section>

<ContactMethodForm contactMethod={data.contactMethod} onSubmit={submit} {submitting} {error} submitLabel="Save method">
  <a slot="actions" class="button secondary" href={`/people/${data.person.id}`}>Cancel</a>
</ContactMethodForm>
