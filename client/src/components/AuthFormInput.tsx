// src/components/AuthFormInput.tsx
"use client";

import React from "react";

type AuthFormInputProps = {
  type?: "text" | "password";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

export default function AuthFormInput({
  type = "text",
  value,
  onChange,
  placeholder,
}: AuthFormInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border p-2 w-full mb-3"
    />
  );
}
