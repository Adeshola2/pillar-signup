import { HttpError } from '../lib/httpError.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body ?? {});
  if (result.success) {
    req.body = result.data;
    return next();
  }

  const errors = {};
  for (const issue of result.error.issues) {
    if (issue.code === 'unrecognized_keys') {
      for (const key of issue.keys) errors[key] ??= 'This field cannot be changed here';
      continue;
    }
    const key = issue.path[0] ?? '_form';
    errors[key] ??= issue.message;
  }
  next(new HttpError(400, 'Please fix the highlighted fields.', errors));
};
