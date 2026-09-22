import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PopRate - Rate What You See',
  description: 'Discover, rate, and connect through visual social experiences.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-surface-950 text-white">
        {children}
      </body>
    </html>
  );
}
