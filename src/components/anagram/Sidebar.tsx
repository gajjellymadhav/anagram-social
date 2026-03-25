import { Link, useLocation } from "react-router-dom";
import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, User, Menu } from "lucide-react";

const Sidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/explore", icon: Search, label: "Search" },
    { to: "/explore", icon: Compass, label: "Explore" },
    { to: "/messages", icon: MessageCircle, label: "Messages" },
    { to: "/notifications", icon: Heart, label: "Notifications" },
    { to: "/create", icon: PlusSquare, label: "Create" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
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
      </nav>

      <div className="w-full px-3">
        <button className="flex w-full items-center gap-4 rounded-lg px-3 py-3 transition-all hover:bg-secondary">
          <Menu size={24} strokeWidth={1.5} className="shrink-0" />
          <span className="hidden text-base xl:block">More</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
