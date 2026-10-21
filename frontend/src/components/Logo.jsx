export default function Logo({ light = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-display text-xl font-bold ${light ? 'text-white' : 'text-ink'}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill={light ? '#fff' : '#0F6B62'} />
        <rect x="10" y="7" width="4" height="18" rx="1" fill={light ? '#0F6B62' : '#fff'} />
        <rect x="18" y="7" width="4" height="12" rx="1" fill={light ? '#7FB8B0' : '#D6EBE7'} />
      </svg>
      Pillar
    </span>
  );
}
