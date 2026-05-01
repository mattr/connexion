import { getGroup } from '$lib/pocketbase/groups';
import { listMembershipsForGroup } from '$lib/pocketbase/memberships';

export async function load({ params }) {
  const [group, memberships] = await Promise.all([
    getGroup(params.groupId),
    listMembershipsForGroup(params.groupId)
  ]);

  return { group, memberships };
}
