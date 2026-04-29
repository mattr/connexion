import { error } from '@sveltejs/kit';
import { getContactMethod } from '$lib/pocketbase/contact-methods';
import { getPerson } from '$lib/pocketbase/people';

export async function load({ params }) {
  const [person, contactMethod] = await Promise.all([
    getPerson(params.personId),
    getContactMethod(params.contactMethodId)
  ]);

  if (contactMethod.person !== person.id) {
    error(404, 'Contact method not found for this person.');
  }

  return { person, contactMethod };
}
