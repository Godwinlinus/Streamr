import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Spinner } from "../components/ui/spinner";
import SignIn from "../components/auth/SignIn";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("signed-out");
  const [initializing, setInitializing] = useState(true);

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
        setInitializing(false);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setMode("signed-in");
        } else {
          setUser(null);
          setMode("signed-out");
        }
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error(error.message);
    }
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (mode === "signed-in") {
    return (
      <div className="w-full h-full mx-auto mt-10 p-6">
        <Card className="p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-18 h-18 md:w-24 md:h-24 rounded-full object-cover border-2 border-emerald-400"
              />
            ) : (
              <div className="w-18 h-18 md:w-24 md:h-24 rounded-full bg-neutral-900 flex items-center justify-center text-3xl text-white">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="text-sm pr-2">{user?.email}</div>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>

          <div className="w-full mt-6">
            <h2 className="font-bold md:text-xl font-bold mb-2">
              Watch History
            </h2>
          </div>
        </Card>
      </div>
    );
  }

  return <SignIn />;
}
