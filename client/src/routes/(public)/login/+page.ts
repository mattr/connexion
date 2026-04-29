import { redirect } from '@sveltejs/kit';
import { ensureValidAuth } from '$lib/pocketbase/auth';

export async function load() {
  if (await ensureValidAuth()) {
    redirect(303, '/people');
  }
}
