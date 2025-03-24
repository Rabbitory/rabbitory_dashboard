"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Instance {
  name: string;
  id: string;
}

export default function Home() {
  const router = useRouter();
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
          <li key={instance.name}>
            <Link href={`/instances/${instance.name}`}>
              {instance.name} | {instance.id}
            </Link>
            <select name={instance.id}>
              <option value="">Edit</option>
              <option value="delete" onClick={() => router.push(`/instances/${instance.name}/edit/delete`)}>Delete</option>
            </select>
          </li>
        ))}
      </ul>
      <Link href="/instances/newForm">
        <button>new instance</button>
      </Link>
    </div>
  );
}
