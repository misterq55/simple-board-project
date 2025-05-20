"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CommentSection from "@/components/CommentSection";

export default function PostDetailPage() {
  const { identifier, slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [voteScore, setVoteScore] = useState<number>(0);
  const [userVote, setUserVote] = useState<number>(0);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${identifier}/${slug}`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        console.log("POST : ", data)
        setPost(data);
        setVoteScore(data.voteScore);
        setUserVote(data.userVote);
      })
      .catch((err) => console.error("게시글 불러오기 실패", err));
  }, [identifier, slug]);

  const handleVote = async (value: 1 | -1) => {
    if (!post?.id) return;

    const voteValue = userVote === value ? 0 : value;
    console.log(voteValue)
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/votes`,
        {
          postId: post.id,
          value: voteValue,
        },
        { withCredentials: true }
      );

      setUserVote(res.data.vote === 0 ? 0 : voteValue);
      setVoteScore((prev) => prev + (voteValue - userVote));
    } catch (err) {
      console.error("추천 처리 실패", err);
    }
  };

  if (!post) return <p>로딩 중...</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500">작성자: {post.user.username}</p>

      {/* 본문 */}
      <div className="mt-4 whitespace-pre-wrap">{post.body}</div>

      {/* 추천/비추천 버튼 */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => handleVote(1)}
          className={`px-3 py-1 rounded ${
            userVote === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          👍 추천
        </button>
        <span className="text-lg font-medium">{voteScore}</span>
        <button
          onClick={() => handleVote(-1)}
          className={`px-3 py-1 rounded ${
            userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          👎 비추천
        </button>
      </div>

      {/* 댓글 */}
      {post.id && <CommentSection postId={post.id} />}
    </main>
  );
}
