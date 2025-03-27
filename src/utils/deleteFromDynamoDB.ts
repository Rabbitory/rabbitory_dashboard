import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

export const deleteFromDynamoDB = async (
  tableName: string,
  key: string,
  region: string
) => {
  const client = new DynamoDBClient({ region: region })

  try {
    const command = new DeleteItemCommand({
      TableName: tableName,
      Key: { PK: { S: key } }
    })

    const response = await client.send(command);
    console.log("Item deleted successfully:", response);
  } catch (err) {
    console.error("Error deleting item:", err);
  }
}
