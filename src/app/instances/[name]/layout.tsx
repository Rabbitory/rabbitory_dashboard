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
