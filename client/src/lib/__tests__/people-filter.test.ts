import { describe, expect, it } from 'vitest';
import { filterPeople } from '../people-filter';
import type { Person } from '../pocketbase/types';

const people: Person[] = [
  { id: '1', name: 'Prince' },
  { id: '2', name: 'Björk Guðmundsdóttir', nickname: 'Bork' },
  { id: '3', name: 'Ada Lovelace' },
  { id: '4', name: 'Grace Hopper', nickname: 'Amazing Grace' },
  { id: '5', name: 'Jonathan Smith', nickname: 'Jo' }
];

describe('filterPeople', () => {
  it('returns every person for a blank query', () => {
    expect(filterPeople(people, '   ')).toEqual(people);
  });

  it('matches names case-insensitively', () => {
    expect(filterPeople(people, 'prince')).toEqual([{ id: '1', name: 'Prince' }]);
  });

  it('matches nicknames', () => {
    expect(filterPeople(people, 'amazing')).toEqual([
      { id: '4', name: 'Grace Hopper', nickname: 'Amazing Grace' }
    ]);
  });

  it('matches across accents', () => {
    expect(filterPeople(people, 'bjork')).toEqual([
      { id: '2', name: 'Björk Guðmundsdóttir', nickname: 'Bork' }
    ]);
  });

  it('matches fuzzy subsequences', () => {
    expect(filterPeople(people, 'grhp')).toEqual([
      { id: '4', name: 'Grace Hopper', nickname: 'Amazing Grace' }
    ]);
  });

  it('matches two-letter nicknames', () => {
    expect(filterPeople(people, 'jo')).toEqual([{ id: '5', name: 'Jonathan Smith', nickname: 'Jo' }]);
  });

  it('does not use fuzzy subsequence matching for two-letter queries', () => {
    expect(filterPeople(people, 'aa')).toEqual([]);
  });
});
