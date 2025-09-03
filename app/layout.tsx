import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/providers";
import Navbar2 from "@/components/navbar/navbar2";
import CustomCursor from "@/components/ui/CustomCursor";
import StairsWrapper from "@/components/stairs/StairsWrapper";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MATLAB & Overleaf Club - VIT Bhopal University",
  description: "Official website of the MATLAB & Overleaf Club at VIT Bhopal University. Access exclusive resources, register for events, generate certificates, and explore interactive learning materials for MATLAB and Overleaf.",
  keywords: ["MATLAB", "Overleaf", "VIT Bhopal", "Club", "Technical Club", "Student Club", "Certificate Generation", "Event Registration", "Research", "Signal Processing", "AI", "Robotics"],
  authors: [{ name: "Linpack Club" }],
  creator: "Linpack Club",
  publisher: "Linpack Club",
  openGraph: {
    title: "MATLAB & Overleaf Club - VIT Bhopal University",
    description: "Official website of the MATLAB & Overleaf Club at VIT Bhopal University. Access exclusive resources, register for events, generate certificates, and explore interactive learning materials.",
    url: "https://linpack-club.vercel.app", // Update with your actual domain
    siteName: "MATLAB & Overleaf Club",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "MATLAB & Overleaf Club - VIT Bhopal University"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MATLAB & Overleaf Club - VIT Bhopal University",
    description: "Official website of the MATLAB & Overleaf Club at VIT Bhopal University. Access exclusive resources, register for events, and explore interactive learning materials.",
    images: ["/preview.png"],
    creator: "@LinpackClub"
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>
          <CustomCursor />
          <div className="relative z-[9997]">
            <Navbar2 />
          </div>
          <Suspense fallback={<div>{children}</div>}>
            <StairsWrapper>
              {children}
            </StairsWrapper>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}