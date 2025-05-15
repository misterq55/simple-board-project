// src/components/Header.tsx
"use client";

import { useUser } from "@/hooks/useUser";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const { user, loading } = useUser();

  return (
    <header className="bg-gray-100 p-4 mb-6">
      <div className="flex justify-between max-w-4xl mx-auto">
        <span className="font-bold">SimpleBoard</span>
        {loading ? (
          <span>로딩 중...</span>
        ) : user ? (
          <div className="flex gap-2 items-center">
            <span className="text-sm">{user.username}</span>
            <LogoutButton />
          </div>
        ) : (
          <a href="/login" className="text-blue-500 hover:underline">
            로그인
          </a>
        )}
      </div>
    </header>
  );
}
