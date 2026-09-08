import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Geomatrix — Land Acquisition AI", description: "Smart India Hackathon 2026 prototype" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
