import { Link } from "react-router-dom";
import { useAuth } from "@/contexts";
import { FaUser, FaGamepad, FaTrophy, FaCog } from "react-icons/fa";

export const NavAuthButton = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/leaderboard"
          className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-2 text-sm font-medium text-yellow-300 backdrop-blur-sm transition hover:bg-yellow-500/30"
          title="Leaderboard"
        >
          <FaTrophy className="text-sm" />
          <span className="hidden lg:inline">Leaderboard</span>
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 rounded-full bg-violet-600/80 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-violet-700"
          title="Dashboard"
        >
          <FaGamepad className="text-sm" />
          <span className="hidden lg:inline">Dashboard</span>
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-2 text-sm font-medium text-red-300 backdrop-blur-sm transition hover:bg-red-500/30"
            title="Admin Panel"
          >
            <FaCog className="text-sm" />
            <span className="hidden lg:inline">Admin</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/leaderboard"
        className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-2 text-sm font-medium text-yellow-300 backdrop-blur-sm transition hover:bg-yellow-500/30"
        title="Leaderboard"
      >
        <FaTrophy className="text-sm" />
        <span className="hidden lg:inline">Leaderboard</span>
      </Link>
      <Link
        to="/login"
        className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
        title="Sign In"
      >
        <FaUser className="text-sm" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    </div>
  );
};
