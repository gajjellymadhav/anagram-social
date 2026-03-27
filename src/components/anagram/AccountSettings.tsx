import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { LogOut, Trash2, UserX, X } from "lucide-react";

interface AccountSettingsProps {
  open: boolean;
  onClose: () => void;
}

const AccountSettings = ({ open, onClose }: AccountSettingsProps) => {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState<"delete" | "deactivate" | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleLogout = () => {
    api.logout();
    navigate("/login");
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.deleteAccount();
      api.logout();
      navigate("/login");
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await api.deactivateAccount();
      api.logout();
      navigate("/login");
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-background shadow-elevated animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {confirmAction ? (
          <div className="p-6 space-y-4 text-center">
            <h3 className="text-lg font-semibold">
              {confirmAction === "delete" ? "Delete Account?" : "Deactivate Account?"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {confirmAction === "delete"
                ? "This action is permanent and cannot be undone. All your data will be lost."
                : "Your account will be hidden until you log in again."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction === "delete" ? handleDelete : handleDeactivate}
                disabled={loading}
                className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-base font-semibold">Settings</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors hover:bg-secondary"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
              <button
                onClick={() => setConfirmAction("deactivate")}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors hover:bg-secondary"
              >
                <UserX size={18} />
                <span>Deactivate Account</span>
              </button>
              <button
                onClick={() => setConfirmAction("delete")}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 size={18} />
                <span>Delete Account</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
