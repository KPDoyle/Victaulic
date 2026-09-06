import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Victaulic Customer & BIM Workspace | Headroom GrowthOS",
  description: "A connected-construction platform for turning project intelligence, customer relationships and BIM engagement into specification and delivery opportunities.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
