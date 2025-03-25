"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import generateName from "@/utils/randomNameGenerator";
import axios from "axios";

export default function NewFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [instanceName, setInstanceName] = useState<string>("");
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [instanceTypes, setInstanceTypes] = useState<Record<string, string[]>>(
    {},
  );
  const [instantiating, setInstantiating] = useState<boolean>(false);
  const [selectedInstanceType, setSelectedInstanceType] = useState<string>("");
  const [filteredInstanceTypes, setFilteredInstanceTypes] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/regions");
        setAvailableRegions(data.regions);
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchInstanceTypes = async () => {
      try {
        const { data } = await axios.get("/api/instanceTypes");
        setInstanceTypes(data.instanceTypes);
      } catch (error) {
        console.log("Error fetching instance types:", error);
      }
    };

    fetchRegions();
    fetchInstanceTypes();
  }, []);

  useEffect(() => {
    setFilteredInstanceTypes((prev) => {
      const newFilteredTypes = instanceTypes[selectedInstanceType] ?? [];
      return prev !== newFilteredTypes ? newFilteredTypes : prev; // Prevent unnecessary updates
    });
  }, [selectedInstanceType, instanceTypes]); // Keep instanceTypes but avoid unnecessary re-renders

  const handleSubmit = async (formData: FormData) => {
    if (!isValidName(instanceName)) {
      alert(
        "Instance name must be 3-64 characters long.\nSupports alphanumeric characters, - and _",
      );
      setInstantiating(false);
      return;
    }

    if (
      formData.get("storageSize") === null ||
      !isValidStorageSize(Number(formData.get("storageSize")))
    ) {
      alert("Storage size must be between 1 & 10000.");
      setInstantiating(false);
      return;
    }

    try {
      await axios.post("/api/instances", {
        instanceName: formData.get("instanceName"),
        region: formData.get("region"),
        instanceType: formData.get("instanceSize"),
        username: formData.get("username"),
        password: formData.get("password"),
        storageSize: formData.get("storageSize"),
      });
      router.push("/");
    } catch (error) {
      setInstantiating(false);
      console.error("Error creating instance:", error);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setInstanceName(generateName());
  };

  const isValidName = (name: string) => {
    const regex = /^[a-z0-9-_]+$/gi;
    return regex.test(name) && name.length <= 64 && name.length >= 3;
  };

  const isValidStorageSize = (size: number) => {
    return size >= 1 && size <= 10000;
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Create Instance</h1>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <Form
          action={(formData) => {
            setInstantiating(true);
            handleSubmit(formData);
          }}
          className="space-y-4"
        >
          <fieldset disabled={instantiating} className="space-y-4">
            <div>
              <label className="block text-gray-700">Instance Name:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="instanceName"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Generate random name
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700">Region:</label>
              <select name="region" className="w-full p-2 border rounded-md">
                {availableRegions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Instance Type:</label>
              <select
                name="instanceType"
                value={selectedInstanceType}
                onChange={(e) => setSelectedInstanceType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select an instance type</option>
                {Object.keys(instanceTypes).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Storage Size (GB):</label>
              <input
                type="number"
                name="storageSize"
                defaultValue={8}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700">Username:</label>
              <input type="text" name="username" className="w-full p-2 border rounded-md" />
            </div>

            <div>
              <label className="block text-gray-700">Password:</label>
              <input type="password" name="password" className="w-full p-2 border rounded-md" />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-400 text-white rounded-md hover:bg-green-300 focus:ring-2 focus:ring-green-500"
            >
              Submit
            </button>
          </fieldset>
        </Form>
      )}
      {instantiating && <p className="text-green-500 mt-4">Creating instance...</p>}
    </div>
  );
}
