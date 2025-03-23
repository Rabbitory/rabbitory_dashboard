import '@/app/global.css';
import Link from 'next/link';

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ instanceName: string }>;
}


export default async function RootLayout({ children, params }: Readonly<RootLayoutProps>) {
  const {instanceName} = await params;
  console.log("Current Instance:", instanceName);

  return (
    <html lang="en">
      <body>
        <div className="top-header">
          <h1>Rabbitory</h1>
          <p>Current Instance Name: {instanceName}</p>
          <Link href="/">Home</Link>
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
