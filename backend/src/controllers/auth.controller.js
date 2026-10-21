import bcrypt from 'bcrypt';
import { asyncHandler } from '../lib/asyncHandler.js';
import { HttpError } from '../lib/httpError.js';
import { clearAuthCookie, setAuthCookie, signToken } from '../lib/token.js';
import { createUser, findByIdentifier, toPublicUser } from '../services/user.service.js';

const BCRYPT_ROUNDS = 12;
// Compared against when the account doesn't exist, so response time doesn't reveal which accounts exist.
const DUMMY_HASH = bcrypt.hashSync('pillar-timing-equalizer', BCRYPT_ROUNDS);

export const register = asyncHandler(async (req, res) => {
  const { password, confirmPassword, acceptedTerms, ...profile } = req.body;
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await createUser({ ...profile, passwordHash });

  setAuthCookie(res, signToken(user.id));
  res.status(201).json({ user: toPublicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const user = await findByIdentifier(identifier);
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !valid) {
    throw new HttpError(401, 'Incorrect email, username or password.');
  }

  setAuthCookie(res, signToken(user.id));
  res.json({ user: toPublicUser(user) });
});

export const logout = (_req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'You have been signed out.' });
};
