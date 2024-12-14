import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prototype Counter',
  description: 'State manager for Ironblood prototype',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
