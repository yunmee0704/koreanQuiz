import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Korean Number Trainer",
  description: "Practice Native Korean and Sino-Korean numbers with adaptive quizzes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
