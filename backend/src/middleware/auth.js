import { COOKIE_NAME, verifyToken } from '../lib/token.js';
import { HttpError } from '../lib/httpError.js';

// The user id comes only from the signed token, never from the request body or URL.
export function requireAuth(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return next(new HttpError(401, 'You need to sign in to continue.'));

  try {
    req.userId = verifyToken(token).sub;
    next();
  } catch {
    next(new HttpError(401, 'Your session has expired. Please sign in again.'));
  }
}
