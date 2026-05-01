export type Person = {
  id: string;
  name: string;
  nickname?: string;
  created?: string;
  updated?: string;
};

export type PersonInput = {
  name: string;
  nickname?: string;
};

export const contactMethodKinds = ['email', 'phone', 'web', 'other'] as const;

export type ContactMethodKind = (typeof contactMethodKinds)[number];

export type ContactMethod = {
  id: string;
  person: string;
  kind: ContactMethodKind;
  label?: string;
  value: string;
  created?: string;
  updated?: string;
};

export type ContactMethodInput = {
  kind: ContactMethodKind;
  label?: string;
  value: string;
};

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  created?: string;
  updated?: string;
};

export type GroupInput = {
  name: string;
  description?: string;
};

export type Membership = {
  id: string;
  person: string;
  group: string;
  note?: string;
  expand?: {
    person?: Person;
    group?: Group;
  };
  created?: string;
  updated?: string;
};

export type MembershipInput = {
  person: string;
  group: string;
  note?: string;
};
