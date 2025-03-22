import Link from "next/link";

export default function InstanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="top-header">
          <p className="header">Current Instance Name</p>
          <Link href="/">Home</Link>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}