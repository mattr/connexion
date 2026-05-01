import { getGroup } from '$lib/pocketbase/groups';
import { listMembershipsForGroup } from '$lib/pocketbase/memberships';
import { listPeople } from '$lib/pocketbase/people';

export async function load({ params }) {
  const [group, memberships, people] = await Promise.all([
    getGroup(params.groupId),
    listMembershipsForGroup(params.groupId),
    listPeople()
  ]);

  return { group, memberships, people };
}
