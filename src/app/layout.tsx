import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mani AI Developer Console | RSMK Technologies",
  description: "Generate API keys, track usage analytics, view audit logs, and query Mani AI services via a secure gateway.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-[#00f0ff] selection:text-black bg-[#030712]">
        {children}
      </body>
    </html>
  );
}
