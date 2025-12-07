import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	JsonObject,
} from 'n8n-workflow';

import axios from 'axios';

export class OpenSERP implements INodeType {
	description: INodeTypeDescription = {
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('openSERPApi');

		const apiUrl = credentials.apiUrl as string;
		const apiKey = credentials.apiKey as string;

		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		};

		if (apiKey) {
			headers['X-API-Key'] = apiKey;
		}

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: JsonObject;

				if (operation === 'getEngines') {
					const response = await axios.get(`${apiUrl}/mega/engines`, { headers });
					responseData = response.data;
				} else if (operation === 'search' || operation === 'imageSearch') {
					const engine = this.getNodeParameter('engine', i) as string;
					const query = this.getNodeParameter('query', i) as string;
					const lang = this.getNodeParameter('lang', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const site = this.getNodeParameter('site', i) as string;
					const filetype = this.getNodeParameter('filetype', i) as string;
					const dateRange = this.getNodeParameter('dateRange', i) as string;

					const endpoint = operation === 'search' ? 'search' : 'image';
					let url = `${apiUrl}/${engine}/${endpoint}?text=${encodeURIComponent(query)}`;
					
					if (lang) url += `&lang=${lang}`;
					if (limit) url += `&limit=${limit}`;
					if (site) url += `&site=${site}`;
					if (filetype) url += `&file=${filetype}`;
					if (dateRange) url += `&date=${dateRange}`;

					const response = await axios.get(url, { headers });
					
					if (Array.isArray(response.data)) {
						responseData = { results: response.data };
					} else {
						responseData = response.data;
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
				}

				returnData.push({
					json: responseData,
				});
			} catch (error) {
				if (error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeOperationError(this.getNode(), error as Error);
			}
		}

		return [returnData];
	}
}