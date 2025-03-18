import {
  EC2Client,
  RunInstancesCommand,
  DescribeVpcsCommand,
  DescribeInstancesCommand,
  CreateSecurityGroupCommand,
  RunInstancesCommandInput,
  AuthorizeSecurityGroupIngressCommand,
  waitUntilInstanceRunning,
  _InstanceType,
} from "@aws-sdk/client-ec2";

import getAmiId from "../AMI/AMI";

//Replace with Laren's security group
const ipPermissions = [
  {
    IpProtocol: "tcp",
    FromPort: 5672,
    ToPort: 5672,
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
  {
    IpProtocol: "tcp",
    FromPort: 15672,
    ToPort: 15672,
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
  {
    IpProtocol: "tcp",
    FromPort: 80,
    ToPort: 80,
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
  {
    IpProtocol: "tcp",
    FromPort: 443,
    ToPort: 443,
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
  {
    IpProtocol: "tcp",
    FromPort: 22,
    ToPort: 22,
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
];

//when you create a security group, you need the vpc id. The default vpc id comes with your account and the region you define

//Replace with Laren's security group
async function getDefaultVpcId(client: EC2Client): Promise<string | undefined> {
  const command = new DescribeVpcsCommand({
    Filters: [
      {
        Name: "isDefault",
        Values: ["true"],
      },
    ],
  });

  const response = await client.send(command);
  if (response.Vpcs && response.Vpcs.length > 0) {
    return response.Vpcs[0].VpcId;
  } else {
    throw new Error("No default VPC found");
  }
}

//replace with Laren's security group
async function createSecurityGroup(
  client: EC2Client,
  vpcId: string | undefined,
): Promise<string | undefined> {
  const command = new CreateSecurityGroupCommand({
    Description: "Security group for RabbitMQ",
    GroupName: "RabbitMQSecurityGroup",
    VpcId: vpcId,
  });
  try {
    const response = await client.send(command);
    console.log("Security group created:", response.GroupId);
    return response.GroupId;
  } catch (err) {
    console.error("Error creating security group:", err);
  }
}

async function authorizeSecurityGroupIngress(
  client: EC2Client,
  securityGroupId: string | undefined,
) {
  if (!securityGroupId) {
    throw new Error("No security group ID found");
  }

  const command = new AuthorizeSecurityGroupIngressCommand({
    GroupId: securityGroupId,
    IpPermissions: ipPermissions,
  });

  try {
    const { SecurityGroupRules } = await client.send(command);
    console.log(JSON.stringify(SecurityGroupRules, null, 2));
  } catch (caught) {
    if (caught instanceof Error && caught.name === "InvalidGroupId.Malformed") {
      console.warn(`${caught.message}. Please provide a valid GroupId.`);
    } else {
      throw caught;
    }
  }
}

async function getInstanceDetails(
  instanceId: string | undefined,
  ec2Client: EC2Client,
) {
  const describeCommand = new DescribeInstancesCommand({
    InstanceIds: instanceId ? [instanceId] : undefined,
  });
  const describeResponse = await ec2Client.send(describeCommand);

  if (
    !describeResponse.Reservations ||
    describeResponse.Reservations.length === 0 ||
    !describeResponse.Reservations[0].Instances ||
    describeResponse.Reservations[0].Instances.length === 0
  ) {
    throw new Error("No instance information found.");
  }

  const instance = describeResponse.Reservations[0].Instances[0];
  const publicDns = instance.PublicDnsName || "N/A";
  const publicIp = instance.PublicIpAddress || "N/A";

  return { publicDns, publicIp };
}

export default async function createInstance(
  region = "us-east-2",
  instanceType: _InstanceType = "t2.micro",
  mainQueueName: string,
  dlqName: string,
  username: string,
  password: string,
) {
  const userDataScript = `#!/bin/bash
  # Update package lists and install RabbitMQ server and wget
  apt-get install curl gnupg apt-transport-https -y

  ## Team RabbitMQ's main signing key
  curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" | sudo gpg --dearmor | sudo tee /usr/share/keyrings/com.rabbitmq.team.gpg > /dev/null
  ## Community mirror of Cloudsmith: modern Erlang repository
  curl -1sLf https://github.com/rabbitmq/signing-keys/releases/download/3.0/cloudsmith.rabbitmq-erlang.E495BB49CC4BBE5B.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg > /dev/null
  ## Community mirror of Cloudsmith: RabbitMQ repository
  curl -1sLf https://github.com/rabbitmq/signing-keys/releases/download/3.0/cloudsmith.rabbitmq-server.9F4587F226208342.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/rabbitmq.9F4587F226208342.gpg > /dev/null

  ## Add apt repositories maintained by Team RabbitMQ
  tee /etc/apt/sources.list.d/rabbitmq.list <<'EOF'
  ## Provides modern Erlang/OTP releases
  ##
  deb [arch=amd64 signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa1.rabbitmq.com/rabbitmq/rabbitmq-erlang/deb/ubuntu noble main
  deb-src [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa1.rabbitmq.com/rabbitmq/rabbitmq-erlang/deb/ubuntu noble main

  # another mirror for redundancy
  deb [arch=amd64 signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa2.rabbitmq.com/rabbitmq/rabbitmq-erlang/deb/ubuntu noble main
  deb-src [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa2.rabbitmq.com/rabbitmq/rabbitmq-erlang/deb/ubuntu noble main

  ## Provides RabbitMQ
  ##
  deb [arch=amd64 signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa1.rabbitmq.com/rabbitmq/rabbitmq-server/deb/ubuntu noble main
  deb-src [signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa1.rabbitmq.com/rabbitmq/rabbitmq-server/deb/ubuntu noble main

  # another mirror for redundancy
  deb [arch=amd64 signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa2.rabbitmq.com/rabbitmq/rabbitmq-server/deb/ubuntu noble main
  deb-src [signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa2.rabbitmq.com/rabbitmq/rabbitmq-server/deb/ubuntu noble main
  EOF

  ## Update package indices
  apt-get update -y

  ## Install Erlang packages
  apt-get install -y erlang-base \
                          erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
                          erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
                          erlang-runtime-tools erlang-snmp erlang-ssl \
                          erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl

  ## Install rabbitmq-server and its dependencies
  apt-get install rabbitmq-server wget -y --fix-missing

  # Stop RabbitMQ service if running
  systemctl stop rabbitmq-server

  # Enable plugins offline (this writes directly to the enabled_plugins file)
  rabbitmq-plugins --offline enable rabbitmq_management rabbitmq_management_agent rabbitmq_web_dispatch

  # Start RabbitMQ service
  systemctl start rabbitmq-server
  systemctl enable rabbitmq-server

  # Wait for the management interface to be available
  sleep 20

  # Write the configuration file to enable the log exchange
  tee /etc/rabbitmq/rabbitmq.conf <<'EOF'
  log.exchange = true
  EOF

  # Create admin user for the management UI
  rabbitmqctl add_user ${username} ${password}
  rabbitmqctl set_user_tags ${username} administrator
  rabbitmqctl set_permissions -p / ${username} ".*" ".*" ".*"

  # Download rabbitmqadmin (the RabbitMQ CLI tool) from the local management interface
  wget -O /usr/local/bin/rabbitmqadmin http://localhost:15672/cli/rabbitmqadmin
  chmod +x /usr/local/bin/rabbitmqadmin

  # Create Dead-Letter Queue
  /usr/local/bin/rabbitmqadmin declare queue name=${dlqName} durable=true
  # Build JSON arguments for the main queue using the provided dead-letter queue name
  json_args="{\\"x-dead-letter-exchange\\": \\"\\", \\"x-dead-letter-routing-key\\": \\"${dlqName}\\"}"


  # Create Main Queue with DLQ settings (dead-letter exchange is the default exchange "")
  /usr/local/bin/rabbitmqadmin declare queue name=${mainQueueName} durable=true arguments="$json_args"

  # Declare a durable queue named 'logstream' with a maximum length of 1000 messages.
  rabbitmqadmin declare queue name=logstream durable=true arguments='{"x-max-length":1000}'

  # Bind the logstream queue to the log exchange.
  rabbitmqadmin declare binding source="amq.rabbitmq.log" destination="logstream" destination_type="queue" routing_key="#"
  `;

  const ec2Client = new EC2Client({ region });
  const amiId = await getAmiId(region);

  //Replace with Laren's security group
  const vpcId = await getDefaultVpcId(ec2Client);

  //Replace with Laren's security group
  const securityGroupId = await createSecurityGroup(ec2Client, vpcId);

  //Replace with Laren's security group
  await authorizeSecurityGroupIngress(ec2Client, securityGroupId);

  // Data must be base64 encoded
  const encodedUserData = Buffer.from(userDataScript).toString("base64");

  const params: RunInstancesCommandInput = {
    ImageId: amiId, // AMI (OS) id (Ubuntu in this example) - region specific
    InstanceType: instanceType, // Instance hardware
    MinCount: 1, // 1 instance made
    MaxCount: 1, // 1 instance made
    SecurityGroupIds: securityGroupId ? [securityGroupId] : undefined, // Security group id
    UserData: encodedUserData,
    TagSpecifications: [
      {
        ResourceType: "instance",
        Tags: [
          {
            Key: "Name",
            Value: "RabbitMQ-Server",
          },
        ],
      },
    ],
  };

  try {
    const data = await ec2Client.send(new RunInstancesCommand(params));
    if (!data.Instances) throw new Error("No instances found");
    const instanceId = data.Instances[0].InstanceId;
    console.log("Instance created:", instanceId);

    await waitUntilInstanceRunning(
      { client: ec2Client, maxWaitTime: 3000 },
      { InstanceIds: instanceId ? [instanceId] : undefined },
    );
    console.log(`Instance ${instanceId} is now running.`);

    // Retrieve instance details to get its public DNS or IP
    const { publicDns, publicIp } = await getInstanceDetails(
      instanceId,
      ec2Client,
    );

    // Construct an AMQP endpoint URL for the main queue (RabbitMQ listens on port 5672)
    const endpointUrl = `amqp://${username}:${password}@${
      publicDns || publicIp
    }:5672`;
    console.log(`Main queue endpoint URL: ${endpointUrl}`);
    return data;
  } catch (err) {
    console.error("Error creating instance:", err);
  }
}

//   createInstance(
//     "us-east-2",
//     "t2.micro",
//     "MainQueue",
//     "DeadLetterQueue",
//     "admin",
//     "password"
//   );
