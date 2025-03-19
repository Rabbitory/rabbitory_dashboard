"use client";

import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

interface Params {
  name: string;
}
interface InstancePageProps {
  params: Promise<Params>;
}

export default function InstancePage({ params }: InstancePageProps) {
  const { name } = React.use(params);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    const fetchInstance = async () => {
      try {
        const response = await axios.get(`/api/instances/${name}`);
        console.log(response.data);
        setInstance(response.data);
      } catch (error) {
        console.error("Error fetching instance:", error);
      }
    };

    fetchInstance();
  }, [name]);

  return (
    <>
      <div>Instance Page {name}</div>
      <div>Instance Details: {JSON.stringify(instance)}</div>
    </>
  );
}
