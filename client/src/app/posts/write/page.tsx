// src/app/posts/write/page.tsx
"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TextAreaInput from "@/components/TextAreaInput";
import axios from "axios";

export default function WritePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user]);

  const handleSubmit = async () => {
    if (!title || !body) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts`,
        { title, body },
        { withCredentials: true }
      );
      router.push(`/posts/${res.data.identifier}/${res.data.slug}`);
    } catch (err: any) {
      alert("글 작성 실패: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (!user) return null;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">글쓰기</h1>
      <TextAreaInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="border w-full p-2 mb-4"
      />
      <TextAreaInput
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="내용을 입력하세요"
        className="border w-full p-2 h-60 mb-4 resize-none"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        작성 완료
      </button>
    </main>
  );
}
