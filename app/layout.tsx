import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ExamProvider } from "@/components/providers/exam-context";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExaMetrics - Examination Analytics Platform",
  description: "Comprehensive examination results analysis and management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ExamProvider>
              {children}
              <Toaster position="top-right" richColors />
            </ExamProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
