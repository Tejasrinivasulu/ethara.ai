import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type Role } from "@/lib/auth";
import { toast } from "sonner";
import { z } from "zod";
import { FloatingOrbs } from "@/components/landing/FloatingOrbs";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoWhiteText from "@/assets/logo-white-text.png";

const schema = z.object({
  role: z.enum(["admin", "member"]),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters").max(100),
}).refine((v) => v.password === v.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Ethara.AI" },
      { name: "description", content: "Create your Ethara.AI account and start managing projects with AI." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signup, signupWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("member");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [showGoogleVerify, setShowGoogleVerify] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"role" | "name" | "email" | "password" | "confirmPassword", string>>
  >({});

  const onGoogleSignup = async () => {
    if (!showGoogleVerify) {
      setShowGoogleVerify(true);
      setGoogleError("");
      return;
    }
    const normalized = googleEmail.trim().toLowerCase();
    if (!normalized || !normalized.endsWith("@gmail.com")) {
      setGoogleError("Please enter a valid Gmail address.");
      return;
    }
    setGoogleError("");
    setLoading(true);
    try {
      const u = await signupWithGoogle(role, normalized);
      toast.success(`Welcome to Ethara, ${u.name}!`);
      navigate({ to: u.role === "admin" ? "/admin" : "/member" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ role, name, email, password, confirmPassword });
    if (!r.success) {
      const nextErrors: Partial<
        Record<"role" | "name" | "email" | "password" | "confirmPassword", string>
      > = {};
      for (const issue of r.error.issues) {
        const key = issue.path[0] as "role" | "name" | "email" | "password" | "confirmPassword";
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const u = await signup(role, name, email, password);
      toast.success(`Welcome to Ethara, ${u.name}!`);
      navigate({ to: u.role === "admin" ? "/admin" : "/member" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero relative flex items-center justify-center p-4">
      <FloatingOrbs />
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <Link to="/" className="absolute top-4 left-4">
        <img src={logoWhiteText} alt="Ethara.AI" className="h-10 w-auto" />
      </Link>

      <div className="glass-card rounded-3xl p-6 w-full max-w-md shadow-glow animate-fade-up border border-border/70">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Signup Form</h1>
          <p className="text-sm text-muted-foreground mt-2">Create your Ethara.AI account</p>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <Label className="mb-2 block">Role Selection</Label>
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              {(["admin", "member"] as Role[]).map((r) => {
                const Icon = r === "admin" ? Shield : User;
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-2xl h-14 border-2 transition-all flex items-center justify-center gap-2 text-lg ${
                      active
                        ? "border-primary bg-primary/10 text-foreground shadow-glow"
                        : "border-primary/40 bg-background/40 text-muted-foreground hover:border-primary/70 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold capitalize">{r}</span>
                  </button>
                );
              })}
            </div>
            {fieldErrors.role && <p className="text-xs text-destructive mt-1.5">{fieldErrors.role}</p>}
          </div>
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="mt-1.5" required />
            {fieldErrors.name && <p className="text-xs text-destructive mt-1.5">{fieldErrors.name}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ethara.ai" className="mt-1.5" required />
            {fieldErrors.email && <p className="text-xs text-destructive mt-1.5">{fieldErrors.email}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1.5">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-xs text-destructive mt-1.5">{fieldErrors.password}</p>}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative mt-1.5">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-destructive mt-1.5">{fieldErrors.confirmPassword}</p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-aurora text-primary-foreground hover:opacity-90 shadow-glow">
            {loading ? "Creating account..." : "Signup"}
          </Button>
          <Button type="button" variant="outline" onClick={onGoogleSignup} disabled={loading} className="w-full">
            <svg viewBox="0 0 48 48" className="h-4 w-4 mr-2" aria-hidden="true">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.196 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.053 6.053 29.277 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.955 3.045l5.657-5.657C34.053 6.053 29.277 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"/>
              <path fill="#4CAF50" d="M24 44c5.175 0 9.86-1.977 13.409-5.197l-6.194-5.238C29.145 35.091 26.715 36 24 36c-5.176 0-9.62-3.326-11.28-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.087 5.565l.003-.002 6.194 5.238C36.971 39.296 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            {showGoogleVerify ? "Verify Gmail & Signup" : "Google Signup"}
          </Button>
          {showGoogleVerify && (
            <div>
              <Label htmlFor="googleEmail">Verify Google Gmail</Label>
              <Input
                id="googleEmail"
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="mt-1.5"
                required
              />
              {googleError && <p className="text-xs text-destructive mt-1.5">{googleError}</p>}
            </div>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
