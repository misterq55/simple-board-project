"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "@/components/LogoutButton";

export default function MyPostsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/mypage/posts`, {
          withCredentials: true,
        })
        .then((res) => setPosts(res.data.posts));
    }
  }, [user]);

  if (loading) return <p>로딩 중...</p>;
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{user.username}님의 글 목록</h1>
        <LogoutButton />
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">작성한 글이 없습니다.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="mb-2 border-b pb-2">
              <strong>{post.title}</strong>
              <div className="text-sm text-gray-500">{post.createdAt}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
