import '@/app/global.css';
import Link from 'next/link';

export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="top-header">
          <h1>Rabbitory</h1>
          <p >Current Instance Name</p>
          <Link href="/">Home</Link>
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
