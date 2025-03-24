import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, } from "@aws-sdk/lib-dynamodb";

interface credentialsType {
  instanceId: string,
  instanceName: string,
  username: string,
  password: string,
  metadata?: string
}

export const storeCredentialsToDynamoDB = async (credentials: credentialsType, region: string) => {
  const client = new DynamoDBClient({ region: region });
  const docClient = DynamoDBDocumentClient.from(client);
  const command = new PutCommand({
    TableName: "RabbitoryInstancesMetadata",
    Item: credentials
  })

  const response = await docClient.send(command);
  console.log("Metadata successfully written to DynamoDB")
  return response;
}


