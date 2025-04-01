"use client";

import { supabase } from "@/util/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      console.log(data);

      if (data?.user) {
        setUserName(
          data.user.user_metadata?.full_name || data.user.email || "User"
        );
        setUser(data.user);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="flex items-center h-20 px-6 sm:px-10 bg-white shadow">
      <div className="relative w-full max-w-md sm:-ml-2">
        <h1 className="text-xl font-bold">File Processor</h1>
      </div>

      <div className="flex items-center ml-auto space-x-4">
        {/* Avatar */}
        <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden">
          {user?.user_metadata?.avatar_url ? (
            <Image
              width={40}
              height={40}
              src={user.user_metadata?.avatar_url}
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              className="h-full w-full text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16A8 8 0 0112 4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* User name */}
        <span className="text-gray-800 font-medium">{userName}</span>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          title="Logout"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
