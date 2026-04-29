import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const authStore = {
    clear: vi.fn(),
    isValid: false,
    onChange: vi.fn(),
    record: null as { id: string; email?: string } | null
  };

  const usersCollection = {
    authRefresh: vi.fn(),
    authWithPassword: vi.fn()
  };

  return {
    authStore,
    collection: vi.fn(() => usersCollection),
    goto: vi.fn(),
    usersCollection
  };
});

vi.mock('$app/environment', () => ({
  browser: true
}));

vi.mock('$app/navigation', () => ({
  goto: mocks.goto
}));

vi.mock('../client', () => ({
  pb: {
    authStore: mocks.authStore,
    collection: mocks.collection
  }
}));

describe('auth service', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.authStore.isValid = false;
    mocks.authStore.record = null;
    mocks.authStore.clear.mockImplementation(() => {
      mocks.authStore.isValid = false;
      mocks.authStore.record = null;
    });
    mocks.usersCollection.authRefresh.mockResolvedValue({});
  });

  it('subscribes to PocketBase auth store changes in the browser', async () => {
    await import('../auth');

    expect(mocks.authStore.onChange).toHaveBeenCalledOnce();
  });

  it('logs in with the users collection and updates the session', async () => {
    const { isAuthenticated, login, session } = await import('../auth');
    mocks.usersCollection.authWithPassword.mockImplementation(async () => {
      mocks.authStore.isValid = true;
      mocks.authStore.record = { id: 'user-1', email: 'me@example.com' };
    });

    await login('me@example.com', 'password');

    expect(mocks.collection).toHaveBeenCalledWith('users');
    expect(mocks.usersCollection.authWithPassword).toHaveBeenCalledWith('me@example.com', 'password');
    expect(isAuthenticated()).toBe(true);
    expect(get(session)).toEqual({
      isAuthenticated: true,
      user: { id: 'user-1', email: 'me@example.com' }
    });
  });

  it('logs out by clearing PocketBase auth and navigating to login', async () => {
    const { logout, session } = await import('../auth');
    mocks.authStore.isValid = true;
    mocks.authStore.record = { id: 'user-1', email: 'me@example.com' };

    await logout();

    expect(mocks.authStore.clear).toHaveBeenCalledOnce();
    expect(get(session)).toEqual({ isAuthenticated: false, user: null });
    expect(mocks.goto).toHaveBeenCalledWith('/login');
  });

  it('does not refresh auth when the auth store is already invalid', async () => {
    const { ensureValidAuth } = await import('../auth');

    await expect(ensureValidAuth()).resolves.toBe(false);

    expect(mocks.usersCollection.authRefresh).not.toHaveBeenCalled();
  });

  it('refreshes valid auth and keeps the session authenticated', async () => {
    const { ensureValidAuth, session } = await import('../auth');
    mocks.authStore.isValid = true;
    mocks.authStore.record = { id: 'user-1', email: 'me@example.com' };

    await expect(ensureValidAuth()).resolves.toBe(true);

    expect(mocks.collection).toHaveBeenCalledWith('users');
    expect(mocks.usersCollection.authRefresh).toHaveBeenCalledOnce();
    expect(get(session)).toEqual({
      isAuthenticated: true,
      user: { id: 'user-1', email: 'me@example.com' }
    });
  });

  it('clears auth when refresh fails', async () => {
    const { ensureValidAuth, session } = await import('../auth');
    mocks.authStore.isValid = true;
    mocks.authStore.record = { id: 'user-1', email: 'me@example.com' };
    mocks.usersCollection.authRefresh.mockRejectedValue(new Error('expired'));

    await expect(ensureValidAuth()).resolves.toBe(false);

    expect(mocks.authStore.clear).toHaveBeenCalledOnce();
    expect(get(session)).toEqual({
      isAuthenticated: false,
      user: null
    });
  });
});
