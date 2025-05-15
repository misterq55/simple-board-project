// src/components/HeaderWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const noHeaderRoutes = ["/login", "/register"];
  const shouldHideHeader = noHeaderRoutes.includes(pathname);

  return shouldHideHeader ? null : <Header />;
}
