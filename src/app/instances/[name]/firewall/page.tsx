'use client';

import { useState, useEffect } from "react";
import axios from "axios";

interface FirewallRule {
  description: string;
  sourceIp: string;
  commonPorts: number[];
  customPorts: string;
}

interface FirewallPageProps {
  params: {
    instanceName: string;
  };
}

const commonPorts = [
  { name: "AMQP", port: 5672 },
  { name: "HTTPS", port: 443 },
  { name: "AMQPS", port: 5671 },
];

export default function FirewallPage({ params }: FirewallPageProps) {
  const { instanceName } = params;
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [newRule, setNewRule] = useState<FirewallRule>({
    description: "",
    sourceIp: "",
    commonPorts: [],
    customPorts: "",
  });

  useEffect(() => {
    async function fetchRules() {
      setIsFetching(true);
      try {
        const { data } = await axios.get<FirewallRule[]>(`/api/instances/${instanceName}/configuration`);
        setRules(data);
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchRules();
  }, [instanceName]);

  const handleCheckboxChange = (port: number) => {
    setNewRule((prev) => ({
      ...prev,
      commonPorts: prev.commonPorts.includes(port)
        ? prev.commonPorts.filter((p) => p !== port)
        : [...prev.commonPorts, port],
    }));
  };

  const handleAddRule = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post<FirewallRule[]>(`/api/instances/${instanceName}/configuration`, newRule);
      setRules(response.data);
    } catch (error) {
      console.error("Error adding rule:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Firewall Settings</h2>
      <div className="border rounded-lg p-4 shadow-md mb-4">
        <h3 className="text-lg font-semibold mb-2">Add New Firewall Rule</h3>
        <input
          type="text"
          placeholder="Description"
          value={newRule.description}
          onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
          className="border p-2 rounded-md w-full mb-2"
        />
        <input
          type="text"
          placeholder="Source IP"
          value={newRule.sourceIp}
          onChange={(e) => setNewRule({ ...newRule, sourceIp: e.target.value })}
          className="border p-2 rounded-md w-full mb-2"
        />
        <div className="mb-2">
          <h4 className="font-medium">Common Ports</h4>
          {commonPorts.map((port) => (
            <div key={port.port} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newRule.commonPorts.includes(port.port)}
                onChange={() => handleCheckboxChange(port.port)}
                className="mr-2"
              />
              <label>{port.name} ({port.port})</label>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Custom Ports (comma separated)"
          value={newRule.customPorts}
          onChange={(e) => setNewRule({ ...newRule, customPorts: e.target.value })}
          className="border p-2 rounded-md w-full mb-2"
        />
        <button
          onClick={handleAddRule}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Add Rule"}
        </button>
      </div>
      <div className="border rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-2">Current Firewall Rules</h3>
        {isFetching ? (
          <p>Loading...</p>
        ) : rules.length === 0 ? (
          <p>No firewall rules applied.</p>
        ) : (
          rules.map((rule, index) => (
            <div key={index} className="p-2 border-b">
              <p><strong>{rule.description}</strong></p>
              <p>Source IP: {rule.sourceIp}</p>
              <p>Ports: {rule.commonPorts.join(", ")} {rule.customPorts && `, ${rule.customPorts}`}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}