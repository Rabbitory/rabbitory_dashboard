"use client";

import { useEffect, useState } from "react";
import { useInstanceContext } from "../../../InstanceContext";
import axios from "axios";

export default function HardwarePage() {
  const [volumeSize, setVolumeSize] = useState<number | null>(null);
  const { instance } = useInstanceContext();

  useEffect(() => {
    async function fetchVolumeSize() {
      if (!instance?.EBSVolumeId || !instance?.region) {
        alert("Missing EBSVolumeId or region");
        return;
      }

      const response = await axios.get(
        `/api/instances/${instance?.name}/hardware/storage?volumeId=${instance?.EBSVolumeId}&region=${instance?.region}`,
      );

      if (response.data) setVolumeSize(response.data.size);
    }

    fetchVolumeSize();
  }, [instance?.EBSVolumeId, instance?.region, instance?.id, instance?.name]);

  return (
    <>
      <div>
        <h1>Hardware</h1>
        <p>
          Current instance storage size:{" "}
          {volumeSize !== null ? `${volumeSize} GB` : "Loading..."}
        </p>
      </div>
    </>
  );
}
