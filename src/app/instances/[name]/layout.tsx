import React from 'react';
import NavLayout from "@/app/components/NavLayout";

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (NavLayout) */}
      <NavLayout name={name} />

      {/* Main content section */}
      <section className="flex-1 max-w-7xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
        {children}
      </section>
    </div>
  );
}