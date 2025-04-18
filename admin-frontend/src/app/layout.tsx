import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { ModalProvider } from "@/providers/modal-provider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <ModalProvider />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
