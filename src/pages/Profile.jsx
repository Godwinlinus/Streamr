import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Spinner } from "../components/ui/spinner";

const isEmail = (s = "") => /\S+@\S+\.\S+/.test(s);

export default function Profile() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("signed-out");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
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
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
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
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;
      setInfo("Successfully signed in!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  if (mode === "signed-in") {
    return (
      <Card className="p-6 max-w-sm mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="mb-4">Signed in as: {user.email}</p>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col min-h-full items-center justify-center">
      <Card className="p-6 max-w-sm mx-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="font-bold mb-4">Sign In</h2>
          
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

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {info && <p className="text-green-500 text-sm">{info}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Sign In"}
            </Button>
          </div>
        </form>
      </Card>
    </div>    
  );
}