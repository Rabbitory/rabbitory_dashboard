import '@/app/global.css';
import React from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
  params: { name: string };
}


export default function RootLayout({ children, params }: Readonly<RootLayoutProps>) {
  console.log("Current Instance:", params.name);

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-100 text-gray-900 font-plex">
        <div className="top-header bg-orange-300 text-white">
          <h1 className="text-3xl font-semibold p-4">Rabbitory</h1>
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
