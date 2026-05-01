import { pb } from './client';
import type { Group, GroupInput } from './types';

function compactGroupInput(input: GroupInput) {
  return {
    name: input.name.trim(),
    description: input.description?.trim() || ''
  };
}

export async function listGroups() {
  const records = await pb.collection('groups').getFullList({ sort: '+name' });

  return records as unknown as Group[];
}

export async function getGroup(id: string) {
  const record = await pb.collection('groups').getOne(id);

  return record as unknown as Group;
}

export async function createGroup(input: GroupInput) {
  const record = await pb.collection('groups').create(compactGroupInput(input));

  return record as unknown as Group;
}

export async function updateGroup(id: string, input: GroupInput) {
  const record = await pb.collection('groups').update(id, compactGroupInput(input));

  return record as unknown as Group;
}

export async function deleteGroup(id: string) {
  await pb.collection('groups').delete(id);
}
