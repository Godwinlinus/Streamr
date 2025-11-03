import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Label } from "../ui/label";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword(form);
      if (error) throw error;

      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Something broke. Not your fault… kinda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full items-center justify-center">
      <Card className="p-6 max-w-sm mx-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="font-bold mb-4">Sign In</h2>
          <div className="space-y-4">

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <div className="flex gap-2 text-sm items-center">
              <Button type="submit" disabled={loading}>
                Sign In
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => navigate("/signup")}
                disabled={loading}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
