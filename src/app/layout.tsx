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
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="bg-[#F4F4F5] text-[#191F28] antialiased">
        {children}
      </body>
    </html>
  );
}
