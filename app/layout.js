import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "sonner";
import Image from "next/image";

// Import fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for page head
export const metadata = {
  title: "AiCruiter",
  description: "Modern AI Interviewer",
  icons: {
    icon: "/logo2.png",           // ✅ Custom favicon
    shortcut: "/logo2.png",
    apple: "/logo2.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo2.png" type="image/png" />
        <title>AiCruiter</title>
        <meta name="description" content="Modern AI Interviewer" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider>
          {/* Optional header with logo */}
          <header className="p-4">
            <Image src="/logo2.png" alt="AiCruiter Logo" width={40} height={40} />
          </header>

          {children}

          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
