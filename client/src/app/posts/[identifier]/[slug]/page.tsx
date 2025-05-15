// src/app/posts/[identifier]/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CommentSection from "@/components/CommentSection";

export default function PostDetailPage() {
  const { identifier, slug } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${identifier}/${slug}`, {
        withCredentials: true,
      })
      .then((res) => setPost(res.data))
      .catch((err) => console.error("게시글 불러오기 실패", err));
  }, [identifier, slug]);

  if (!post) return <p>로딩 중...</p>;
  console.log(post)

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500">작성자: {post.user.username}</p>
      <div className="mt-4 whitespace-pre-wrap">{post.body}</div>
      {post.id && <CommentSection postId={post.id} />}
    </main>
  );
}
