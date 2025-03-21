"use client";

import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { _InstanceType } from "@aws-sdk/client-ec2";
import formatDate from "@/utils/formatDate";
import Link from "next/link";
interface Params {
  name: string;
}
interface InstancePageProps {
  params: Promise<Params>;
}

interface Instance {
  name: string;
  id: string;
  type: _InstanceType;
  publicDns: string;
  launchTime: string;
  region: string;
  port: number;
  user: string;
  password: string;
  endpointUrl: string;
  state: string;
}

export default function InstancePage({ params }: InstancePageProps) {
  const { name } = React.use(params);
  const [instance, setInstance] = useState<Instance | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const fetchInstance = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`/api/instances/${name}`);
        console.log(response.data);
        setInstance(response.data);
      } catch (error) {
        console.error("Error fetching instance:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchInstance();
  }, [name]);

  return (
    <>
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        <>
          <section>
            <h2>{instance?.name}</h2>
            <ul>
              <li>
                <strong>Status:</strong> {instance?.state}
              </li>
              <li>
                <strong>Host:</strong> {instance?.publicDns}
              </li>
              <li>
                <strong>Launch Time:</strong>{" "}
                {instance?.launchTime && formatDate(instance?.launchTime)}
              </li>
              <li>
                <strong>Region:</strong> {instance?.region}
              </li>
              <li>
                <strong>Port:</strong> {instance?.port}
              </li>
              <li>
                <strong>User:</strong> {instance?.user}
              </li>
              <li>
                <strong>Password:</strong> {instance?.password}
              </li>
              <li>
                <strong>Endpoint URL:</strong> {instance?.endpointUrl}
              </li>
              <Link href="/">
                <button>Go Back</button>
              </Link>
              <button
                onClick={() =>
                  window.open(`http://${instance?.publicDns}:15672`)
                }
              >
                To RabbitMQ Manager
              </button>
            </ul>
          </section>
        </>
      )}
    </>
  );
}
