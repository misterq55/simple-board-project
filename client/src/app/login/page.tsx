// src/app/login/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AuthFormInput from "@/components/AuthFormInput";
import AuthFormButton from "@/components/AuthFormButton";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      router.push("/");
    } catch (err: any) {
      alert("로그인 실패: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">로그인</h1>

      <AuthFormInput
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <AuthFormInput
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <AuthFormButton label="로그인" onClick={handleLogin} color="blue" />
    </main>
  );
}
