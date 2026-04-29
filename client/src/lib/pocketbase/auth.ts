import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { pb } from './client';
import type { AuthUser } from './types';

type Session = {
  isAuthenticated: boolean;
  user: AuthUser | null;
};

function currentSession(): Session {
  return {
    isAuthenticated: pb.authStore.isValid,
    user: (pb.authStore.record as AuthUser | null) ?? null
  };
}

export const session = writable<Session>(currentSession());

if (browser) {
  pb.authStore.onChange(() => {
    session.set(currentSession());
  });
}

export async function login(email: string, password: string) {
  await pb.collection('users').authWithPassword(email, password);
  session.set(currentSession());
}

export async function logout() {
  pb.authStore.clear();
  session.set(currentSession());
  await goto('/login');
}

export async function ensureValidAuth() {
  if (!pb.authStore.isValid) {
    return false;
  }

  try {
    await pb.collection('users').authRefresh();
    session.set(currentSession());
    return true;
  } catch {
    pb.authStore.clear();
    session.set(currentSession());
    return false;
  }
}

export function isAuthenticated() {
  return get(session).isAuthenticated;
}
