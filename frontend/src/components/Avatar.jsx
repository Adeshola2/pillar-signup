import { getInitials } from '../lib/format';

export default function Avatar({ name, size = 'md', tone = 'light' }) {
  const sizes = { sm: 'h-9 w-9 text-sm', md: 'h-11 w-11 text-base', lg: 'h-16 w-16 text-2xl' };
  const tones = {
    light: 'bg-brand-soft text-brand-deep',
    dark: 'bg-white text-brand-deep',
  };
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold ${sizes[size]} ${tones[tone]}`}
    >
      {getInitials(name)}
    </span>
  );
}
