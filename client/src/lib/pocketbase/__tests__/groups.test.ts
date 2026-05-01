import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const groupsCollection = {
    create: vi.fn(),
    delete: vi.fn(),
    getFullList: vi.fn(),
    getOne: vi.fn(),
    update: vi.fn()
  };

  return { groupsCollection, collection: vi.fn(() => groupsCollection) };
});

vi.mock('../client', () => ({ pb: { collection: mocks.collection } }));

describe('groups service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lists groups sorted by name', async () => {
    const { listGroups } = await import('../groups');
    const records = [{ id: 'group-1', name: 'Theatre' }];
    mocks.groupsCollection.getFullList.mockResolvedValue(records);

    await expect(listGroups()).resolves.toBe(records);

    expect(mocks.collection).toHaveBeenCalledWith('groups');
    expect(mocks.groupsCollection.getFullList).toHaveBeenCalledWith({ sort: '+name' });
  });

  it('gets a group by id', async () => {
    const { getGroup } = await import('../groups');
    const record = { id: 'group-1', name: 'Theatre' };
    mocks.groupsCollection.getOne.mockResolvedValue(record);

    await expect(getGroup('group-1')).resolves.toBe(record);

    expect(mocks.groupsCollection.getOne).toHaveBeenCalledWith('group-1');
  });

  it('creates a group with trimmed fields', async () => {
    const { createGroup } = await import('../groups');
    const record = { id: 'group-1', name: 'Theatre' };
    mocks.groupsCollection.create.mockResolvedValue(record);

    await expect(createGroup({ name: '  Theatre  ', description: '  Musicians  ' })).resolves.toBe(record);

    expect(mocks.groupsCollection.create).toHaveBeenCalledWith({ name: 'Theatre', description: 'Musicians' });
  });

  it('updates a group with empty description when omitted', async () => {
    const { updateGroup } = await import('../groups');
    const record = { id: 'group-1', name: 'Theatre' };
    mocks.groupsCollection.update.mockResolvedValue(record);

    await expect(updateGroup('group-1', { name: '  Theatre  ' })).resolves.toBe(record);

    expect(mocks.groupsCollection.update).toHaveBeenCalledWith('group-1', { name: 'Theatre', description: '' });
  });

  it('deletes a group by id', async () => {
    const { deleteGroup } = await import('../groups');
    mocks.groupsCollection.delete.mockResolvedValue(true);

    await deleteGroup('group-1');

    expect(mocks.groupsCollection.delete).toHaveBeenCalledWith('group-1');
  });
});
