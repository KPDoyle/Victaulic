import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Victaulic Growth Workspace | Headroom GrowthOS",
  description: "A Headroom GrowthOS workspace for identifying, qualifying and converting market expansion opportunities.",
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
