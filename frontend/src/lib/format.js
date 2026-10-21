// Dates from the API: createdAt is an ISO timestamp, dateOfBirth is YYYY-MM-DD.
export const formatMonthYear = (iso) =>
  new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(iso));

export const formatDateTime = (iso) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(iso));

export const formatDateOnly = (ymd) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(`${ymd}T00:00:00`));

export const GENDER_LABELS = {
  female: 'Female',
  male: 'Male',
  non_binary: 'Non-binary',
  prefer_not_to_say: 'Prefer not to say',
};

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export const firstName = (name = '') => name.trim().split(/\s+/)[0] || 'there';
