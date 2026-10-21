import { useSearchParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import EditProfileForm from '../components/EditProfileForm';
import { useAuth } from '../hooks/useAuth';
import { firstName, formatDateOnly, formatDateTime, formatMonthYear, GENDER_LABELS } from '../lib/format';

function SummaryCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="text-sm font-medium text-muted">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function missingHint(user) {
  const missing = [];
  if (!user.dateOfBirth) missing.push('date of birth');
  if (!user.gender) missing.push('gender');
  if (!missing.length) return 'Every profile field is filled in.';
  return `Add your ${missing.join(' and ')} to reach 100%.`;
}

function ProfileRow({ label, value }) {
  return (
    <div className="grid gap-1 py-3.5 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="break-words text-[15px] font-medium sm:col-span-2">
        {value || <span className="font-normal text-muted">Not provided</span>}
      </dd>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const editing = params.get('edit') === '1';

  const startEditing = () => setParams({ edit: '1' });
  const stopEditing = () => setParams({});

  return (
    <main>
      <section className="bg-brand-deep text-white">
        <div className="mx-auto flex max-w-5xl items-center gap-5 px-4 py-9 sm:px-6 sm:py-12">
          <Avatar name={user.fullName} size="lg" tone="dark" />
          <div className="min-w-0">
            <h1 className="break-words text-3xl font-bold sm:text-4xl">Welcome, {firstName(user.fullName)}</h1>
            <p className="mt-1.5 text-[15px] text-white/75">Here’s everything saved on your account.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard title="Account status">
            <p className="inline-flex items-center gap-2 text-xl font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-ok" aria-hidden="true" />
              Active
            </p>
          </SummaryCard>
          <SummaryCard title="Member since">
            <p className="text-xl font-semibold">{formatMonthYear(user.createdAt)}</p>
          </SummaryCard>
          <SummaryCard title="Profile completion">
            <p className="text-xl font-semibold">{user.profileCompletion}%</p>
            <div
              role="progressbar"
              aria-label="Profile completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={user.profileCompletion}
              className="mt-3 h-2 overflow-hidden rounded-full bg-brand-soft"
            >
              <div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${user.profileCompletion}%` }} />
            </div>
            <p className="mt-2.5 text-xs text-muted">{missingHint(user)}</p>
          </SummaryCard>
        </div>

        <section className="rounded-2xl border border-line bg-white p-5 sm:p-7" aria-labelledby="profile-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="profile-heading" className="text-xl font-bold">
              {editing ? 'Edit profile' : 'Profile'}
            </h2>
            {!editing && <Button variant="secondary" onClick={startEditing}>Edit profile</Button>}
          </div>

          <div className="mt-5">
            {editing ? (
              <EditProfileForm onDone={stopEditing} />
            ) : (
              <dl className="divide-y divide-line">
                <ProfileRow label="Full name" value={user.fullName} />
                <ProfileRow label="Username" value={user.username} />
                <ProfileRow label="Email address" value={user.email} />
                <ProfileRow label="Phone number" value={user.phone} />
                <ProfileRow label="Date of birth" value={user.dateOfBirth && formatDateOnly(user.dateOfBirth)} />
                <ProfileRow label="Gender" value={user.gender && GENDER_LABELS[user.gender]} />
                <ProfileRow label="Account created" value={formatDateTime(user.createdAt)} />
              </dl>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
