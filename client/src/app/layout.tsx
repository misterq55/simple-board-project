// src/app/layout.tsx
import HeaderWrapper from "@/components/HeaderWrapper";
import "./globals.css";

export const metadata = {
  title: "SimpleBoard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <HeaderWrapper />
        {children}
      </body>
    </html>
  );
}
