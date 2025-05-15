// src/components/LogoutButton.tsx
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/login");
    } catch (err: any) {
      alert("로그아웃 실패: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      로그아웃
    </button>
  );
}
