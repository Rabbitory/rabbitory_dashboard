import Link from 'next/link';
import styles from '../page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>About This Demo</h1>
        <p>This is a simple Next.js demo application for Rabbitory Dashboard.</p>
        <p>It demonstrates:</p>
        <ul style={{ marginBottom: '20px' }}>
          <li>Multiple pages with navigation</li>
          <li>Client-side state management</li>
          <li>Server-side API routes</li>
          <li>Basic styling with CSS modules</li>
        </ul>
        
        <Link href="/" className={styles.secondary}>
          Back to Home
        </Link>
      </main>
    </div>
  );
}