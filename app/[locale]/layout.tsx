import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import "./globals.css";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { TopLoader } from "@/components/ui/top-loader";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default : "VANDAITUI",
    template : "%s | VANDAITUI",
  },
  description: "Your trusted source for quality tech gadgets and repairs.",
  twitter: {
    card: "summary_large_image",
  },
  verification : {
    google : process.env.SEARCH_GOOGLE_CONSOLE
  }
};

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};
 
export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  // Enable static rendering
  setRequestLocale(locale);
 
return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale}>
          <Suspense fallback={null}>
            <TopLoader />
          </Suspense>
          <ToastProvider />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}