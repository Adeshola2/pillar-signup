/** Turns an Axios error into a message plus per-field messages from the API. */
export function getErrorInfo(error) {
  if (error?.response) {
    const { message, errors } = error.response.data ?? {};
    return {
      message: message || 'Something went wrong. Please try again.',
      fieldErrors: errors && typeof errors === 'object' ? errors : {},
    };
  }
  return {
    message: "We can't reach the server. Check your connection and try again.",
    fieldErrors: {},
  };
}
