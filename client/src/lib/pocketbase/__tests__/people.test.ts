import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const peopleCollection = {
    create: vi.fn(),
    delete: vi.fn(),
    getFullList: vi.fn(),
    getOne: vi.fn(),
    update: vi.fn()
  };

  return {
    peopleCollection,
    collection: vi.fn(() => peopleCollection)
  };
});

vi.mock('../client', () => ({
  pb: {
    collection: mocks.collection
  }
}));

describe('people service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists people sorted by name', async () => {
    const { listPeople } = await import('../people');
    const records = [{ id: 'person-1', name: 'Prince' }];
    mocks.peopleCollection.getFullList.mockResolvedValue(records);

    await expect(listPeople()).resolves.toBe(records);

    expect(mocks.collection).toHaveBeenCalledWith('people');
    expect(mocks.peopleCollection.getFullList).toHaveBeenCalledWith({
      sort: '+name'
    });
  });

  it('gets a person by id', async () => {
    const { getPerson } = await import('../people');
    const record = { id: 'person-1', name: 'Prince' };
    mocks.peopleCollection.getOne.mockResolvedValue(record);

    await expect(getPerson('person-1')).resolves.toBe(record);

    expect(mocks.peopleCollection.getOne).toHaveBeenCalledWith('person-1');
  });

  it('creates a person with trimmed text fields', async () => {
    const { createPerson } = await import('../people');
    const record = { id: 'person-1', name: 'Prince' };
    mocks.peopleCollection.create.mockResolvedValue(record);

    await expect(
      createPerson({
        name: '  Prince  ',
        nickname: '  The Artist  '
      })
    ).resolves.toBe(record);

    expect(mocks.peopleCollection.create).toHaveBeenCalledWith({
      name: 'Prince',
      nickname: 'The Artist'
    });
  });

  it('updates a person with empty optional fields when omitted', async () => {
    const { updatePerson } = await import('../people');
    const record = { id: 'person-1', name: 'Prince' };
    mocks.peopleCollection.update.mockResolvedValue(record);

    await expect(updatePerson('person-1', { name: '  Prince  ' })).resolves.toBe(record);

    expect(mocks.peopleCollection.update).toHaveBeenCalledWith('person-1', {
      name: 'Prince',
      nickname: ''
    });
  });

  it('deletes a person by id', async () => {
    const { deletePerson } = await import('../people');
    mocks.peopleCollection.delete.mockResolvedValue(true);

    await deletePerson('person-1');

    expect(mocks.peopleCollection.delete).toHaveBeenCalledWith('person-1');
  });
});
