"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { _InstanceType } from "@aws-sdk/client-ec2";
import generateName from "@/utils/randomNameGenerator";
import axios from "axios";

const instanceTypes = ["t2.micro", "t2.small", "t2.medium"];

export default function NewFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [instanceName, setInstanceName] = useState("");
  const [availableRegions, setAvailableRegions] = useState([]);
  const [instantiating, setInstantiating] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/regions");
        setAvailableRegions(data.regions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

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
            </button>
            <label htmlFor="region">Region: </label>
            <select id="region" name="region" disabled={instantiating}>
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <label htmlFor="instanceType">Instance Hardware: </label>
            <select id="instanceType" name="instanceType">
              {instanceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label htmlFor="username">Username: </label>
            <input id="username" name="username" type="text" />
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
