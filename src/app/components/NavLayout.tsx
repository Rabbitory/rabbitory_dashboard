import Link from "next/link";
import styles from "./NavLayout.module.css"; // Optional CSS module

interface NavLayoutProps {
  name: string;
}

export default function NavLayout({ name }: NavLayoutProps) {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link href={`instances/${name}`}>Page 1</Link>
        </li>
        <li>
          <Link href={`instances/${name}`}>Page 2</Link>
        </li>
        <li>
          <Link href={`instances/${name}`}>Page 3</Link>
        </li>
      </ul>
    </nav>
  );
}
