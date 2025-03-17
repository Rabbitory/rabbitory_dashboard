import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Rabbitory Dashboard Demo</h1>
        <p>Welcome to this simple Next.js demo application</p>
        
        <div className={styles.ctas}>
          <Link href="/counter" className={styles.primary}>
            Counter Demo
          </Link>
          <Link href="/about" className={styles.secondary}>
            About
          </Link>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <p>Built with Next.js</p>
      </footer>
    </div>
  );
}
