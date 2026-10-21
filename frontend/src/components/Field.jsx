import { forwardRef, useId, useState } from 'react';

const Field = forwardRef(function Field(
  { label, error, hint, optional = false, as = 'input', type = 'text', className = '', children, ...props },
  ref
) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const control =
    'block w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-ink shadow-sm transition-colors placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25 ' +
    (error ? 'border-danger' : 'border-line');

  const shared = {
    id,
    ref,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    className: control + (isPassword ? ' pr-16' : ''),
    ...props,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      <div className="relative mt-1.5">
        {as === 'select' ? (
          <select {...shared}>{children}</select>
        ) : (
          <input {...shared} type={isPassword && showPassword ? 'text' : type} />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 rounded-r-lg px-3.5 text-xs font-semibold text-brand hover:text-brand-dark"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Field;
