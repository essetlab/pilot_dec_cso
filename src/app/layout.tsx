import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSO Learning Hub",
  description: "DEC / WHH CSF+ CSO Learning Hub for practical digital learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
