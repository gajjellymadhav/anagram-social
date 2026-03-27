import { useState } from "react";
import { api } from "@/services/api";
import { X, Upload, Trash2 } from "lucide-react";

interface ProfilePhotoMenuProps {
  open: boolean;
  onClose: () => void;
  onUpdated: (avatar?: string) => void;
}

const ProfilePhotoMenu = ({ open, onClose, onUpdated }: ProfilePhotoMenuProps) => {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    // In real app, upload file to server first, then update avatar URL
    const url = URL.createObjectURL(file);
    api.updateAvatar(url).then((user) => {
      onUpdated(user.avatar);
      onClose();
    }).catch(() => {}).finally(() => setLoading(false));
  };

  const handleRemove = () => {
    setLoading(true);
    api.removeAvatar().then(() => {
      onUpdated(undefined);
      onClose();
    }).catch(() => {}).finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xs rounded-2xl bg-background shadow-elevated animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold">Profile Photo</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-2">
          <label className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm text-accent transition-colors hover:bg-secondary ${loading ? "opacity-50 pointer-events-none" : ""}`}>
            <Upload size={18} />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
          >
            <Trash2 size={18} />
            <span>Remove Current Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoMenu;
