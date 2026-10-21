import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../lib/httpError.js';

const COMPLETION_FIELDS = ['fullName', 'username', 'email', 'phone', 'dateOfBirth', 'gender'];

/** Shape returned to clients. Never includes passwordHash. */
export function toPublicUser(user) {
  const filled = COMPLETION_FIELDS.filter(
    (f) => user[f] !== null && user[f] !== undefined && user[f] !== ''
  ).length;
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : null,
    gender: user.gender,
    status: 'active',
    profileCompletion: Math.round((filled / COMPLETION_FIELDS.length) * 100),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const toDate = (value) => (value ? new Date(`${value}T00:00:00.000Z`) : null);

function duplicateError(fields) {
  const errors = {};
  if (fields.includes('email')) errors.email = 'An account with this email already exists';
  if (fields.includes('username')) errors.username = 'This username is already taken';
  return new HttpError(409, 'That email or username is already in use.', errors);
}

export const findById = (id) => prisma.user.findUnique({ where: { id } });

export const findByIdentifier = (identifier) =>
  prisma.user.findFirst({ where: { OR: [{ email: identifier }, { username: identifier }] } });

export async function createUser({ dateOfBirth, ...data }) {
  // Friendly pre-check so both conflicts are reported at once.
  const existing = await prisma.user.findMany({
    where: { OR: [{ email: data.email }, { username: data.username }] },
    select: { email: true, username: true },
  });
  const taken = [];
  if (existing.some((u) => u.email === data.email)) taken.push('email');
  if (existing.some((u) => u.username === data.username)) taken.push('username');
  if (taken.length) throw duplicateError(taken);

  try {
    return await prisma.user.create({ data: { ...data, dateOfBirth: toDate(dateOfBirth) } });
  } catch (err) {
    // The unique constraints are the real guarantee; this handles a race between two sign-ups.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target : [];
      throw duplicateError(target.length ? target : ['email', 'username']);
    }
    throw err;
  }
}

export async function updateUser(id, { dateOfBirth, ...rest }) {
  const data = { ...rest };
  if (dateOfBirth !== undefined) data.dateOfBirth = toDate(dateOfBirth);
  return prisma.user.update({ where: { id }, data });
}
