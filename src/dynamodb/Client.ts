import { AttributeValue, DynamoDB, GetItemInput, PutItemCommandOutput, PutItemInput, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export default class DynamoDbClient {
    dynamoDB: DynamoDB;
    tableName: string;
    constructor(tableName: string) {
        this.dynamoDB = new DynamoDB({});
        this.tableName = tableName
    }

    async getItem<T>(inputKeys: DynamoDbClientGetItemInput): Promise<T | UnmarshalledAny | null> {
        const params: GetItemInput = {
            TableName: this.tableName,
            Key: marshall(inputKeys)
        };
        const result = await this.dynamoDB.getItem(params);
        if (!result || !result.Item) {
            return null
        }
        return unmarshall(result.Item)
    }

    async query<T>(input: Partial<QueryCommandInput>): Promise<T | UnmarshalledAny> {
        const params: QueryCommandInput = {
            TableName: this.tableName,
            ...input
        };
        const result = await this.dynamoDB.query(params);
        if (!result.Items) {
            return []
        }
        return this.unmarshallList(result.Items)
    }

    unmarshallList(items: MarshalledItem[]) {
        const unmarshalledItems: any[] = []
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            unmarshalledItems.push(unmarshall(item))
        }
        return unmarshalledItems
    }

    async putItem(inputItem: DynamoDbClientPutItemInput): Promise<PutItemCommandOutput> {
        const params: PutItemInput = {
            TableName: this.tableName,
            Item: marshall(inputItem, { removeUndefinedValues: true })
        };
        return await this.dynamoDB.putItem(params);
    }
}

export interface DynamoDbClientGetItemInput { id: string, pk: string }
export interface DynamoDbClientPutItemInput { id: string, pk: string, data: any }

export interface UnmarshalledAny {
    [key: string]: any;
}

export interface MarshalledItem {
    [key: string]: AttributeValue;
}
