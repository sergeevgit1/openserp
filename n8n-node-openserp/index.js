"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialClasses = exports.nodeClasses = void 0;
const OpenSERP_node_1 = require("./nodes/OpenSERP/OpenSERP.node");
const OpenSERPApi_credentials_1 = require("./credentials/OpenSERPApi/OpenSERPApi.credentials");
exports.nodeClasses = [
    OpenSERP_node_1.OpenSERP,
];
exports.credentialClasses = [
    OpenSERPApi_credentials_1.OpenSERPApi,
];
//# sourceMappingURL=index.js.map