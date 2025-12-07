"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenSERPApi = void 0;
class OpenSERPApi {
    constructor() {
        this.name = 'openSERPApi';
        this.displayName = 'OpenSERP API';
        this.documentationUrl = 'https://github.com/sergeevgit1/openserp';
        this.properties = [
            {
                displayName: 'API URL',
                name: 'apiUrl',
                type: 'string',
                default: 'https://your-openserp-instance.com',
                required: true,
                description: 'URL of the OpenSERP API service',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'API Key for authentication (if required)',
            },
        ];
        this.test = {
            request: {
                baseURL: '={{$credentials.apiUrl}}',
                url: '/mega/engines',
                method: 'GET',
            },
        };
    }
    async authenticate(credentials, request) {
        // Add API key to headers if provided
        if (credentials.apiKey) {
            if (!request.headers) {
                request.headers = {};
            }
            request.headers['X-API-Key'] = credentials.apiKey;
        }
        // Set default headers
        if (!request.headers) {
            request.headers = {};
        }
        request.headers['Content-Type'] = 'application/json';
        request.headers['Accept'] = 'application/json';
        return request;
    }
}
exports.OpenSERPApi = OpenSERPApi;
//# sourceMappingURL=OpenSERPApi.credentials.js.map