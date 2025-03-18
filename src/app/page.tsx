"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

interface Instance {
  name: string;
  id: string;
}

export default function Home() {
  const [instances, setInstances] = useState<Instance[]>([]);

  useEffect(() => {
    const fetchInstances = async () => {
      const fetchedInstances = await axios.get("/api/instances");
      setInstances(fetchedInstances.data);
    };

    fetchInstances();
  }, []);

  return (
    <div>
      <h1>Instances</h1>
      <ul>
        {instances.map((instance) => (
          <li key={instance.id}>
            <Link href={`/instances/${instance.name}`}>
              {instance.name} | {instance.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
