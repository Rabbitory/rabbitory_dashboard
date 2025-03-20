"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { _InstanceType } from "@aws-sdk/client-ec2";
import generateName from "@/utils/randomNameGenerator";
import axios from "axios";

const instanceTypes = ['t2.micro', 't2.small', 't2.medium'];

export default function NewFormPage() {
  const [instantiating, setInstantiating] = useState(false);
  const [instanceName, setInstanceName] = useState<string>("");
  const [region, setRegion] = useState<string>("us-east-1");
  const [availableRegions, setAvailableRegions] = useState([]);
  const [instanceType, setInstanceType] = useState<string>("t2.micro");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  //instance name is currently generated in the backend, can be moved to the frontend

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data } = await axios.get('/api/regions');
        setAvailableRegions(data.regions);
      } catch (error) {
          console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
   }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInstantiating(true);
    try {
      await axios.post("/api/instances", {
        region,
        instanceName,
        instanceType,
        username,
        password,
      });
      router.replace("/");
    } catch (error) {
      console.error("Error creating instance:", error);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setInstanceName(generateName());
  }

  return (
    <div>
      <h1>Create New Instance</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="region">Region: </label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            disabled={instantiating}
          >
            {availableRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="instanceName">InstanceName:</label>
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
        </div>
        <div>
          <label htmlFor="instanceType">InstanceType: </label>
          <select
              id="instanceType"
              name="instanceType"
              onChange={(e) => setInstanceType(e.target.value)}
          >
            {instanceTypes.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={instantiating}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={instantiating}
          />
        </div>
        <button type="submit" disabled={instantiating}>
          Submit
        </button>
      </form>
      {instantiating ? <p>Creating instance...</p> : <p></p>}
    </div>
  );
}
