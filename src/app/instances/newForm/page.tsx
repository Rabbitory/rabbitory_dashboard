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
    try {
      await axios.post("/api/instances", {
        instanceName: formData.get("instanceName"),
        region: formData.get("region"),
        instanceType: formData.get("instanceSize"),
        username: formData.get("username"),
        password: formData.get("password"),
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

  return (
    <>
      {loading ? (
        "Loading..."
      ) : (
        <Form
          action={(formData) => {
            setInstantiating(true);
            handleSubmit(formData);
          }}
        >
          <fieldset disabled={instantiating}>
            <label htmlFor="instanceName">Instance Name:</label>
            <input
              id="instanceName"
              name="instanceName"
              type="text"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
            />
            <button type="button" onClick={handleGenerate}>
              Generate Instance Name
            </button>
            <br />
            <label htmlFor="region">Region: </label>
            <select id="region" name="region" disabled={instantiating}>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <br />

            {/* Instance Type Selection */}
            <label htmlFor="instanceType">Instance Type: </label>
            <select
              id="instanceType"
              name="instanceType"
              value={selectedInstanceType}
              onChange={(e) => setSelectedInstanceType(e.target.value)}
            >
              <option value="">Select an instance type</option>
              {Object.keys(instanceTypes).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <br />

            {/* Instance Size Selection */}
            <label htmlFor="instanceSize">Instance Size: </label>
            <select
              id="instanceSize"
              name="instanceSize"
              disabled={!selectedInstanceType}
            >
              <option value="">Select an instance size</option>
              {filteredInstanceTypes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <br />

            <label htmlFor="username">Username: </label>
            <input id="username" name="username" type="text" />
            <br />
            <label htmlFor="password">Password: </label>
            <input id="password" name="password" type="password" />
            <br />
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}

      {instantiating ? <div className="loading">Creating instance...</div> : ""}
    </>
  );
}
