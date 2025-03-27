import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, } from "@aws-sdk/lib-dynamodb";
import encrypt from "./encrypt";

interface data {
  [key: string]: string
}

export const storeToDynamoDB = async (data: data, region: string) => {
  const client = new DynamoDBClient({ region: region });
  const docClient = DynamoDBDocumentClient.from(client);

  const hashedUsername = await encrypt(data.username);
  const hashedPassword = await encrypt(data.password);

  if (hashedUsername && hashedPassword) {
    const securedata = {
      ...data,
      username: hashedUsername,
      password: hashedPassword
    };

    try {
      const command = new PutCommand({
        TableName: "RabbitoryInstancesdata",
        Item: securedata
      })

      const response = await docClient.send(command);
      console.log("data successfully written to DynamoDB")
      return response;
    } catch (err) {
      console.error("Error writing to DynamoDB:", err);
      throw new Error("Failed to store data to DynamoDB");
    }
  } else {
    console.error("Encryption failed. data not stored to DynamoDB");
    throw new Error("Encryption error occurred");
  }
}


