'use client';

import { useState } from "react";
import FirewallRow from "./FirewallRow";

const seedRules = [
  { id: 1, description: "", sourceIP: "0.0.0.0/0", selectedPorts: ["AMQP", "HTTPS", "MQTTS", "STOMPS", "STREAM_SSL"] },
  { id: 2, description: "Email Consumer", sourceIP: "10.1.0.0/16", selectedPorts: [] },
];

export default function FirewallPage() {
  const [rules, setRules] = useState(seedRules);
  const [extraRowAmount, setExtraRowAmount] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('update firewall rules');
  }

  const handleAddRuleRow = () => setExtraRowAmount((prev) => prev + 1);

  return (
    <>
      <h1>Firewall</h1>
      <p>Configure which IPs and ports should be open for access.</p>
      <form onSubmit={handleSubmit}>
        <table className="firewall">
          <thead>
            <tr>
              <th>Description</th>
              <th>Source IP</th>
              <th>Common Ports</th>
              <th>Other Ports</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => {
              return <FirewallRow key={rule.id}/>;
            })}
            {Array(extraRowAmount).fill(0).map((row, idx) => {
              return <FirewallRow key={`unsaved-rule-${idx}`}/>;
            })}
          </tbody>
          <tfoot>
            <tr>
              <td><button type="submit">Save</button></td>
              <td><button type="button" onClick={handleAddRuleRow}>+ Add additional row</button></td>
            </tr>
          </tfoot>
        </table>
      </form>
    </>
  )
}