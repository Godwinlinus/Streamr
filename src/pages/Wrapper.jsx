// src/auth/Wrapper.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Spinner } from "../components/ui/spinner"; // optional, replace with your loader

export default function Wrapper({ children }) {
  const [status, setStatus] = useState("loading"); // "loading" | "authed" | "unauth"
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setStatus(data?.session?.user ? "authed" : "unauth");
      } catch (err) {
        console.error("Auth init error:", err);
        if (mounted) setStatus("unauth");
      }
    }

    init();

    // subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setStatus(session?.user ? "authed" : "unauth");
    });

    return () => {
      mounted = false;
      // unsubscribe safely for different supabase client shapes
      try {
        listener?.subscription?.unsubscribe();
      } catch (err) {
        try {
          listener?.unsubscribe?.();
        } catch (err2) {
          // best-effort unsubscribe; ignore
        }
      }
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {Spinner ? <Spinner /> : <div>Loading...</div>}
      </div>
    );
  }

  if (status === "unauth") {
    // send them to sign-in and remember where they tried to go
    console.log("Redirecting to /signin");
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
}
