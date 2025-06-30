import { Link } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore.js'
import { LogOut, MessageSquare, LogIn, User, Menu } from "lucide-react";
// import { useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";

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
      className="bg-IPCprimary text-IPCtext sticky w-full top-0 z-40"
    >
      <div className="mx-auto px-6 lg:px-2 h-14 flex items items-center justify-between lg:justify-around">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-bold nav-menu">IndiPostCollect</h1>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8">
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

        <div className="hidden lg:flex items-center gap-6">
          {!user && <Link
            to={"/login"}
            className="nav-menu"
          >
            Login
          </Link>}

          {user && (
            <div className="flex items-center gap-4">
              <Link to={"/profile"} className="nav-menu">
                Profile
              </Link>

              <button className="nav-menu" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>

        <Sheet className="lg:hidden">
          <SheetTrigger className="lg:hidden"><Menu /></SheetTrigger>
          <SheetContent className="bg-IPCprimary text-IPCtext lg:hidden [&>button]:hidden">
            <SheetHeader className="flex justify-center border-b-2 border-IPCtext">
              {!user && (
                <SheetClose asChild>
                  <Link to="/login" className="text-IPCtext w-full h-full">
                    <Button variant="ghost" ><LogIn size={32}/> Login</Button>
                  </Link>
                </SheetClose>
              )}
              {user && (
                <SheetClose asChild>
                  <Link className="flex" to="/profile">
                    <Avatar className="shrink-0 size-10">
                      <AvatarImage
                        src={user.profilePic}
                        alt={`@${user.fullName}`}
                        className="object-cover rounded-full"
                      />
                      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h1 className="ml-2 my-auto">{user.fullName}</h1>
                    <SheetClose asChild>
                      <Button variant="ghost" onClick={logout} className="ml-auto"><LogOut /></Button>
                    </SheetClose>
                  </Link>
                </SheetClose>
              )}
            </SheetHeader>
            <div className="p-4 flex items-start gap-4 flex-col">
              <SheetClose asChild>
                <Link to="/" className="nav-menu border-b-2 border-IPCtext w-full">
                  Home
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/learn" className="nav-menu border-b-2 border-IPCtext w-full">
                  Learn
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/community" className="nav-menu border-b-2 border-IPCtext w-full">
                  Community
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/museum" className="nav-menu border-b-2 border-IPCtext w-full">
                  Museum
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/marketplace" className="nav-menu border-b-2 border-IPCtext w-full">
                  Marketplace
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/events" className="nav-menu border-b-2 border-IPCtext w-full">
                  Events
                </Link>
              </SheetClose>
            </div>
            {/* <SheetFooter>
              
            </SheetFooter> */}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export default Navbar