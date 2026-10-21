import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Logo from '../components/Logo';
import ProfileMenu from '../components/ProfileMenu';
import { useAuth } from '../hooks/useAuth';

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      navigate('/signin', { replace: true });
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" aria-label="Pillar dashboard">
              <Logo />
            </Link>
            <nav aria-label="Main">
              <Link
                to="/dashboard"
                aria-current="page"
                className="border-b-2 border-brand py-5 text-sm font-semibold text-ink"
              >
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleSignOut}
              loading={signingOut}
              loadingText="Logging out…"
              className="hidden sm:inline-flex"
            >
              Log out
            </Button>
            <ProfileMenu onSignOut={handleSignOut} />
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
