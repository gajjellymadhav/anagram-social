import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, MessageCircle, Heart, PlusSquare, User, Menu, LogOut, Trash2, UserX } from "lucide-react";
import { api } from "@/services/api";
import DarkModeToggle from "./DarkModeToggle";
import SearchUsers from "./SearchUsers";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"delete" | "deactivate" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleLogout = () => {
    api.logout();
    navigate("/login");
  };

  const handleConfirm = async () => {
    setActionLoading(true);
    try {
      if (confirmAction === "delete") {
        await api.deleteAccount();
      } else {
        await api.deactivateAccount();
      }
      api.logout();
      navigate("/login");
    } catch {
      // handle error
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

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
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex w-full items-center gap-4 rounded-lg px-3 py-3 transition-all hover:bg-secondary"
          >
            <Menu size={24} strokeWidth={1.5} className="shrink-0" />
            <span className="hidden text-base xl:block">More</span>
          </button>
        </div>

        {/* More menu popover */}
        {showMore && (
          <div className="absolute bottom-16 left-3 right-3 xl:right-auto xl:w-[220px] rounded-xl border bg-background shadow-elevated p-1.5 space-y-0.5 animate-slide-up">
            {confirmAction ? (
              <div className="p-3 space-y-3 text-center">
                <p className="text-sm font-semibold">
                  {confirmAction === "delete" ? "Delete Account?" : "Deactivate Account?"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {confirmAction === "delete"
                    ? "This is permanent and cannot be undone."
                    : "Your account will be hidden until you log in again."}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={actionLoading}
                    className="flex-1 rounded-lg bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {actionLoading ? "..." : "Confirm"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Account</p>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
                <button
                  onClick={() => setConfirmAction("deactivate")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                >
                  <UserX size={16} />
                  <span>Deactivate Account</span>
                </button>
                <button
                  onClick={() => setConfirmAction("delete")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                  <span>Delete Account</span>
                </button>
              </>
            )}
          </div>
        )}
        {showMore && (
          <div className="fixed inset-0 z-40" onClick={() => { setShowMore(false); setConfirmAction(null); }} />
        )}
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
