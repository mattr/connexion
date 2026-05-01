import { getGroup } from '$lib/pocketbase/groups';

export async function load({ params }) {
  return { group: await getGroup(params.groupId) };
}
