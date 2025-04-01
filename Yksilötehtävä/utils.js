export const sortByName = (a, b) =>
  a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;

export default {sortByName};
