import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [form, setForm] = useState({
    firstName: "", lastName: "", age: "", gender: "",
    email: "", phone: "", username: "", password: "", confirm: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
      await api.signup({
        firstName: form.firstName, lastName: form.lastName,
        age: form.age, gender: form.gender,
        email: form.email, phone: form.phone,
        username: form.username, password: form.password,
      });
      setStep("otp");
    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    setError("");
    try {
      await api.verifyOtp({ email: form.email, otp });
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // In real app, trigger Google OAuth flow
  };

  const inputClass = "w-full rounded-lg border bg-secondary px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-muted-foreground/50 transition-colors";

  if (step === "otp") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="rounded-2xl border bg-background p-8 shadow-card space-y-6 text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight">Verify Email</h1>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit code to <strong>{form.email}</strong>
            </p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="mx-auto animate-spin" /> : "Verify"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="rounded-2xl border bg-background p-8 shadow-card space-y-5">
          <h1 className="text-center font-display text-4xl font-bold tracking-tight">Anagram</h1>
          <p className="text-center text-sm text-muted-foreground">
            Sign up to see photos and videos from your friends.
          </p>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            className="flex w-full items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="First Name" value={form.firstName} onChange={update("firstName")} className={inputClass} required />
              <input type="text" placeholder="Last Name" value={form.lastName} onChange={update("lastName")} className={inputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Age" value={form.age} onChange={update("age")} className={inputClass} required min="13" />
              <select value={form.gender} onChange={update("gender")} className={inputClass} required>
                <option value="" disabled>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <input type="email" placeholder="Email" value={form.email} onChange={update("email")} className={inputClass} required />
            <input type="tel" placeholder="Phone Number" value={form.phone} onChange={update("phone")} className={inputClass} required />
            <input type="text" placeholder="Username" value={form.username} onChange={update("username")} className={inputClass} required />
            <input type="password" placeholder="Password" value={form.password} onChange={update("password")} className={inputClass} required />
            <input type="password" placeholder="Confirm Password" value={form.confirm} onChange={update("confirm")} className={inputClass} required />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading || !form.firstName || !form.email || !form.username || !form.password || !form.confirm}
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
