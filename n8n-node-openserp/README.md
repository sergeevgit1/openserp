# n8n-nodes-openserp

This is an n8n community node package that provides integration with the OpenSERP search engine API.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n documentation.

## Usage

### Search with OpenSERP

The OpenSERP node allows you to search across multiple search engines including Google, Yandex, Bing, Baidu, and DuckDuckGo.

#### Operations

1. **Search**: Search for web results
2. **Image Search**: Search for images
3. **Get Engines**: Get available search engines

#### Parameters

- **Search Engine**: Choose from Google, Yandex, Bing, Baidu, DuckDuckGo, or All (Mega Search)
- **Search Query**: The search query to execute (required)
- **Language**: Language code (e.g., ru, en, es)
- **Limit**: Maximum number of results to return (default: 10)
- **Site**: Search only on specific site (optional)
- **File Type**: File extension to search (e.g., pdf, doc) (optional)
- **Date Range**: Date range in format YYYYMMDD..YYYYMMDD (optional)

#### Example Usage

1. **Basic Search**:
   - Operation: Search
   - Search Engine: Yandex
   - Search Query: "Экономическая безопасность"
   - Language: ru
   - Limit: 10

2. **Site-specific Search**:
   - Operation: Search
   - Search Engine: Google
   - Search Query: "machine learning"
   - Site: "arxiv.org"
   - Limit: 5

3. **Image Search**:
   - Operation: Image Search
   - Search Engine: Yandex
   - Search Query: "nature"
   - Limit: 15

4. **Mega Search**:
   - Operation: Search
   - Search Engine: All (Mega Search)
   - Search Query: "artificial intelligence"
   - Limit: 20

## Credentials

To use the OpenSERP node, you need to configure the OpenSERP API credentials:

1. **API URL**: URL of the OpenSERP API service (default: https://your-openserp-instance.com)
2. **API Key**: API Key for authentication (if required)

## Output

The node returns search results in the following format:

```json
{
  "results": [
    {
      "rank": 1,
      "url": "https://example.com/page1",
      "title": "Page Title",
      "description": "Page description",
      "ad": false,
      "engine": "yandex" // Only for mega search
    },
    // ... more results
  ]
}
```

For the "Get Engines" operation, the output format is:

```json
{
  "engines": [
    {
      "name": "google",
      "initialized": true
    },
    {
      "name": "yandex",
      "initialized": true
    }
    // ... more engines
  ],
  "total": 2
}
```

## Development

To build the package:

```bash
npm install
npm run build
```

To run in development mode:

```bash
npm run dev
```

To run tests:

```bash
npm test
```

## License

MIT