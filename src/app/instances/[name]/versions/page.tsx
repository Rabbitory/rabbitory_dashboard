"use client";
import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { _InstanceType } from "@aws-sdk/client-ec2";
import styles from "./VersionsPage.module.css";

interface Params {
  name: string;
}
interface VersionsPageProps {
  params: Promise<Params>;
}

interface Version {
  rabbitmq: string;
  erlang: string;
}

export default function VersionsPage({ params }: VersionsPageProps) {
  const { name } = React.use(params);
  const [versions, setVersions] = useState<Version | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const fetchVersions = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`/api/instances/${name}/versions`);
        console.log(response.data);
        setVersions({
          rabbitmq: response.data.rabbitmq_version,
          erlang: response.data.erlang_version,
        });
      } catch (error) {
        console.error("Error fetching versions:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchVersions();
  }, [name]);
  return (
    <>
      {" "}
      {isFetching && <div>Loading...</div>}
      <h2>Versions</h2>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td className={styles.td}>
              Current RabbitMQ version
              <br />
              Current Erlang version
            </td>
            <td className={styles.td}>
              {versions?.rabbitmq}
              <br />
              {versions?.erlang}
            </td>
            <td className={styles.td}>
              <button>Update</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
