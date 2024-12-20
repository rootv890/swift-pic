import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Swift Pic",
  description:
    "One stop to convert SVG to PNG, JPG, WEBP. Resize or Rescale or compress. Rounded Corners you name it!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${geistMono.variable} font-mono  bg-[#0a0a0a] text-foreground  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
