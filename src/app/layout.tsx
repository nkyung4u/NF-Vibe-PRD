import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "초간단 PRD 양식",
  description: "Lean PRD Template - 노션 데이터베이스 연동",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
