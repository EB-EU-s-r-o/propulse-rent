import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { lovable } from "@/integrations/lovable/index";

const credentialsSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(72),
  displayName: z.string().trim().max(80).optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [appleSubmitting, setAppleSubmitting] = useState(false);

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    const setSubmitting = provider === "google" ? setGoogleSubmitting : setAppleSubmitting;
    setSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        logger.error(`${provider} sign-in failed`, result.error);
        toast.error(`${provider === "google" ? "Google" : "Apple"} sign-in failed. Please try again.`);
        setSubmitting(false);
        return;
      }
      if (result.redirected) return; // Browser is redirecting to the provider
      // Session set — onAuthStateChange navigates to "/"
    } catch (error) {
      logger.error(`${provider} sign-in failed`, error);
      toast.error(`${provider === "google" ? "Google" : "Apple"} sign-in failed. Please try again.`);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credentialsSchema.safeParse({ email, password, displayName });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: parsed.data.displayName || parsed.data.email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm your address.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (error) {
      logger.error("auth failure", error);
      const message = error instanceof Error && /invalid login credentials/i.test(error.message)
        ? "Incorrect email or password"
        : "Unable to complete that request. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1 className="mb-1 text-2xl font-semibold text-foreground">
          {mode === "signin" ? "Sign in" : "Create an account"}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Access to the RENT dashboard is restricted to authorized users.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mb-2 w-full"
          onClick={() => handleOAuthSignIn("google")}
          disabled={googleSubmitting || appleSubmitting || submitting}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            />
          </svg>
          {googleSubmitting ? "Redirecting…" : "Continue with Google"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="mb-4 w-full"
          onClick={() => handleOAuthSignIn("apple")}
          disabled={googleSubmitting || appleSubmitting || submitting}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.365 1.43c0 1.14-.417 2.2-1.25 3.05-.833.85-1.883 1.34-3.033 1.26-.083-1.08.417-2.21 1.217-3.02.833-.87 2-1.37 3.066-1.29zM20.94 17.1c-.5 1.15-.74 1.66-1.383 2.68-.9 1.41-2.167 3.17-3.733 3.18-1.4.03-1.76-.91-3.653-.9-1.9.01-2.3.94-3.7.91-1.567-.01-2.767-1.6-3.667-3.01-2.516-3.83-2.783-8.32-1.233-10.71 1.1-1.7 2.833-2.69 4.467-2.69 1.667 0 2.717.92 4.1.92 1.333 0 2.15-.92 4.083-.92 1.45 0 2.983.79 4.083 2.15-3.583 1.97-3 7.09.7 8.39z"
            />
          </svg>
          {appleSubmitting ? "Redirecting…" : "Continue with Apple"}
        </Button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="displayName">Name</Label>
              <Input
                id="displayName"
                value={displayName}
                maxLength={80}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </Button>
        </form>

        <button
          type="button"
          className="mt-6 w-full text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
