import Spinner from './Spinner';

const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-dark disabled:hover:bg-brand',
  secondary: 'border border-line bg-white text-ink hover:bg-mist',
  ghost: 'text-ink hover:bg-mist',
};

export default function Button({
  variant = 'primary',
  loading = false,
  loadingText,
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
