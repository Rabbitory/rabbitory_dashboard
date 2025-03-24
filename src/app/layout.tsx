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
      <body>
        <div className="top-header">
          <h1>Rabbitory</h1>
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
