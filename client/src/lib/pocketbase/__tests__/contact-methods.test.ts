import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const contactMethodsCollection = {
    create: vi.fn(),
    delete: vi.fn(),
    getFullList: vi.fn(),
    getOne: vi.fn(),
    update: vi.fn()
  };

  return {
    contactMethodsCollection,
    collection: vi.fn(() => contactMethodsCollection),
    filter: vi.fn(() => 'person = "person-1"')
  };
});

vi.mock('../client', () => ({
  pb: {
    collection: mocks.collection,
    filter: mocks.filter
  }
}));

describe('contact methods service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists contact methods for one person', async () => {
    const { listContactMethodsForPerson } = await import('../contact-methods');
    const records = [{ id: 'method-1', person: 'person-1', kind: 'email', value: 'matt@example.com' }];
    mocks.contactMethodsCollection.getFullList.mockResolvedValue(records);

    await expect(listContactMethodsForPerson('person-1')).resolves.toBe(records);

    expect(mocks.collection).toHaveBeenCalledWith('contact_methods');
    expect(mocks.filter).toHaveBeenCalledWith('person = {:personId}', { personId: 'person-1' });
    expect(mocks.contactMethodsCollection.getFullList).toHaveBeenCalledWith({
      filter: 'person = "person-1"',
      sort: '+kind,+label,+value'
    });
  });

  it('gets a contact method by id', async () => {
    const { getContactMethod } = await import('../contact-methods');
    const record = { id: 'method-1', person: 'person-1', kind: 'web', value: 'https://example.com' };
    mocks.contactMethodsCollection.getOne.mockResolvedValue(record);

    await expect(getContactMethod('method-1')).resolves.toBe(record);

    expect(mocks.contactMethodsCollection.getOne).toHaveBeenCalledWith('method-1');
  });

  it('creates a contact method with trimmed text fields', async () => {
    const { createContactMethod } = await import('../contact-methods');
    const record = { id: 'method-1', person: 'person-1', kind: 'web', value: 'https://example.com' };
    mocks.contactMethodsCollection.create.mockResolvedValue(record);

    await expect(
      createContactMethod('person-1', {
        kind: 'web',
        label: '  GitHub  ',
        value: '  https://github.com/mattr  '
      })
    ).resolves.toBe(record);

    expect(mocks.contactMethodsCollection.create).toHaveBeenCalledWith({
      person: 'person-1',
      kind: 'web',
      label: 'GitHub',
      value: 'https://github.com/mattr'
    });
  });

  it('updates a contact method with an empty label when omitted', async () => {
    const { updateContactMethod } = await import('../contact-methods');
    const record = { id: 'method-1', person: 'person-1', kind: 'phone', value: '+61 400 000 000' };
    mocks.contactMethodsCollection.update.mockResolvedValue(record);

    await expect(
      updateContactMethod('method-1', 'person-1', {
        kind: 'phone',
        value: '  +61 400 000 000  '
      })
    ).resolves.toBe(record);

    expect(mocks.contactMethodsCollection.update).toHaveBeenCalledWith('method-1', {
      person: 'person-1',
      kind: 'phone',
      label: '',
      value: '+61 400 000 000'
    });
  });

  it('deletes a contact method by id', async () => {
    const { deleteContactMethod } = await import('../contact-methods');
    mocks.contactMethodsCollection.delete.mockResolvedValue(true);

    await deleteContactMethod('method-1');

    expect(mocks.contactMethodsCollection.delete).toHaveBeenCalledWith('method-1');
  });
});
