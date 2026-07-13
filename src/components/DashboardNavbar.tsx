import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut, type User } from 'firebase/auth';
import { auth } from '../firebase';

export function DashboardNavbar({ currentUser }: { currentUser: User | null }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/access', { replace: true });
  };

  const profileName = currentUser?.displayName?.trim() || currentUser?.email?.split('@')[0] || 'Account';
  const profileEmail = currentUser?.email || 'Signed in';

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#BA181B] to-[#7F1D1D] text-sm font-semibold text-white">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt={profileName} className="h-full w-full object-cover" />
            ) : (
              profileName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1E1E20]">{profileName}</p>
            <p className="text-xs text-[#6B7280]">{profileEmail}</p>
          </div>
        </div>

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
