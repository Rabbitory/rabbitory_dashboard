import FirewallRow from "./FirewallRow";

export default function FirewallPage() {
  return (
    <>
      <h1>Firewall</h1>
      <p>Configure which IPs and ports should be open for access.</p>
      <form>
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
            <FirewallRow />
          </tbody>
        </table>
      </form>
    </>
  )
}