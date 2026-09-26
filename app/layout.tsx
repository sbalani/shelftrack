import type { Metadata, Viewport } from "next";
import "@neondatabase/auth-ui/css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ShelfTrack", template: "%s | ShelfTrack" },
  description: "Field shelf intelligence for distributed retail teams.",
  applicationName: "ShelfTrack",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "ShelfTrack", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10231f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
