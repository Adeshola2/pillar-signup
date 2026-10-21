const STYLES = {
  error: 'border-danger/30 bg-danger-soft text-danger',
  success: 'border-ok/30 bg-ok-soft text-ok',
};

export default function Alert({ type = 'error', children }) {
  if (!children) return null;
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-3.5 py-3 text-sm font-medium ${STYLES[type]}`}
    >
      {children}
    </div>
  );
}
