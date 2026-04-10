import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Suspense } from "react";
import ReduxProvider from "@/redux/Provider";
import Loading from "@/components/Others/Loader/Loading";

export const metadata: Metadata = {
  title: "GO GAARI - Car Rental Platform in Bangladesh",
  description: "Rent self-drive and chauffeur-driven cars across Bangladesh. Book sedans, SUVs, and premium cars in Dhaka, Chittagong, Sylhet, and Cox's Bazar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Suspense fallback={<Loading />}>
          <ReduxProvider>
            {children}
            <Toaster richColors position="top-right" />
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
