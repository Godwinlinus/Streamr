import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Spinner } from "../components/ui/spinner";
import { useNavigate } from "react-router-dom";

const isEmail = (s = "") => /\S+@\S+\.\S+/.test(s);

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    // Validate inputs
    if (!isEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;
      
      // Optionally redirect to profile or signin page after a delay
      setTimeout(() => navigate("/profile"), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full items-center justify-center">
      <Card className="p-6 max-w-sm mx-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="font-bold mb-4">Sign Up</h2>

          {error && (
            <div className="bg-red-50 text-red-500 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {info && (
            <div className="bg-green-50 text-green-500 p-2 rounded mb-4 text-sm">
              {info}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner /> : "Sign Up"}
            </Button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                variant="ghost"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}