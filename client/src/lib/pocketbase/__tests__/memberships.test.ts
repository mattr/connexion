import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const membershipsCollection = {
    create: vi.fn(),
    delete: vi.fn(),
    getFullList: vi.fn(),
    update: vi.fn()
  };

  return {
    membershipsCollection,
    collection: vi.fn(() => membershipsCollection),
    filter: vi.fn((template: string, data: Record<string, string>) => `${template}:${JSON.stringify(data)}`)
  };
});

vi.mock('../client', () => ({
  pb: {
    collection: mocks.collection,
    filter: mocks.filter
  }
}));

describe('memberships service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('lists memberships for a person with expanded groups', async () => {
    const { listMembershipsForPerson } = await import('../memberships');
    const records = [
      { id: 'membership-2', person: 'person-1', group: 'group-2', expand: { group: { id: 'group-2', name: 'Zebra' } } },
      { id: 'membership-1', person: 'person-1', group: 'group-1', expand: { group: { id: 'group-1', name: 'Alpha' } } }
    ];
    mocks.membershipsCollection.getFullList.mockResolvedValue(records);

    await expect(listMembershipsForPerson('person-1')).resolves.toEqual([records[1], records[0]]);

    expect(mocks.collection).toHaveBeenCalledWith('memberships');
    expect(mocks.filter).toHaveBeenCalledWith('person = {:personId}', { personId: 'person-1' });
    expect(mocks.membershipsCollection.getFullList).toHaveBeenCalledWith({
      filter: 'person = {:personId}:{"personId":"person-1"}',
      expand: 'group'
    });
  });

  it('lists memberships for a group with expanded people', async () => {
    const { listMembershipsForGroup } = await import('../memberships');
    const records = [
      { id: 'membership-2', person: 'person-2', group: 'group-1', expand: { person: { id: 'person-2', name: 'Zoe' } } },
      { id: 'membership-1', person: 'person-1', group: 'group-1', expand: { person: { id: 'person-1', name: 'Ada' } } }
    ];
    mocks.membershipsCollection.getFullList.mockResolvedValue(records);

    await expect(listMembershipsForGroup('group-1')).resolves.toEqual([records[1], records[0]]);

    expect(mocks.filter).toHaveBeenCalledWith('group = {:groupId}', { groupId: 'group-1' });
    expect(mocks.membershipsCollection.getFullList).toHaveBeenCalledWith({
      filter: 'group = {:groupId}:{"groupId":"group-1"}',
      expand: 'person'
    });
  });

  it('creates a membership with trimmed note', async () => {
    const { createMembership } = await import('../memberships');
    const record = { id: 'membership-1', person: 'person-1', group: 'group-1' };
    mocks.membershipsCollection.create.mockResolvedValue(record);

    await expect(createMembership({ person: 'person-1', group: 'group-1', note: '  Reed chair  ' })).resolves.toBe(record);

    expect(mocks.membershipsCollection.create).toHaveBeenCalledWith({
      person: 'person-1',
      group: 'group-1',
      note: 'Reed chair'
    });
  });

  it('updates a membership with empty note when omitted', async () => {
    const { updateMembership } = await import('../memberships');
    const record = { id: 'membership-1', person: 'person-1', group: 'group-1' };
    mocks.membershipsCollection.update.mockResolvedValue(record);

    await expect(updateMembership('membership-1', { person: 'person-1', group: 'group-1' })).resolves.toBe(record);

    expect(mocks.membershipsCollection.update).toHaveBeenCalledWith('membership-1', {
      person: 'person-1',
      group: 'group-1',
      note: ''
    });
  });

  it('deletes a membership by id', async () => {
    const { deleteMembership } = await import('../memberships');
    mocks.membershipsCollection.delete.mockResolvedValue(true);

    await deleteMembership('membership-1');

    expect(mocks.membershipsCollection.delete).toHaveBeenCalledWith('membership-1');
  });
});
