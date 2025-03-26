"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState, ChangeEvent } from "react";
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

  const handleChange = (e: ChangeEvent<HTMLSelectElement>, name: string) => {
    const action = e.target.value;
    if (action !== undefined && action.length > 0) {
      switch (action) {
        case "delete":
          router.push(`/instances/${name}/edit/delete`);
      }
    }
  }

  return (
    <div className="p-6">
      {/* Heading and button on the same line */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-gray-900">Instances</h1>
        <Link href="/instances/newForm">
          <button className="py-2 px-6 bg-green-400 text-white rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500">
            Create New Instance
          </button>
        </Link>
      </div>

      {/* Check if there are instances */}
      {instances.length === 0 ? (
        <p className="text-lg text-gray-600 mb-6">No instances yet.</p>
      ) : (
        <ul className="space-y-4">
          {instances.map((instance) => (
            <li key={instance.name} className="p-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50">
              <Link href={`/instances/${instance.name}`} className="text-xl text-blue-600 hover:underline">
                {instance.name} | {instance.id}
              </Link>
              <select name={instance.id} onChange={(e) => handleChange(e, instance.name)}>
                <option value="">Edit</option>
                <option value="delete">Delete</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
