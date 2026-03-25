import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.signup({ username: form.username, email: form.email, password: form.password });
      localStorage.setItem("anagram_token", res.token);
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="rounded-2xl border bg-background p-8 shadow-card space-y-6">
          <h1 className="text-center font-display text-4xl font-bold tracking-tight">Anagram</h1>
          <p className="text-center text-sm text-muted-foreground">
            Sign up to see photos and videos from your friends.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={update("username")}
              className="w-full rounded-lg border bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-muted-foreground/50 transition-colors"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={update("email")}
              className="w-full rounded-lg border bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-muted-foreground/50 transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={update("password")}
              className="w-full rounded-lg border bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-muted-foreground/50 transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={form.confirm}
              onChange={update("confirm")}
              className="w-full rounded-lg border bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-muted-foreground/50 transition-colors"
              required
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading || !form.username || !form.email || !form.password || !form.confirm}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="mx-auto animate-spin" /> : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground leading-relaxed">
            By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-5 text-center shadow-card">
          <p className="text-sm">
            Have an account?{" "}
            <Link to="/login" className="font-semibold text-accent">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
