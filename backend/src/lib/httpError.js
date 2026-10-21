export class HttpError extends Error {
  /**
   * @param {number} status HTTP status code
   * @param {string} message Human-readable summary
   * @param {Record<string, string>} [errors] Field-level messages keyed by field name
   */
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
