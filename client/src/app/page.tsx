// src/app/page.tsx
import { Post } from "@/lib/types";
import Link from "next/link";

type ResponseData = {
  posts: Post[];
  totalPages: number;
  page: number;
};

type Props = {
  searchParams: { page?: string };
};

export default async function HomePage({searchParams} : Props) {
  const page = Number(searchParams.page) || 1;
  const res = await fetch(`http://localhost:4000/api/posts?page=${page}&limit=10`, {
    cache: "no-store",
  });

  const data: ResponseData = await res.json();

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 게시글 목록</h1>
        <Link
          href="/posts/write"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
        >
          글쓰기
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border-b">번호</th>
              <th className="py-2 px-4 border-b">제목</th>
              <th className="py-2 px-4 border-b">작성자</th>
              <th className="py-2 px-4 border-b">작성일</th>
            </tr>
          </thead>
          <tbody>
            {data.posts.map((post, index) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{index + 1 + (page - 1) * 10}</td>
                <td className="py-2 px-4 border-b">
                  <Link
                    href={`/posts/${post.identifier}/${post.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">{post.username}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/?page=${p}`}
            className={`px-3 py-1 rounded border ${
              p === data.page
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 hover:bg-gray-100"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>
    </main>
  );
}
