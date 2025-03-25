"use client";
import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { _InstanceType } from "@aws-sdk/client-ec2";
import styles from "./ConfigurationPage.module.css";

interface Params {
  name: string;
}
interface ConfigurationPageProps {
  params: Promise<Params>;
}

interface Configuration {
  [key: string]: string;
}

export default function ConfigurationPage({ params }: ConfigurationPageProps) {
  const { name } = React.use(params);
  const [configuration, setConfiguration] = useState<Configuration | null>(
    null
  );
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const fetchConfiguration = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(
          `/api/instances/${name}/configuration`
        );
        console.log(response.data);
        setConfiguration(response.data);
      } catch (error) {
        console.error("Error fetching configuration:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchConfiguration();
  }, [name]);
  return (
    <>
      {" "}
      {isFetching && <div>Loading...</div>}
      <h2>Configuration</h2>
      <table className={styles.table}>
        <tbody>
          {configuration &&
            Object.entries(configuration).map(([key, value], idx) => (
              <tr key={idx}>
                <td className={styles.td}>{key}</td>
                <td className={styles.td}>
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
