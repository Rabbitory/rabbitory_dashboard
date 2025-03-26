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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-gray-900 mt-15 mb-15">Instances</h1>
        <Link href="/instances/newForm">
          <button className="py-4 px-8 bg-green-400 text-white text-2xl rounded-full hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500">
            + Create New Instance
          </button>
        </Link>
      </div>

      {instances.length === 0 ? (
        <p className="text-lg text-gray-600 mb-6">No instances yet.</p>
      ) : (
        <ul className="space-y-4">
          {instances.map((instance) => (
            <li
              key={instance.name}
              className="p-7 border rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
              <Link
                href={`/instances/${instance.name}`}
                className="text-xl text-blue-600 hover:underline"
              >
                {instance.name} | {instance.id}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
