import { listPeople } from '$lib/pocketbase/people';

export async function load() {
  return {
    people: await listPeople()
  };
}
