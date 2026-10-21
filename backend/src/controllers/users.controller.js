import { asyncHandler } from '../lib/asyncHandler.js';
import { HttpError } from '../lib/httpError.js';
import { clearAuthCookie } from '../lib/token.js';
import { findById, toPublicUser, updateUser } from '../services/user.service.js';

async function currentUserOrFail(req, res) {
  const user = await findById(req.userId);
  if (!user) {
    // Token is valid but the account is gone.
    clearAuthCookie(res);
    throw new HttpError(401, 'Your session is no longer valid. Please sign in again.');
  }
  return user;
}

export const getMe = asyncHandler(async (req, res) => {
  const user = await currentUserOrFail(req, res);
  res.json({ user: toPublicUser(user) });
});

export const updateMe = asyncHandler(async (req, res) => {
  await currentUserOrFail(req, res);
  const updated = await updateUser(req.userId, req.body);
  res.json({ user: toPublicUser(updated) });
});
