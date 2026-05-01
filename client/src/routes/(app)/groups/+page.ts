import { listGroups } from '$lib/pocketbase/groups';

export async function load() {
  return { groups: await listGroups() };
}
