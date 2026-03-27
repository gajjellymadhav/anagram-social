import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { ImagePlus, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ACCEPTED_TYPES = "image/*,video/*";

const CreatePost = () => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setFileError("Only image and video files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setFileUrl(URL.createObjectURL(file));
    setIsVideo(file.type.startsWith("video/"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl) return;
    setLoading(true);
    try {
      await api.createPost({
        imageUrl: isVideo ? "" : fileUrl,
        videoUrl: isVideo ? fileUrl : undefined,
        caption,
      });
      navigate("/");
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-4">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-foreground">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-base font-semibold">Create new post</h1>
        <button
          onClick={handleSubmit}
          disabled={!fileUrl || loading}
          className="text-sm font-semibold text-accent disabled:opacity-40 transition-opacity"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Share"}
        </button>
      </div>

      {!preview ? (
        <label className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary transition-colors hover:bg-muted">
          <ImagePlus size={48} className="text-muted-foreground mb-3" />
          <span className="text-sm font-medium text-muted-foreground">Tap to select a photo or video</span>
          <span className="text-xs text-muted-foreground mt-1">Images and videos only</span>
          {fileError && <span className="text-xs text-destructive mt-2">{fileError}</span>}
          <input type="file" accept={ACCEPTED_TYPES} className="hidden" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-secondary">
            {isVideo ? (
              <video src={preview} controls className="h-full w-full object-cover" />
            ) : (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            )}
          </div>
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-muted-foreground/50 transition-colors"
          />
          <button
            onClick={() => { setPreview(null); setFileUrl(""); setIsVideo(false); }}
            className="text-sm text-destructive"
          >
            Remove media
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
