import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shade Ai",
  description: "Built by 9ightshade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          http-equiv="origin-trial"
          content="AnII61vagEjiAiy85VD9XXLRoPvSO9G2nlEXx3AaExnN8K2DO1SNj1sKrzKf/4AvaM7aK6CtcL8zGj3X7JQPXQMAAABneyJvcmlnaW4iOiJodHRwczovL3NoYWRlLWFpLWthcHBhLnZlcmNlbC5hcHA6NDQzIiwiZmVhdHVyZSI6Ikxhbmd1YWdlRGV0ZWN0aW9uQVBJIiwiZXhwaXJ5IjoxNzQ5NTk5OTk5fQ=="
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
