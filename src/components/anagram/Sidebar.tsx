import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, MessageCircle, Heart, PlusSquare, User, Menu } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import SearchUsers from "./SearchUsers";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/messages", icon: MessageCircle, label: "Messages" },
    { to: "/notifications", icon: Heart, label: "Notifications" },
    { to: "/create", icon: PlusSquare, label: "Create" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[72px] flex-col items-center border-r bg-background py-8 xl:w-[244px] lg:flex">
        <Link to="/" className="mb-10 px-3">
          <span className="hidden font-display text-2xl font-bold tracking-tight xl:block">Anagram</span>
          <span className="font-display text-2xl font-bold xl:hidden">A</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 w-full px-3">
          {links.map(({ to, icon: Icon, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={label}
                to={to}
                className={`group flex items-center gap-4 rounded-lg px-3 py-3 transition-all hover:bg-secondary ${
                  active ? "font-semibold" : "font-normal"
                }`}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 1.5} className="shrink-0" />
                <span className="hidden text-base xl:block">{label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setShowSearch(true)}
            className="group flex items-center gap-4 rounded-lg px-3 py-3 transition-all hover:bg-secondary font-normal"
          >
            <Search size={24} strokeWidth={1.5} className="shrink-0" />
            <span className="hidden text-base xl:block">Search</span>
          </button>
        </nav>

        <div className="w-full px-3 space-y-1">
          <DarkModeToggle />
          <button className="flex w-full items-center gap-4 rounded-lg px-3 py-3 transition-all hover:bg-secondary">
            <Menu size={24} strokeWidth={1.5} className="shrink-0" />
            <span className="hidden text-base xl:block">More</span>
          </button>
        </div>
      </aside>

      {/* Search panel */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="hidden lg:block w-[72px] xl:w-[244px] shrink-0" />
          <div className="w-full max-w-sm border-r bg-background shadow-elevated">
            <SearchUsers onClose={() => setShowSearch(false)} />
          </div>
          <div className="flex-1" onClick={() => setShowSearch(false)} />
        </div>
      )}
    </>
  );
};

export default Sidebar;
