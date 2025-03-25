"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import generateName from "@/utils/randomNameGenerator";
import axios from "axios";

type InstanceTypes = Record<string, string[]>;

export default function NewFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [instanceName, setInstanceName] = useState("");
  const [availableRegions, setAvailableRegions] = useState([]);
  const [instanceTypes, setInstanceTypes] = useState<InstanceTypes>({});
  const [instantiating, setInstantiating] = useState(false);
  const [selectedInstanceType, setSelectedInstanceType] = useState<string>("");
  const [filteredInstanceTypes, setFilteredInstanceTypes] = useState<string[]>([]);

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
    setFilteredInstanceTypes(instanceTypes[selectedInstanceType] ?? []);
  }, [selectedInstanceType, instanceTypes]);

  const handleSubmit = async (formData: FormData) => {
    if (!isValidName(instanceName)) {
      alert("Instance name must be 3-64 characters long with valid characters.");
      setInstantiating(false);
      return;
    }

    if (!isValidStorageSize(Number(formData.get("storageSize")))) {
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

  const handleGenerate = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setInstanceName(generateName());
  };

  const isValidName = (name: string) => /^[a-z0-9-_]{3,64}$/i.test(name);
  const isValidStorageSize = (size: number) => size >= 1 && size <= 10000;

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
              <label htmlFor="instanceName" className="block text-gray-700">
                Instance Name:
              </label>
              <div className="flex gap-2">
                <input
                  id="instanceName"
                  name="instanceName"
                  type="text"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  className={`w-full p-2 border rounded-md ${!isValidName(instanceName) ? 'border-red-500 text-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="region" className="block text-gray-700">
                Region:
              </label>
              <select
                id="region"
                name="region"
                disabled={instantiating}
                className="w-full p-2 border rounded-md"
              >
                {availableRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="instanceType" className="block text-gray-700">
                Instance Type:
              </label>
              <select
                id="instanceType"
                name="instanceType"
                value={selectedInstanceType}
                onChange={(e) => setSelectedInstanceType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select an instance type</option>
                {Object.keys(instanceTypes).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="instanceSize" className="block text-gray-700">
                Instance Size:
              </label>
              <select
                id="instanceSize"
                name="instanceSize"
                disabled={!selectedInstanceType}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select an instance size</option>
                {filteredInstanceTypes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="storageSize" className="block text-gray-700">
                Storage Size (GB):
              </label>
              <input
                id="storageSize"
                name="storageSize"
                type="number"
                defaultValue={8}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-gray-700">
                Username:
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700">
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full p-2 border rounded-md"
              />
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