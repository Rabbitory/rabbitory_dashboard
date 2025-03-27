'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";


interface Params {
  instanceName: string;
}
interface FirewallPageProps {
  params: Promise<Params>;
}

interface FirewallRule {
  description: string;
  sourceIp: string;
  commonPorts: number[];
  customPorts: string;
}

const commonPorts = [
  { name: "AMQP", port: 5672 },
  { name: "HTTPS", port: 443 },
  { name: "AMQPS", port: 5671 },
];

// export default function FirewallPage({ params }: FirewallPageProps) {
//   const { instanceName } = React.use(params);
//   const [isFetching, setIsFetching] = useState<boolean>(false);
//   const [isSaving, setIsSaving] = useState<boolean>(false);
//   const [rules, setRules] = useState<FirewallRule[]>([]);
//   const [newRule, setNewRule] = useState<FirewallRule>({
//     description: "",
//     sourceIp: "",
//     commonPorts: [],
//     customPorts: "",
//   });

//   useEffect(() => {
//     async function fetchRules() {
//       setIsFetching(true);
//       // try {
//       //   const { data } = await axios.get<FirewallRule[]>(`/api/instances/${instanceName}/configuration`);
//       //   setRules(data);
//       // } catch (error) {
//       //   console.error("Error fetching rules:", error);
//       // } finally {
//       //   setIsFetching(false);
//       // }
//     }
//     fetchRules();
//   }, [instanceName]);

//   const handleCheckboxChange = (port: number) => {
//     setNewRule((prev) => ({
//       ...prev,
//       commonPorts: prev.commonPorts.includes(port)
//         ? prev.commonPorts.filter((p) => p !== port)
//         : [...prev.commonPorts, port],
//     }));
//   };

//   const handleAddRule = async () => {
//     setIsSaving(true);
//     try {
//       const response = await axios.post<FirewallRule[]>(`/api/instances/${instanceName}/configuration`, newRule);
//       setRules(response.data);
//     } catch (error) {
//       console.error("Error adding rule:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleClearForm = () => {
//     setNewRule({
//       description: "",
//       sourceIp: "",
//       commonPorts: [],
//       customPorts: "",
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
//       <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Firewall Settings</h2>
//       <div className="border rounded-lg p-4 shadow-md mb-4">
//         <h3 className="text-lg font-semibold mb-2">Current Firewall Rules</h3>
//         {isFetching ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : rules.length === 0 ? (
//           <p className="text-gray-600">No firewall rules applied.</p>
//         ) : (
//           rules.map((rule, index) => (
//             <div key={index} className="p-2 border-b">
//               <p><strong>{rule.description}</strong></p>
//               <p>Source IP: {rule.sourceIp}</p>
//               <p>Ports: {rule.commonPorts.join(", ")} {rule.customPorts && `, ${rule.customPorts}`}</p>
//             </div>
//           ))
//         )}
//       </div>
//       <div className="border rounded-lg p-4 shadow-md mb-4">
//         <h3 className="text-lg font-semibold mb-2">Add New Firewall Rule</h3>
//         <input
//           type="text"
//           placeholder="Description"
//           value={newRule.description}
//           onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
//           className="border p-2 rounded-md w-full mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Source IP"
//           value={newRule.sourceIp}
//           onChange={(e) => setNewRule({ ...newRule, sourceIp: e.target.value })}
//           className="border p-2 rounded-md w-full mb-2"
//         />
//         <div className="mb-2">
//           <h4 className="font-medium">Common Ports</h4>
//           {commonPorts.map((port) => (
//             <div key={port.port} className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={newRule.commonPorts.includes(port.port)}
//                 onChange={() => handleCheckboxChange(port.port)}
//                 className="mr-2"
//               />
//               <label>{port.name} ({port.port})</label>
//             </div>
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Custom Ports (comma separated)"
//           value={newRule.customPorts}
//           onChange={(e) => setNewRule({ ...newRule, customPorts: e.target.value })}
//           className="border p-2 rounded-md w-full mb-2"
//         />
//         <div className="flex justify-end gap-4">
//           <button
//             onClick={handleClearForm}
//             className="w-1/4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 text-xl"
//           >
//             Clear
//           </button>
//           <button
//             onClick={handleAddRule}
//             className="w-1/4 py-2 bg-green-400 text-white rounded-full hover:bg-green-300 focus:ring-2 focus:ring-green-500 text-xl"
//             disabled={isSaving}
//           >
//             {isSaving ? "Saving..." : "Add Rule"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function FirewallPage({ params }: FirewallPageProps) {
  const { instanceName } = React.use(params);
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
      // try {
      //   const { data } = await axios.get<FirewallRule[]>(`/api/instances/${instanceName}/configuration`);
      //   setRules(data);
      // } catch (error) {
      //   console.error("Error fetching rules:", error);
      // } finally {
      //   setIsFetching(false);
      // }
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

  const handleClearForm = () => {
    setNewRule({
      description: "",
      sourceIp: "",
      commonPorts: [],
      customPorts: "",
    });
  };

  return (
    <div className="">
      {/* Current Firewall Rules Card */}
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Firewall Settings</h2>
        <h3 className="text-lg font-semibold mb-2">Current Firewall Rules</h3>
        {isFetching ? (
          <p className="text-gray-600">Loading...</p>
        ) : rules.length === 0 ? (
          <p className="text-gray-600">No firewall rules applied.</p>
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

      {/* Add New Firewall Rule Card */}
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
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
        <div className="flex justify-end gap-4">
          <button
            onClick={handleClearForm}
            className="w-1/4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 text-xl"
          >
            Clear
          </button>
          <button
            onClick={handleAddRule}
            className="w-1/4 py-2 bg-green-400 text-white rounded-full hover:bg-green-300 focus:ring-2 focus:ring-green-500 text-xl"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Add Rule"}
          </button>
        </div>
      </div>
    </div>
  );
}
