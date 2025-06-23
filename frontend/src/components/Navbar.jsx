import { Link } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore.js'
import { LogOut, MessageSquare, LogIn, User } from "lucide-react";
// import { useEffect } from "react";

const Navbar = () => {
  const { user, logout, showNav } = useAuthStore();

  //   useEffect(() => {
  //     console.log(user);
  //   }, [user])

  // if (location.pathname === '/login' || location.pathname === '/signup') {
  //   return null;
  // }

  return (
    showNav && <header
      className="bg-IPCprimary text-IPCtext sticky w-full top-0 z-40 backdrop-blur-lg"
    >
      <div className="container mx-auto px-2 h-14">
        <div className="flex items-center justify-around h-full">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <h1 className="font-bold nav-menu">IndiPostCollect</h1>
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <Link to="/learn" className="nav-menu">
              Learn
            </Link>
            <Link to="/community" className="nav-menu">
              Community
            </Link>
            <Link to="/museum" className="nav-menu">
              Museum
            </Link>
            <Link to="/marketplace" className="nav-menu">
              Marketplace
            </Link>
            <Link to="/events" className="nav-menu">
              Events
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {!user && <Link
              to={"/login"}
              className="nav-menu"
            >
              Login
            </Link>}

            {user && (
              <>
                <Link to={"/profile"} className="nav-menu">
                  Profile
                </Link>

                <button className="nav-menu" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar