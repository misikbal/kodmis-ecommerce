import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { AlertProvider } from "@/components/ui/alert";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kodmis E-commerce",
  description: "Türkiye'nin en güvenilir e-ticaret platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            <AlertProvider position="top-right" maxAlerts={5}>
              {children}
            </AlertProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
