import jwt from 'jsonwebtoken';
import { env } from './env.js';

export const COOKIE_NAME = 'session';

export function signToken(userId) {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: `${env.SESSION_DAYS}d`,
    algorithm: 'HS256',
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
}

const baseCookieOptions = () => ({
  httpOnly: true,
  // SameSite=None requires Secure, so force it in that case.
  secure: env.isProd || env.COOKIE_SAME_SITE === 'none',
  sameSite: env.COOKIE_SAME_SITE,
  path: '/',
});

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    ...baseCookieOptions(),
    maxAge: env.SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, baseCookieOptions());
}
