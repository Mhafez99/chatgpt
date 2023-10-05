import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { CrispProvider } from '@/components/crisp-provider';

import ModelProvider from '@/components/model-provider';
import ToasterProvider from '@/components/toaster-provider';
import { MessageProvider } from './(dashboard)/(routes)/conversation/MessageContext';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hafez',
  description: 'AI Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MessageProvider>
      <ClerkProvider>
        <html lang='en'>
          <CrispProvider />
          <body className={inter.className}>
            <ModelProvider />
            <ToasterProvider />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </MessageProvider>
  );
}
