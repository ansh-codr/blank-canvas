import { Link } from "react-router-dom";
import { useAuth } from "@/contexts";
import { FaUser, FaGamepad } from "react-icons/fa";

export const NavAuthButton = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <Link
        to="/dashboard"
        className="ml-4 flex items-center gap-2 rounded-full bg-violet-600/80 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-violet-700"
      >
        <FaGamepad className="text-sm" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
    );
  }

  return (
    <Link
      to="/login"
      className="ml-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
    >
      <FaUser className="text-sm" />
      <span className="hidden sm:inline">Sign In</span>
    </Link>
  );
};
