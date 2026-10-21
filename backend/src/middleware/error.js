import { HttpError } from '../lib/httpError.js';
import { env } from '../lib/env.js';

export function notFound(req, _res, next) {
  next(new HttpError(404, `No route for ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors ?? {} });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON.', errors: {} });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body is too large.', errors: {} });
  }

  if (!env.isTest) console.error(err);
  res.status(500).json({ message: 'Something went wrong on our side. Please try again.', errors: {} });
}
