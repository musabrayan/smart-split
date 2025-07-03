import { Plus_Jakarta_Sans, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ConvexClientProvider } from "@/components/convex_client_provider";
import { ClerkProvider } from '@clerk/nextjs'

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart-Split",
  description: "The simple, smart way to share expenses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/assets/favicon.png" />
      </head>
      <body
        className={`${plusJakarta.variable} ${sourceSerif.variable} ${jetBrainsMono.variable} antialiased dark`}
      >
        <ClerkProvider>
        <ConvexClientProvider>
        <Header/>
        <main>
          {children}
        </main>
        </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
