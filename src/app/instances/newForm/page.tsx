"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { _InstanceType } from "@aws-sdk/client-ec2";
import generateName from "@/utils/randomNameGenerator";
import axios from "axios";

// const instanceOptions: Record<string, string[]> = {
//   m8g: ["m8g.medium", "m8g.large", "m8g.xlarge"],
//   c7gn: ["c7gn.medium", "c7gn.large", "c7gn.xlarge"],
//   t2: ["t2.micro", "t2.small", "t2.medium"], // Keep your default ones
// };

export default function NewFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [instanceName, setInstanceName] = useState<string>("");
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [instanceTypes, setInstanceTypes] = useState<Record<string, string[]>>({});
  const [instantiating, setInstantiating] = useState<boolean>(false);
  const [selectedMajorType, setSelectedMajorType] = useState<string>("");
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
        console.log("Fetching instance types");
        const { data } = await axios.get("/api/instanceTypes");
        setInstanceTypes(data.instanceTypes);
      } catch (error) {
        console.log("Error fetching instance types:", error);
      }
    }

    fetchRegions();
    fetchInstanceTypes();
  }, []);

  useEffect(() => {
    setFilteredInstanceTypes((prev) => {
      const newFilteredTypes = instanceTypes[selectedMajorType] ?? [];
      return prev !== newFilteredTypes ? newFilteredTypes : prev; // Prevent unnecessary updates
    });
  }, [selectedMajorType, instanceTypes]); // Keep instanceTypes but avoid unnecessary re-renders
  
  

  const handleSubmit = async (formData: FormData) => {
    try {
      await axios.post("/api/instances", {
        instanceName: formData.get("instanceName"),
        region: formData.get("region"),
        instanceType: formData.get("instanceType"),
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
            </button><br></br>
            <label htmlFor="region">Region: </label>
            <select id="region" name="region" disabled={instantiating}>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select><br></br>

            {/* Major Type Selection */}
            <label htmlFor="majorType">Instance Major Type: </label>
            <select
              id="majorType"
              name="majorType"
              value={selectedMajorType}
              onChange={(e) => setSelectedMajorType(e.target.value)}
            >
              <option value="">Select a major type</option>
              {Object.keys(instanceTypes).map((majorType) => (
                <option key={majorType} value={majorType}>
                  {majorType}
                </option>
              ))}
            </select>
            <br />

            {/* Subtype Selection */}
            <label htmlFor="instanceType">Instance Type: </label>
            <select id="instanceType" name="instanceType" disabled={!selectedMajorType}>
              <option value="">Select a subtype</option>
              {filteredInstanceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <br />

            <label htmlFor="username">Username: </label>
            <input id="username" name="username" type="text" /><br></br>
            <label htmlFor="password">Password: </label>
            <input id="password" name="password" type="password" />
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}

      {instantiating ? <div className="loading">Creating instance...</div> : ""}
    </>
  );
}
