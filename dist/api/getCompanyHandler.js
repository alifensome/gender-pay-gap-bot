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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyByTwitterHandle = exports.getCompanyByTwitterId = exports.getCompanyByCompanyId = void 0;
const importData_1 = __importDefault(require("../importData"));
const response_1 = require("./response");
const d = new importData_1.default();
const getCompanyByCompanyId = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const id = event.pathParameters.id;
    const tweets = d.companyDataJoinedTweets();
    const company = tweets.find((c) => c.companyNumber === id);
    return (0, response_1.response)(company);
});
exports.getCompanyByCompanyId = getCompanyByCompanyId;
const getCompanyByTwitterId = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const id = event.pathParameters.id;
    const tweets = d.companyDataJoinedTweets();
    const company = tweets.find((c) => c.twitterId === id);
    return (0, response_1.response)(company);
});
exports.getCompanyByTwitterId = getCompanyByTwitterId;
const getCompanyByTwitterHandle = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const handle = event.pathParameters.handle;
    const tweets = d.companyDataJoinedTweets();
    const company = tweets.find((c) => { var _a; return ((_a = c === null || c === void 0 ? void 0 : c.twitterScreenName) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase()) === (handle === null || handle === void 0 ? void 0 : handle.toLocaleUpperCase()); });
    return (0, response_1.response)(company);
});
exports.getCompanyByTwitterHandle = getCompanyByTwitterHandle;
const getDataAnalysis = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {};
    return (0, response_1.response)(data);
});
//# sourceMappingURL=getCompanyHandler.js.map