import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { Mail, User, Logout } from "lucide-react";

const Navbar = () => {
  const { user, logout, showNav } = useAuthStore();

  return (
    showNav && (
      <header className="bg-[#DA1C1C] text-white sticky top-0 w-full z-40 shadow-md">
        <div className="container mx-auto px-4 h-14">
          <div className="flex items-center justify-between h-full">
            {/* Logo replaced with Mail Icon */}
            <Link
              to="/"
              className="flex items-center gap-2 hover:text-yellow-300"
            >
              <Mail className="w-6 h-6 text-white " />
              Indi Post Collect
              <span className="sr-only">IndiPostCollect</span>
            </Link>

            <nav className="flex gap-6 text-sm font-medium">
              <Link
                to="/learn"
                className="hover:underline hover:text-yellow-300 transition"
              >
                Learn
              </Link>
              <Link
                to="/community"
                className="hover:underline hover:text-yellow-300 transition"
              >
                Community
              </Link>
              <Link
                to="/museum"
                className="hover:underline hover:text-yellow-300 transition"
              >
                Museum
              </Link>
              <Link
                to="/marketplace"
                className="hover:underline hover:text-yellow-300 transition"
              >
                Marketplace
              </Link>
              <Link
                to="/events"
                className="hover:underline hover:text-yellow-300 transition"
              >
                Events
              </Link>
            </nav>

            <div className="flex items-center gap-5">
              {!user ? (
                <Link
                  to="/login"
                  className="px-3 py-1 border border-yellow-300 rounded hover:bg-yellow-300 hover:text-red-800 transition"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="hover:underline hover:text-yellow-300 transition"
                  >
                    <div className="bg-white text-red-800 hover:bg-yellow-300 rounded-full p-2 hover:scale-105 transition">
                      <User className="w-5 h-5" />
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-1  rounded hover:bg-yellow-300 hover:text-red-800 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    )
  );
};

export default Navbar;
