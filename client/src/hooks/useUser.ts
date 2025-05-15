// src/hooks/useUser.ts
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  username: string;
  // 필요한 필드가 있다면 추가
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading };
}
