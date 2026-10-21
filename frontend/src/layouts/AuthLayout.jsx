import Logo from '../components/Logo';

export default function AuthLayout({ title, subtitle, wide = false, children, footer }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-6">
        <Logo />
      </div>
      <div
        className={`w-full rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8 ${
          wide ? 'max-w-xl' : 'max-w-md'
        }`}
      >
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </div>
      <p className="mt-6 text-sm text-muted">{footer}</p>
    </main>
  );
}
