import { pb } from './client';
import type { Person, PersonInput } from './types';

function compactPersonInput(input: PersonInput) {
  return {
    name: input.name.trim(),
    sort_name: input.sort_name?.trim() || '',
    nickname: input.nickname?.trim() || ''
  };
}

export async function listPeople() {
  const records = await pb.collection('people').getFullList({
    sort: '+sort_name,+name'
  });

  return records as unknown as Person[];
}

export async function getPerson(id: string) {
  const record = await pb.collection('people').getOne(id);

  return record as unknown as Person;
}

export async function createPerson(input: PersonInput) {
  const record = await pb.collection('people').create(compactPersonInput(input));

  return record as unknown as Person;
}

export async function updatePerson(id: string, input: PersonInput) {
  const record = await pb.collection('people').update(id, compactPersonInput(input));

  return record as unknown as Person;
}

export async function deletePerson(id: string) {
  await pb.collection('people').delete(id);
}
