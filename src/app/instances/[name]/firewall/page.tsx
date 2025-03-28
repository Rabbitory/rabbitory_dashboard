'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { FirewallRule } from "@/types/firewall";


interface Params {
  name: string;
}
interface FirewallPageProps {
  params: Promise<Params>;
}

const COMMON_PORTS = ["AMQP", "MQTT", "STOMPS", "AMQPS", "MQTTS", "STREAM", "HTTPS", "STOMP", "STREAM_SSL"];


export default function FirewallPage({ params }: FirewallPageProps) {
  const { name } = React.use(params);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [rules, setRules] = useState<FirewallRule[]>([]);

  useEffect(() => {
    async function fetchRules() {
      setIsFetching(true);
      try {
        const { data } = await axios.get(`/api/instances/${name}/firewall`);
        setRules(data);
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchRules();
  }, [name]);

  const handleInputChange = (index: number, field: keyof FirewallRule, value: any) => {
    const updatedRules = [...rules];
    (updatedRules[index] as any)[field] = value;
    setRules(updatedRules);
  };

  const handlePortToggle = (index: number, port: string) => {
    const updatedRules = [...rules];
    const rule = updatedRules[index];
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    rule.commonPorts.includes(port)
      ? (rule.commonPorts = rule.commonPorts.filter((p) => p !== port))
      : rule.commonPorts.push(port);
    setRules(updatedRules);
  };

  const handleOtherPortsChange = (index: number, value: string) => {
    const updatedRules = [...rules];
    updatedRules[index].otherPorts = value
      ? value.split(",").map((port) => parseInt(port.trim(), 10))
      : [];
    setRules(updatedRules);
  };

  const addRule = () => {
    setRules([
      ...rules,
      { description: "", sourceIp: "", commonPorts: [], otherPorts: [] },
    ]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post(`/api/instances/${name}/firewall`, { rules });
      alert("Firewall rules updated successfully!");
    } catch (error) {
      console.error("Error saving rules:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Firewall Settings</h2>

      {isFetching ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div key={index} className="p-4 border rounded-md">
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={rule.description}
                    onChange={(e) => handleInputChange(index, "description", e.target.value)}
                    className="col-span-3 p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Source IP"
                    value={rule.sourceIp}
                    onChange={(e) => handleInputChange(index, "sourceIp", e.target.value)}
                    className="col-span-3 p-2 border rounded"
                  />
                  <div className="col-span-4 flex flex-wrap gap-2">
                    {COMMON_PORTS.map((port) => (
                      <label key={port} className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={rule.commonPorts.includes(port)}
                          onChange={() => handlePortToggle(index, port)}
                        />
                        <span className="text-sm">{port}</span>
                      </label>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Other Ports (comma-separated)"
                    value={rule.otherPorts.join(", ")}
                    onChange={(e) => handleOtherPortsChange(index, e.target.value)}
                    className="col-span-2 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="col-span-1 bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Drop
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={addRule}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              + Add additional row
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`bg-green-500 text-white px-4 py-2 rounded ${isSaving ? "opacity-50" : ""}`}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
