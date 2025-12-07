"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenSERP = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const axios_1 = __importDefault(require("axios"));
class OpenSERP {
    constructor() {
        this.description = {
            displayName: 'OpenSERP',
            name: 'openSERP',
            group: ['transform'],
            version: 1,
            description: 'Search across multiple search engines using OpenSERP API',
            defaults: {
                name: 'OpenSERP',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'openSERPApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Search',
                            value: 'search',
                            description: 'Search for web results',
                        },
                        {
                            name: 'Image Search',
                            value: 'imageSearch',
                            description: 'Search for images',
                        },
                        {
                            name: 'Get Engines',
                            value: 'getEngines',
                            description: 'Get available search engines',
                        },
                    ],
                    default: 'search',
                },
                {
                    displayName: 'Search Engine',
                    name: 'engine',
                    type: 'options',
                    options: [
                        {
                            name: 'Google',
                            value: 'google',
                        },
                        {
                            name: 'Yandex',
                            value: 'yandex',
                        },
                        {
                            name: 'Bing',
                            value: 'bing',
                        },
                        {
                            name: 'Baidu',
                            value: 'baidu',
                        },
                        {
                            name: 'DuckDuckGo',
                            value: 'duck',
                        },
                        {
                            name: 'All (Mega Search)',
                            value: 'mega',
                        },
                    ],
                    default: 'yandex',
                    displayOptions: {
                        show: {
                            operation: ['search', 'imageSearch'],
                        },
                    },
                },
                {
                    displayName: 'Search Query',
                    name: 'query',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['search', 'imageSearch'],
                        },
                    },
                    default: '',
                    description: 'The search query to execute',
                },
                {
                    displayName: 'Language',
                    name: 'lang',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['search', 'imageSearch'],
                        },
                    },
                    default: 'ru',
                    description: 'Language code (e.g., ru, en, es)',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: ['search', 'imageSearch'],
                        },
                    },
                    default: 10,
                    description: 'Maximum number of results to return',
                },
                {
                    displayName: 'Site',
                    name: 'site',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['search', 'imageSearch'],
                        },
                    },
                    default: '',
                    description: 'Search only on specific site',
                },
                {
                    displayName: 'File Type',
                    name: 'filetype',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['search', 'imageSearch'],
                        },
                    },
                    default: '',
                    description: 'File extension to search (e.g., pdf, doc)',
                },
                {
                    displayName: 'Date Range',
                    name: 'dateRange',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['search', 'imageSearch'],
                        },
                    },
                    default: '',
                    description: 'Date range in format YYYYMMDD..YYYYMMDD',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        const credentials = await this.getCredentials('openSERPApi');
        const apiUrl = credentials.apiUrl;
        const apiKey = credentials.apiKey;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        if (apiKey) {
            headers['X-API-Key'] = apiKey;
        }
        for (let i = 0; i < items.length; i++) {
            try {
                let responseData;
                if (operation === 'getEngines') {
                    const response = await axios_1.default.get(`${apiUrl}/mega/engines`, { headers });
                    responseData = response.data;
                }
                else if (operation === 'search' || operation === 'imageSearch') {
                    const engine = this.getNodeParameter('engine', i);
                    const query = this.getNodeParameter('query', i);
                    const lang = this.getNodeParameter('lang', i);
                    const limit = this.getNodeParameter('limit', i);
                    const site = this.getNodeParameter('site', i);
                    const filetype = this.getNodeParameter('filetype', i);
                    const dateRange = this.getNodeParameter('dateRange', i);
                    const endpoint = operation === 'search' ? 'search' : 'image';
                    let url = `${apiUrl}/${engine}/${endpoint}?text=${encodeURIComponent(query)}`;
                    if (lang)
                        url += `&lang=${lang}`;
                    if (limit)
                        url += `&limit=${limit}`;
                    if (site)
                        url += `&site=${site}`;
                    if (filetype)
                        url += `&file=${filetype}`;
                    if (dateRange)
                        url += `&date=${dateRange}`;
                    const response = await axios_1.default.get(url, { headers });
                    if (Array.isArray(response.data)) {
                        responseData = { results: response.data };
                    }
                    else {
                        responseData = response.data;
                    }
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
                returnData.push({
                    json: responseData,
                });
            }
            catch (error) {
                if (error instanceof n8n_workflow_1.NodeOperationError) {
                    throw error;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
            }
        }
        return [returnData];
    }
}
exports.OpenSERP = OpenSERP;
//# sourceMappingURL=OpenSERP.node.js.map