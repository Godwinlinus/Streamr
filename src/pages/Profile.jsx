// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/* shadcn-style primitives — replace paths if your project differs */
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Spinner } from "../components/ui/spinner"; // optional, fallback below if you don't have it

// Minimal inline helper for email validation
const isEmail = (s = "") => /\S+@\S+\.\S+/.test(s);

export default function Profile() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("signed-out"); // 'signed-out' | 'sign-in' | 'sign-up' | 'signed-in'
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  // load current session user on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        if (data?.user) {
          setUser(data.user);
          setMode("signed-in");
        } else {
          setUser(null);
          setMode("signed-out");
        }
      } catch (err) {
        // ignore
      }
    })();

    // subscribe to auth changes so UI stays in sync
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setMode("signed-in");
      } else {
        setUser(null);
        setMode("signed-out");
      }
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe?.();
    };
  }, []);

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  // sign in
  const handleSignIn = async (e) => {
    e?.preventDefault();
    resetMessages();
    if (!isEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (err) {
      setError(err.message || "Sign in failed.");
      return;
    }
    setUser(data?.user ?? null);
    setMode("signed-in");
  };

  // sign up
  const handleSignUp = async (e) => {
    e?.preventDefault();
    resetMessages();
    if (!isEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (err) {
      setError(err.message || "Sign up failed.");
      return;
    }
    // Supabase may require email confirmation depending on your project settings
    setInfo("Check your email for a confirmation link (if required).");
    setUser(data?.user ?? null);
    setMode("signed-in");
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setMode("signed-out");
    setLoading(false);
  };

  const CompactForm = ({ onSubmit, submitLabel = "Continue" }) => (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
          placeholder="••••••••"
        />
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}
      {info && <div className="text-sm text-green-400">{info}</div>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Working..." : submitLabel}
        </Button>
        <Button
          variant="ghost"
          type="button"
          onClick={() => {
            resetMessages();
            setMode("signed-out");
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-6">
        {/* signed out landing */}
        {mode === "signed-out" && (
          <>
            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-neutral-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold">Welcome to Streamr</h2>
              <p className="text-sm text-neutral-400 mt-1">Sign in to personalize your feed and save favorites.</p>
            </div>

            <div className="space-y-3">
              <Button onClick={() => { resetMessages(); setMode("sign-in"); }} className="w-full">
                Sign in
              </Button>
              <Button onClick={() => { resetMessages(); setMode("sign-up"); }} className="w-full" variant="outline">
                Create account
              </Button>
            </div>
          </>
        )}

        {/* sign-in */}
        {mode === "sign-in" && (
          <>
            <h3 className="text-lg font-semibold mb-3">Sign in</h3>
            <CompactForm onSubmit={handleSignIn} submitLabel="Sign in" />
            <div className="mt-3 text-sm text-neutral-400">
              Don’t have an account?{" "}
              <button className="text-indigo-400 hover:underline" onClick={() => { resetMessages(); setMode("sign-up"); }}>
                Create one
              </button>
            </div>
          </>
        )}

        {/* sign-up */}
        {mode === "sign-up" && (
          <>
            <h3 className="text-lg font-semibold mb-3">Create account</h3>
            <CompactForm onSubmit={handleSignUp} submitLabel="Sign up" />
            <div className="mt-3 text-sm text-neutral-400">
              Already have an account?{" "}
              <button className="text-indigo-400 hover:underline" onClick={() => { resetMessages(); setMode("sign-in"); }}>
                Sign in
              </button>
            </div>
          </>
        )}

        {/* signed-in */}
        {mode === "signed-in" && user && (
          <>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-neutral-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold">{user.email}</div>
                <div className="text-xs text-neutral-400">Member</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button onClick={() => setMode("signed-in")} className="w-full">
                Open dashboard
              </Button>

              <Button variant="destructive" onClick={handleSignOut} className="w-full" disabled={loading}>
                {loading ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
