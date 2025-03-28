import { IpPermission } from "@aws-sdk/client-ec2"; // Assuming you are importing this from AWS SDK
import { FirewallRule, SecurityGroupRule } from "@/types/firewall";

const PORT_SERVICE_MAP: Record<number, string> = {
  5672: "AMQP",
  1883: "MQTT",
  8883: "MQTTS",
  61613: "STOMP",
  61614: "STOMPS",
  443: "HTTPS",
  15674: "STOMP_WS",
  15675: "STOMP_SSL",
  15692: "STREAM",
  15693: "STREAM_SSL",
  5671: "AMQPS",
};

export function convertIpPermissionsToSecurityGroupRules(ipPermissions: IpPermission[]): SecurityGroupRule[] {
  if (!ipPermissions) {
    throw new Error("IpPermissions is undefined or empty.");
  }

  const sgRules = ipPermissions.map((permission) => {
    if (permission?.FromPort === undefined || permission?.ToPort === undefined) {
      throw new Error("Missing required fields: FromPort or ToPort.");
    }

    // If IpProtocol is missing, default to "tcp"
    const IpProtocol = permission?.IpProtocol ?? "tcp";

    // Check if IpProtocol is undefined, and throw error if necessary
    if (IpProtocol === undefined) {
      throw new Error("Missing required field: IpProtocol.");
    }

    // Ensure IpRanges have valid CidrIp (string)
    const IpRanges = (permission?.IpRanges || []).map((range) => {
      if (!range.CidrIp) {
        throw new Error("CidrIp is required in IpRange.");
      }
      return {
        CidrIp: range.CidrIp, // Make sure CidrIp is a string
        Description: range.Description, // Optional field
      };
    });

    return {
      IpProtocol,
      FromPort: permission?.FromPort,
      ToPort: permission?.ToPort,
      IpRanges,
    };
  });

  return sgRules;
}

export function convertToSecurityGroupRules(firewallRules: FirewallRule[]): SecurityGroupRule[] {
  const securityGroupRules: SecurityGroupRule[] = [];

  for (const rule of firewallRules) {
    const { sourceIp, description, commonPorts, otherPorts } = rule;
    const allPorts = [
      ...commonPorts.map((service) =>
        Object.keys(PORT_SERVICE_MAP).find((port) => PORT_SERVICE_MAP[Number(port)] === service)
      ).map(Number), // Convert service names back to port numbers
      ...otherPorts,
    ].filter((port) => !isNaN(port)); // Remove any undefined values

    for (const port of allPorts) {
      securityGroupRules.push({
        IpProtocol: "tcp",
        FromPort: port,
        ToPort: port,
        IpRanges: [{ CidrIp: sourceIp, Description: description }],
      });
    }
  }

  return securityGroupRules;
}

export function convertToUIFirewallRules(securityGroupRules: SecurityGroupRule[]): FirewallRule[] {
  const firewallMap: Record<
    string,
    { description: string; commonPorts: string[]; otherPorts: number[] }
  > = {};

  for (const rule of securityGroupRules) {
    const sourceIp = rule.IpRanges[0].CidrIp;
    const description = rule.IpRanges[0].Description || "";
    const port = rule.FromPort;

    if (!firewallMap[sourceIp]) {
      firewallMap[sourceIp] = { description, commonPorts: [], otherPorts: [] };
    }

    if (PORT_SERVICE_MAP[port]) {
      firewallMap[sourceIp].commonPorts.push(PORT_SERVICE_MAP[port]);
    } else {
      firewallMap[sourceIp].otherPorts.push(port);
    }
  }

  return Object.entries(firewallMap).map(([sourceIp, { description, commonPorts, otherPorts }]) => ({
    sourceIp,
    description,
    commonPorts,
    otherPorts,
  }));
}

// for my testing
const uiFirewallRules: FirewallRule[] = [
  {
    sourceIp: "0.0.0.0/0",
    description: "Public access",
    commonPorts: ["AMQP", "MQTT", "HTTPS"], // Auto-mapped
    otherPorts: [9001],
  },
  {
    sourceIp: "10.1.0.0/16",
    description: "Internal network",
    commonPorts: ["AMQP"], // Auto-mapped
    otherPorts: [8080, 9000],
  },
];

// Convert UI → AWS
const awsSecurityGroupRules = convertToSecurityGroupRules(uiFirewallRules);
console.log("AWS Security Group Rules:", JSON.stringify(awsSecurityGroupRules, null, 2));

// Convert AWS → UI
const reconstructedUIRules = convertToUIFirewallRules(awsSecurityGroupRules);
console.log("Reconstructed UI Firewall Rules:", JSON.stringify(reconstructedUIRules, null, 2));