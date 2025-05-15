// src/components/TextAreaInput.tsx
"use client";

import React from "react";

type TextAreaInputProps = {
    className: string,
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
};

export default function TextAreaInput({
    className,
    value,
    onChange,
    placeholder = "",
    rows = 6,
}: TextAreaInputProps) {
    return (
        <textarea
            className={className}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
        />
    );
}
