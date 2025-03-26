"use client";

import { useInstanceContext } from "../InstanceContext";
import Link from "next/link";

export default function HardwarePage() {
  const { instance } = useInstanceContext();

  return (
    <>
      <div>
        <h1>Hardware</h1>
        <p>Current instance hardware: {instance?.type}</p>
        <Link href={`/instances/${instance?.name}/hardware/edit`}>Change</Link>
      </div>
    </>
  );
}
