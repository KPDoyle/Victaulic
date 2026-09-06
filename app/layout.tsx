import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Victaulic Growth Workspace | Headroom GrowthOS",
  description: "An executive growth intelligence workspace for identifying, qualifying and converting strategic market opportunities.",
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
