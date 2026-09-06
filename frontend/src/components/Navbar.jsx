import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore.js';
import { useWishlistStore } from '../store/useWishlistStore.js';
import { LogOut, LogIn, Menu, Heart } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";

const Navbar = () => {
  const { user, logout, showNav } = useAuthStore();
  const { wishlist } = useWishlistStore();

  return (
    showNav && (
      <header className="bg-background/90 text-foreground border-b border-border sticky w-full top-0 z-40 backdrop-blur-md">
        <div className="mx-auto px-6 lg:px-2 h-16 flex items-center justify-between lg:justify-around">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <h1 className="font-bold text-xl text-IPCprimary">IndiPostCollect<span className="text-IPCsecondary">.</span></h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink to="/learn" className={({ isActive }) => `nav-menu ${isActive ? 'nav-menu-active' : ''}`}>Learn</NavLink>
            <NavLink to="/ai-assistant" className={({ isActive }) => `nav-menu ${isActive ? 'nav-menu-active' : ''}`}>AI Assistant</NavLink>
            <NavLink to="/community" className={({ isActive }) => `nav-menu ${isActive ? 'nav-menu-active' : ''}`}>Community</NavLink>
            <NavLink to="/museum" className={({ isActive }) => `nav-menu ${isActive ? 'nav-menu-active' : ''}`}>Museum</NavLink>
            <NavLink to="/marketplace" className={({ isActive }) => `nav-menu ${isActive ? 'nav-menu-active' : ''}`}>Marketplace</NavLink>
            <NavLink to="/events" className={({ isActive }) => `nav-menu ${isActive ? 'nav-menu-active' : ''}`}>Events</NavLink>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-6">
            {!user ? (
              <NavLink to="/login" className={({ isActive }) => `nav-menu ${isActive ? 'nav-menu-active' : ''}`}>Login</NavLink>
            ) : (
              <div className="flex items-center gap-5">
                <NavLink
                  to="/profile?tab=wishlist"
                  className={({ isActive }) => `nav-menu flex items-center gap-1.5 ${isActive ? 'nav-menu-active' : ''}`}
                  title="Want-List & Saved Stamps"
                >
                  <Heart className="h-3.5 w-3.5 text-IPCsecondary" />
                  <span>Saved</span>
                  {wishlist.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-IPCsecondary text-white text-[9px] font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/cart" className={({ isActive }) => `nav-menu ${isActive ? 'nav-menu-active' : ''}`}>Cart</NavLink>
                <NavLink to="/profile" className={({ isActive }) => `nav-menu ${isActive ? 'nav-menu-active' : ''}`}>Profile</NavLink>
                <button className="nav-menu" onClick={logout}>Logout</button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Sheet */}
          <Sheet className="lg:hidden">
            <SheetTrigger className="lg:hidden"><Menu /></SheetTrigger>
            <SheetContent className="bg-background text-foreground lg:hidden [&>button]:hidden border-l border-border">
              <SheetHeader className="flex justify-center border-b border-border pb-4">
                {!user && (
                  <SheetClose asChild>
                    <Link to="/login" className="text-foreground w-full h-full">
                      <Button variant="ghost"><LogIn size={24} className="mr-2"/> Login</Button>
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
                        <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h1 className="ml-2 my-auto">{user.fullName}</h1>
                      <SheetClose asChild>
                        <Button variant="ghost" onClick={logout} className="ml-auto"><LogOut /></Button>
                      </SheetClose>
                    </Link>
                  </SheetClose>
                )}
              </SheetHeader>

              {/* Mobile Nav Links */}
              <div className="p-4 flex items-start gap-4 flex-col">
                <SheetClose asChild><NavLink to="/" className={({ isActive }) => `nav-menu border-b border-border pb-2 w-full ${isActive ? 'nav-menu-active' : ''}`}>Home</NavLink></SheetClose>
                <SheetClose asChild><NavLink to="/learn" className={({ isActive }) => `nav-menu border-b border-border pb-2 w-full ${isActive ? 'nav-menu-active' : ''}`}>Learn</NavLink></SheetClose>
                <SheetClose asChild><NavLink to="/ai-assistant" className={({ isActive }) => `nav-menu border-b border-border pb-2 w-full ${isActive ? 'nav-menu-active' : ''}`}>AI Assistant</NavLink></SheetClose>
                <SheetClose asChild><NavLink to="/community" className={({ isActive }) => `nav-menu border-b border-border pb-2 w-full ${isActive ? 'nav-menu-active' : ''}`}>Community</NavLink></SheetClose>
                <SheetClose asChild><NavLink to="/museum" className={({ isActive }) => `nav-menu border-b border-border pb-2 w-full ${isActive ? 'nav-menu-active' : ''}`}>Museum</NavLink></SheetClose>
                <SheetClose asChild><NavLink to="/marketplace" className={({ isActive }) => `nav-menu border-b border-border pb-2 w-full ${isActive ? 'nav-menu-active' : ''}`}>Marketplace</NavLink></SheetClose>
                <SheetClose asChild><NavLink to="/events" className={({ isActive }) => `nav-menu border-b border-border pb-2 w-full ${isActive ? 'nav-menu-active' : ''}`}>Events</NavLink></SheetClose>

                {user && (
                  <>
                    <SheetClose asChild>
                      <NavLink to="/profile?tab=wishlist" className={({ isActive }) => `nav-menu border-b border-border pb-2 w-full flex items-center justify-between ${isActive ? 'nav-menu-active' : ''}`}>
                        <span className="flex items-center gap-2">
                          <Heart className="h-3.5 w-3.5 text-IPCsecondary" /> Saved Stamps
                        </span>
                        {wishlist.length > 0 && (
                          <span className="px-1.5 py-0.2 bg-IPCsecondary text-white text-[10px] font-bold">
                            {wishlist.length}
                          </span>
                        )}
                      </NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                      <NavLink to="/cart" className={({ isActive }) => `nav-menu border-b border-border pb-2 w-full ${isActive ? 'nav-menu-active' : ''}`}>Cart</NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                      <NavLink to="/profile" className={({ isActive }) => `nav-menu border-b border-border pb-2 w-full ${isActive ? 'nav-menu-active' : ''}`}>Profile</NavLink>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    )
  );
};

export default Navbar;
