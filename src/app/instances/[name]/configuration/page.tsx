"use client";
import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./ConfigurationPage.module.css";
import { useInstanceContext } from "../InstanceContext";

interface Configuration {
  [key: string]: string;
}

export default function ConfigurationPage() {
  const [configuration, setConfiguration] = useState<Configuration | null>(
    null,
  );
  const [isFetching, setIsFetching] = useState(false);
  const { instance } = useInstanceContext();

  useEffect(() => {
    const fetchConfiguration = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(
          `/api/instances/${instance?.name}/configuration`,
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
  }, [instance?.name]);
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
