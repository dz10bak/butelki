import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import ToastProvider from "@/components/ToastProvider";
import LocaleProvider from "@/components/LocaleProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
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
  title: "BottleCollect",
  description: "Collect deposit bottles and cans. Recycle and earn money with BottleCollect.",
  openGraph: {
    title: "BottleCollect",
    description: "Recycle bottles & cans, earn money. The easiest way to collect deposit bottles.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "BottleCollect",
    description: "Recycle bottles & cans, earn money.",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
        <ErrorBoundary>
          <ThemeProvider>
            <LocaleProvider>
              <ToastProvider>
                <div className="w-full max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
                  {children}
                </div>
              </ToastProvider>
            </LocaleProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
