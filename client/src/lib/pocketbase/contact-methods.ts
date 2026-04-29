import { pb } from './client';
import type { ContactMethod, ContactMethodInput } from './types';

function compactContactMethodInput(person: string, input: ContactMethodInput) {
  return {
    person,
    kind: input.kind,
    label: input.label?.trim() || '',
    value: input.value.trim()
  };
}

export async function listContactMethodsForPerson(personId: string) {
  const records = await pb.collection('contact_methods').getFullList({
    filter: pb.filter('person = {:personId}', { personId }),
    sort: '+kind,+label,+value'
  });

  return records as unknown as ContactMethod[];
}

export async function getContactMethod(id: string) {
  const record = await pb.collection('contact_methods').getOne(id);

  return record as unknown as ContactMethod;
}

export async function createContactMethod(personId: string, input: ContactMethodInput) {
  const record = await pb.collection('contact_methods').create(compactContactMethodInput(personId, input));

  return record as unknown as ContactMethod;
}

export async function updateContactMethod(id: string, personId: string, input: ContactMethodInput) {
  const record = await pb.collection('contact_methods').update(id, compactContactMethodInput(personId, input));

  return record as unknown as ContactMethod;
}

export async function deleteContactMethod(id: string) {
  await pb.collection('contact_methods').delete(id);
}
