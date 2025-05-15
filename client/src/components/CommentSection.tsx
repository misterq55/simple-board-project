"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/hooks/useUser";

interface Comment {
    id: number;
    body: string;
    username: string;
    createdAt: string;
    voteScore: number;
    myVote: number; // 1 = 추천함, 0 = 안 함
}


export default function CommentSection({ postId }: { postId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editBody, setEditBody] = useState("");

    const { user } = useUser();

    const fetchComments = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/comments?postId=${postId}`,
                { withCredentials: true }
            );
            setComments(res.data.comments);
        } catch (err) {
            console.error("댓글 불러오기 실패", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!body.trim()) return;

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/comments`,
                { postId, body },
                { withCredentials: true }
            );
            setBody("");
            fetchComments();
        } catch (err: any) {
            alert(
                "댓글 등록 실패: " +
                (err.response?.data?.message || err.message)
            );
        }
    };

    const handleDelete = async (commentId: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
                { withCredentials: true }
            );
            fetchComments();
        } catch (err: any) {
            alert("삭제 실패: " + (err.response?.data?.message || err.message));
        }
    };

    const handleUpdate = async (commentId: number) => {
        if (!editBody.trim()) return;

        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
                { content: editBody },
                { withCredentials: true }
            );
            setEditingId(null);
            fetchComments();
        } catch (err: any) {
            alert("수정 실패: " + (err.response?.data?.message || err.message));
        }
    };

    const handleVote = async (commentId: number, hasVoted: boolean) => {
        try {
            if (hasVoted) {
                // 추천 취소 (value: 0 또는 DELETE 처리도 가능)
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/votes`, {
                    value: 0,
                    commentId,
                }, { withCredentials: true });
            } else {
                // 추천 추가
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/votes`, {
                    value: 1,
                    commentId,
                }, { withCredentials: true });
            }

            fetchComments(); // 갱신
        } catch (err: any) {
            alert("추천 실패: " + (err.response?.data?.message || err.message));
        }
    };


    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <section className="mt-10">
            <h2 className="text-lg font-semibold mb-2">💬 댓글</h2>

            <textarea
                className="w-full p-2 border rounded mb-2"
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="댓글을 입력하세요"
            />

            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                댓글 작성
            </button>

            <div className="mt-6 space-y-4">
                {loading ? (
                    <p className="text-gray-500">불러오는 중...</p>
                ) : comments.length === 0 ? (
                    <p className="text-gray-400">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                ) : (
                    comments.map((comment) => {
                        const isMine = user?.username === comment.username;
                        const isEditing = editingId === comment.id;

                        return (
                            <div key={comment.id} className="border-b pb-2">
                                <div className="text-sm text-gray-600 flex justify-between">
                                    <span>
                                        {comment.username} ·{" "}
                                        {new Date(comment.createdAt).toLocaleString("ko-KR")}
                                    </span>

                                    <div className="flex gap-2 text-xs">
                                        {!isMine && (
                                            <button
                                                onClick={() => handleVote(comment.id, comment.myVote === 1)}
                                                className={`flex items-center gap-1 ${comment.myVote === 1 ? "text-red-500" : "text-gray-400"
                                                    } hover:text-red-600`}
                                            >
                                                ❤️ {comment.voteScore}
                                            </button>
                                        )}

                                        {isMine && !isEditing && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(comment.id);
                                                        setEditBody(comment.body);
                                                    }}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="text-red-500 hover:underline"
                                                >
                                                    삭제
                                                </button>
                                            </>
                                        )}
                                    </div>

                                </div>

                                {isEditing ? (
                                    <>
                                        <textarea
                                            className="w-full border rounded p-2 mt-1"
                                            rows={3}
                                            value={editBody}
                                            onChange={(e) => setEditBody(e.target.value)}
                                        />
                                        <div className="mt-2 flex gap-2 text-sm">
                                            <button
                                                onClick={() => handleUpdate(comment.id)}
                                                className="px-3 py-1 bg-green-500 text-white rounded"
                                            >
                                                저장
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                                            >
                                                취소
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p>{comment.body}</p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}
