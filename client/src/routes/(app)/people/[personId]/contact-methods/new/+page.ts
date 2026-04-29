import { getPerson } from '$lib/pocketbase/people';

export async function load({ params }) {
  return {
    person: await getPerson(params.personId)
  };
}
