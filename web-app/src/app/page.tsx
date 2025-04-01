"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/util/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-gray-100 px-4 text-gray-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-100">
          <svg
            className="h-8 w-8 text-purple-600 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v1m0 14v1m8-8h1M4 12H3m15.36 6.36l.707.707M6.343 6.343l.707.707m0 9.9l-.707.707m12.02-12.02l-.707.707"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Redirecting...</h2>
          <p className="text-sm text-gray-500">
            Just a moment while we verify your session.
          </p>
        </div>
      </div>
    </main>
  );
}
