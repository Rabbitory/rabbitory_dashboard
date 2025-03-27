"use client";
import * as React from "react";
import axios from "axios";
import styles from "./PluginsPage.module.css";
import { useEffect, useState } from "react";
import { plugins, Plugin } from "@/types/plugins";

interface Params {
  name: string;
}
interface PluginsPageProps {
  params: Promise<Params>;
}

export default function PluginsPage({ params }: PluginsPageProps) {
  const { name } = React.use(params);
  const [pluginList] = useState<Plugin[]>(plugins);
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const fetchPlugins = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`/api/instances/${name}/plugins`);
        console.log(response.data);
        setEnabledPlugins(response.data);
      } catch (error) {
        console.error("Error fetching plugins:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPlugins();
  }, [name]);
  return (
    <>
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Plugin Name</th>
                <th className={styles.th}>Description</th>
                <th className={styles.th}>Status &amp; Action</th>
              </tr>
            </thead>
            <tbody>
              {pluginList.map((plugin, idx) => {
                const isEnabled = enabledPlugins.includes(plugin.name);
                return (
                  <tr key={idx}>
                    <td className={styles.td}>{plugin.name}</td>
                    <td className={styles.td}>{plugin.description}</td>
                    <td className={styles.td}>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => console.log("toggle")}
                        />
                        <span className={styles.slider}></span>
                      </label>
                      <span className={styles.toggleText}>
                        {isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
