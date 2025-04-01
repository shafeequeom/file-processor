"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/util/supabase/client";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) router.push("/dashboard");
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      console.log("Login successful", data);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    }
  };

  const handleOAuth = async (provider: "github") => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) toast.error(error.message);
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to your dashboard</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer"
          >
            Sign in with Email
          </button>
        </div>

        <div className="text-center text-sm text-gray-400">
          or continue with
        </div>

        <button
          onClick={() => handleOAuth("github")}
          className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
        >
          Continue with GitHub
        </button>

        <p className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Signup
          </a>
        </p>
      </div>
    </main>
  );
}
