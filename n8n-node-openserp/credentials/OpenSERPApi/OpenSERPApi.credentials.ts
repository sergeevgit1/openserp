import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export class OpenSERPApi implements ICredentialType {
	name = 'openSERPApi';
	displayName = 'OpenSERP API';
	documentationUrl = 'https://github.com/sergeevgit1/openserp';
	properties: INodeProperties[] = [
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
			description: 'API Key for authentication (optional)',
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		request: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		// Add API key to headers if provided
		if (credentials.apiKey) {
			if (!request.headers) {
				request.headers = {};
			}
			request.headers['X-API-Key'] = credentials.apiKey as string;
		}

		// Set default headers
		if (!request.headers) {
			request.headers = {};
		}
		request.headers['Content-Type'] = 'application/json';
		request.headers['Accept'] = 'application/json';

		return request;
	}

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/mega/engines',
			method: 'GET',
		},
	};
}