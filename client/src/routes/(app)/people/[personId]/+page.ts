import { getPerson } from '$lib/pocketbase/people';
import { listContactMethodsForPerson } from '$lib/pocketbase/contact-methods';

export async function load({ params }) {
  const [person, contactMethods] = await Promise.all([
    getPerson(params.personId),
    listContactMethodsForPerson(params.personId)
  ]);

  return { person, contactMethods };
}
