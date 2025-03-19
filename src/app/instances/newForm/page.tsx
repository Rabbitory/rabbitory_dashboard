"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { _InstanceType } from "@aws-sdk/client-ec2";
import axios from "axios";

export default function NewFormPage() {
  const [instantiating, setInstantiating] = useState(false);
  const [regions] = useState<string[]>([
    "us-east-1", // US East (N. Virginia)
    "us-east-2", // US East (Ohio)
    "us-west-1", // US West (N. California)
    "us-west-2", // US West (Oregon)
    "ca-central-1", // Canada (Central)
    "ca-west-1", // Canada West (Calgary)
    "us-gov-west-1", // AWS GovCloud (US-West)
    "us-gov-east-1", // AWS GovCloud (US-East)
    "mx-central-1", // Mexico (Central)
  ]);
  const [region, setRegion] = useState<string>("us-east-1");
  const [instanceType, setInstanceType] = useState<_InstanceType>("t2.micro");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  //instance name is currently generated in the backend, can be moved to the frontend

  //todo: fetch regions and instance type from server side because using sdk in client side is not recommended
  useEffect(() => {}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInstantiating(true);
    try {
      await axios.post("/api/instances", {
        region,
        instanceType,
        username,
        password,
      });
      router.replace("/");
    } catch (error) {
      console.error("Error creating instance:", error);
    }
  };

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
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="instanceType">InstanceType: </label>
          <input
            id="instanceType"
            name="instanceType"
            type="text"
            value={instanceType}
            onChange={(e) => setInstanceType(e.target.value as _InstanceType)}
            disabled={instantiating}
          />
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
