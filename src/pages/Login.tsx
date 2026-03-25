import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem("anagram_token", res.token);
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
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
            Sign in to see photos and videos from your friends.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-muted-foreground/50 transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-muted-foreground/50 transition-colors"
              required
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="mx-auto animate-spin" /> : "Log In"}
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Forgot password?
          </button>
        </div>

        <div className="rounded-2xl border bg-background p-5 text-center shadow-card">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-accent">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
