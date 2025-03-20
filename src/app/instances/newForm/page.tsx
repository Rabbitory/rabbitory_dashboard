"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "next/form";
import axios from "axios";

export default function NewFormPage() {
  const router = useRouter();
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
  // Todo: fetch regions and instance type from server side because using sdk in client side is not recommended
  // useEffect(() => {}, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      await axios.post("/api/instances", {
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

  return (
    <>
      <Form
        action={(formData) => {
          setInstantiating(true);
          handleSubmit(formData);
        }}
      >
        <fieldset disabled={instantiating}>
          <label htmlFor="region">Region: </label>
          <select id="region" name="region" disabled={instantiating}>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <label htmlFor="instanceType">InstanceType: </label>
          <input
            id="instanceType"
            name="instanceType"
            defaultValue={"t2.micro"}
            type="text"
          />
          <label htmlFor="username">Username: </label>
          <input id="username" name="username" type="text" />
          <label htmlFor="password">Password: </label>
          <input id="password" name="password" type="password" />
          <button type="submit">Submit</button>
        </fieldset>
      </Form>
      {instantiating ? <div className="loading">Creating instance...</div> : ""}
    </>
  );
}
