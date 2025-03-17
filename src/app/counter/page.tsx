'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

export default function CounterPage() {
  const [count, setCount] = useState(0);
  const [serverCount, setServerCount] = useState(0);

  // Simulate a server action with a delay
  const incrementServerCount = async () => {
    // Simulate server processing time
    const response = await fetch('/api/counter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count: serverCount }),
    });
    
    if (response.ok) {
      const data = await response.json();
      setServerCount(data.newCount);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Counter Demo</h1>
        
        <div>
          <h2>Client-side Counter</h2>
          <p>Count: {count}</p>
          <button 
            onClick={() => setCount(count + 1)}
            className={styles.primary}
            style={{ marginBottom: '20px' }}
          >
            Increment
          </button>
        </div>
        
        <div>
          <h2>Server-side Counter</h2>
          <p>Count: {serverCount}</p>
          <button 
            onClick={incrementServerCount}
            className={styles.primary}
            style={{ marginBottom: '20px' }}
          >
            Increment via Server
          </button>
        </div>
        
        <Link href="/" className={styles.secondary}>
          Back to Home
        </Link>
      </main>
    </div>
  );
}