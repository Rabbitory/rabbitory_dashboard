export interface FirewallRule {
  description: string;
  sourceIp: string;
  commonPorts: number[];
  customPorts: string;
}