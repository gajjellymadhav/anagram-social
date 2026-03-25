import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusSquare, Heart, User, Compass, MessageCircle } from "lucide-react";

const Navbar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/explore", icon: Compass, label: "Explore" },
    { to: "/create", icon: PlusSquare, label: "Create" },
    { to: "/notifications", icon: Heart, label: "Notifications" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Top bar - mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3 lg:hidden">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          Anagram
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/explore" className="text-foreground transition-colors hover:text-muted-foreground">
            <Search size={22} />
          </Link>
          <Link to="/messages" className="text-foreground transition-colors hover:text-muted-foreground">
            <MessageCircle size={22} />
          </Link>
        </div>
      </header>

      {/* Bottom bar - mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background py-2 lg:hidden">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 p-1.5 transition-all ${
              pathname === to ? "text-foreground" : "text-muted-foreground"
            }`}
            aria-label={label}
          >
            <Icon size={24} strokeWidth={pathname === to ? 2.5 : 1.5} />
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
