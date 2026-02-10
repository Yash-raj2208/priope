import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/footer'; // ✅ ADD THIS IMPORT

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Priope - Daily Financial Awareness for Students',
  description: 'Help students manage finances through daily spending awareness',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Main Content Area */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer Component - ADDED HERE */}
        <Footer />
      </body>
    </html>
  );
}