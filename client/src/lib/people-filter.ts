import type { Person } from '$lib/pocketbase/types';

export function filterPeople(people: Person[], query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return people;
  }

  return people.filter((person) => {
    return [person.name, person.nickname].some((value) => fuzzyIncludes(value ?? '', normalizedQuery));
  });
}

function fuzzyIncludes(value: string, normalizedQuery: string) {
  const normalizedValue = normalize(value);

  if (normalizedQuery.length < 3) {
    return normalizedValue.split(/\s+/).some((part) => part.startsWith(normalizedQuery));
  }

  if (normalizedValue.includes(normalizedQuery)) {
    return true;
  }

  let queryIndex = 0;
  for (const character of normalizedValue) {
    if (character === normalizedQuery[queryIndex]) {
      queryIndex += 1;
    }

    if (queryIndex === normalizedQuery.length) {
      return true;
    }
  }

  return false;
}

function normalize(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();
}
