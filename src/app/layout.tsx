import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Sentiora - Customer Sentiment Analysis Tool",
  description:
    "Sentiora is an advanced customer sentiment analysis tool. Upload reviews in CSV format and get detailed sentiment insights to understand your customers better.",
  keywords: [
    "Sentiment analysis",
    "customer feedback",
    "review analysis",
    "CSV reviews",
    "text analysis",
    "customer sentiment",
    "data insights",
    "AI sentiment tool",
  ],
  authors: [{ name: "Sentiora Team" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sentiora - Customer Sentiment Analysis Tool",
    description:
      "Transform customer reviews into actionable insights with Sentiora. Upload a CSV of reviews and receive sentiment analysis for each review instantly.",
    url: "https://www.sentiora.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.variable} antialiased`}>
        <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
