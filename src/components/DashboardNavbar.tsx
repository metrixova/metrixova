import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export function DashboardNavbar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/access', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] px-4 py-2 text-sm font-medium text-[#1E1E20] transition-colors hover:bg-[#F3F4F6]"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
