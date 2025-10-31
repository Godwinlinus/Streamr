import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("signin"); // signin | signup | reset

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        alert("Logged in");
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Check your email to confirm account");
      }

      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        alert("Reset link sent to your email");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <Card className="w-full max-w-sm bg-neutral-950 p-6 border-neutral-800">
        <h1 className="text-xl font-semibold mb-3">
          {mode === "signin" && "Sign in to continue"}
          {mode === "signup" && "Create your account"}
          {mode === "reset" && "Reset password"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            required
            type="email"
            placeholder="Email"
            className="bg-neutral-900 border-neutral-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {mode !== "reset" && (
            <Input
              required
              type="password"
              placeholder="Password"
              className="bg-neutral-900 border-neutral-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <Button disabled={loading} className="w-full bg-white text-black">
            {loading
              ? "Processing..."
              : mode === "signin"
              ? "Sign In"
              : mode === "signup"
              ? "Sign Up"
              : "Send Reset Link"}
          </Button>
        </form>

        <div className="text-sm text-neutral-400 mt-4 flex flex-col gap-2">
          {mode === "signin" && (
            <>
              <button onClick={() => setMode("signup")}>
                Create an account
              </button>
              <button onClick={() => setMode("reset")}>
                Forgot password?
              </button>
            </>
          )}
          {mode !== "signin" && (
            <button onClick={() => setMode("signin")}>
              Back to sign in
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
