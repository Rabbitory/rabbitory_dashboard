import axios from "axios";

export default async function InstancePage({
  params,
}: {
  params: { id: string };
}) {
  return <div>Instance Page {params.id}</div>;
}
