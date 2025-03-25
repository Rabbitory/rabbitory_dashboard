import '@/app/global.css';
import Link from 'next/link';
import React from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}


export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-100 text-gray-900 font-plex">
        <div className="top-header flex justify-between items-center bg-orange-300 text-white p-4">
          <h1 className="text-3xl font-semibold">
          <Link href="/" className="text-lg text-white hover:underline">Rabbitory</Link>
          </h1>
          
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
