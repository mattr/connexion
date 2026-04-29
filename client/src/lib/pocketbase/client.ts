import { env } from '$env/dynamic/public';
import PocketBase from 'pocketbase';

if (!env.PUBLIC_POCKETBASE_URL) {
  throw new Error('PUBLIC_POCKETBASE_URL is required. Create client/.env from client/.env.template.');
}

export const pb = new PocketBase(env.PUBLIC_POCKETBASE_URL);
