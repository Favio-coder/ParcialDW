export const KEYS = {
  categories: 'bib_categories',
  books: 'bib_books',
  users: 'bib_users',
  loans: 'bib_loans',
  receipts: 'bib_receipts',
  session: 'bib_session',
};

export const get = <T,>(key: string, def: T): T => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : def;
};

export const set = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('storage-updated'));
};