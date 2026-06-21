import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arrow Calendar",
  description: "Personal scheduling application with linear calendar views",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-terminal-bg font-sans text-terminal-text antialiased">
        {children}
      </body>
    </html>
  );
}
