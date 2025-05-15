// src/app/register/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AuthFormInput from "@/components/AuthFormInput";
import AuthFormButton from "@/components/AuthFormButton";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
                { username, password, email, nickname },
                { withCredentials: true }
            );

            alert("회원가입 성공!");
            router.push("/login");
        } catch (err: any) {
            alert("회원가입 실패: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <main className="p-6 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">회원가입</h1>

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
            <AuthFormInput 
                placeholder="이메일" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <AuthFormInput 
                placeholder="닉네임" 
                value={nickname} 
                onChange={(e) => 
                setNickname(e.target.value)} />
            <AuthFormButton label="회원가입" onClick={handleRegister} color="green" />
        </main>
    );
}
