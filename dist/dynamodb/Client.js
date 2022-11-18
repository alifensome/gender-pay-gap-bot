"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
class DynamoDbClient {
    constructor(tableName) {
        this.dynamoDB = new client_dynamodb_1.DynamoDB({});
        this.tableName = tableName;
    }
    getItem(inputKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: (0, util_dynamodb_1.marshall)(inputKeys)
            };
            const result = yield this.dynamoDB.getItem(params);
            if (!result || !result.Item) {
                return null;
            }
            return (0, util_dynamodb_1.unmarshall)(result.Item);
        });
    }
    query(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = Object.assign({ TableName: this.tableName }, input);
            const result = yield this.dynamoDB.query(params);
            if (!result.Items) {
                return [];
            }
            return this.unmarshallList(result.Items);
        });
    }
    unmarshallList(items) {
        const unmarshalledItems = [];
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            unmarshalledItems.push((0, util_dynamodb_1.unmarshall)(item));
        }
        return unmarshalledItems;
    }
    putItem(inputItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: (0, util_dynamodb_1.marshall)(inputItem, { removeUndefinedValues: true })
            };
            return yield this.dynamoDB.putItem(params);
        });
    }
}
exports.default = DynamoDbClient;
//# sourceMappingURL=Client.js.map