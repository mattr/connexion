import { pb } from './client';
import type { Membership, MembershipInput } from './types';

function compactMembershipInput(input: MembershipInput) {
  return {
    person: input.person,
    group: input.group,
    note: input.note?.trim() || ''
  };
}

export async function listMembershipsForPerson(personId: string) {
  const records = await pb.collection('memberships').getFullList({
    filter: pb.filter('person = {:personId}', { personId }),
    expand: 'group'
  });

  return (records as unknown as Membership[]).sort((left, right) => compareMemberships(left, right, 'group'));
}

export async function listMembershipsForGroup(groupId: string) {
  const records = await pb.collection('memberships').getFullList({
    filter: pb.filter('group = {:groupId}', { groupId }),
    expand: 'person'
  });

  return (records as unknown as Membership[]).sort((left, right) => compareMemberships(left, right, 'person'));
}

export async function createMembership(input: MembershipInput) {
  const record = await pb.collection('memberships').create(compactMembershipInput(input));

  return record as unknown as Membership;
}

export async function updateMembership(id: string, input: MembershipInput) {
  const record = await pb.collection('memberships').update(id, compactMembershipInput(input));

  return record as unknown as Membership;
}

export async function deleteMembership(id: string) {
  await pb.collection('memberships').delete(id);
}

function compareMemberships(left: Membership, right: Membership, expansion: 'group' | 'person') {
  const leftName = left.expand?.[expansion]?.name ?? '';
  const rightName = right.expand?.[expansion]?.name ?? '';

  return leftName.localeCompare(rightName, undefined, { sensitivity: 'base' });
}
