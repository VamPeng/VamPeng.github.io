import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme/light.css";
import "./theme/dark.css";
import "./theme/light-mc.css";
import "./theme/dark-mc.css";
import "./theme/light-hc.css";
import "./theme/dark-hc.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "我的博客",
  description: "使用 Next.js 和 Material Design 构建的现代化博客",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className="light">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${inter.className} light`}>{children}</body>
    </html>
  );
}
