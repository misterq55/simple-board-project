// src/components/AuthFormButton.tsx
"use client";

import React from "react";

type AuthFormButtonProps = {
  label: string;
  onClick: () => void;
  color?: "blue" | "green";
};

export default function AuthFormButton({
  label,
  onClick,
  color = "blue",
}: AuthFormButtonProps) {
  const bg = color === "green" ? "bg-green-600" : "bg-blue-600";

  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-4 py-2 rounded w-full`}
    >
      {label}
    </button>
  );
}
