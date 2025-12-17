import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cardiology Edge Engage",
  description: "Edge Engage Execution Method - Cardiology at Gundersen Health System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
