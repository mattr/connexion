import { getPerson } from '$lib/pocketbase/people';
import { listContactMethodsForPerson } from '$lib/pocketbase/contact-methods';
import { listMembershipsForPerson } from '$lib/pocketbase/memberships';

export async function load({ params }) {
  const [person, contactMethods, memberships] = await Promise.all([
    getPerson(params.personId),
    listContactMethodsForPerson(params.personId),
    listMembershipsForPerson(params.personId)
  ]);

  return { person, contactMethods, memberships };
}
