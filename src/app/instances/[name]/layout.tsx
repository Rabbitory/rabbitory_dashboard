import NavLayout from "@/app/components/NavLayout";
import styles from "./InstanceLayout.module.css";

interface Params {
  name: string;
}
interface InstanceLayoutProps {
  children: React.ReactNode;
  params: Promise<Params>;
}

export default async function InstanceLayout({
  children,
  params,
}: InstanceLayoutProps) {
  const { name } = await params;
  return (
    <>
      <div className={styles.container}>
        <NavLayout name={name} />
        <section className={styles.section}>{children}</section>
      </div>
    </>
  );
}
import Link from 'next/link';
import React from 'react';

interface InstanceLayoutProps {
  children: React.ReactNode;
  params: { name: string };
}

export default async function InstanceLayout({ children, params }: Readonly<InstanceLayoutProps>) {
  const { name } = await params;
  
  return (
    <>
      <div className="top-header">
        {/* <h1>Rabbitory</h1> */}
        <p>{name}</p>
        <Link href="/">All Instances</Link>
      </div>
      {children}
    </>
  );
}
