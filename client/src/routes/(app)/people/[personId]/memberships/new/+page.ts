import { listGroups } from '$lib/pocketbase/groups';
import { listMembershipsForPerson } from '$lib/pocketbase/memberships';
import { getPerson } from '$lib/pocketbase/people';

export async function load({ params }) {
  const [person, memberships, groups] = await Promise.all([
    getPerson(params.personId),
    listMembershipsForPerson(params.personId),
    listGroups()
  ]);

  return { person, memberships, groups };
}
