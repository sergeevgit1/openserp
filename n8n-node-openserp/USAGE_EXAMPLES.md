# Примеры использования ноды OpenSERP для n8n

## Базовые примеры

### 1. Простой поиск в Яндексе

```json
{
  "parameters": {
    "operation": "search",
    "engine": "yandex",
    "query": "Экономическая безопасность",
    "lang": "ru",
    "limit": 10
  }
}
```

### 2. Поиск изображений в Google

```json
{
  "parameters": {
    "operation": "imageSearch",
    "engine": "google",
    "query": "nature photography",
    "lang": "en",
    "limit": 15
  }
}
```

### 3. Получение доступных поисковых систем

```json
{
  "parameters": {
    "operation": "getEngines"
  }
}
```

## Продвинутые примеры

### 4. Поиск по конкретному сайту

```json
{
  "parameters": {
    "operation": "search",
    "engine": "google",
    "query": "machine learning algorithms",
    "site": "arxiv.org",
    "limit": 5
  }
}
```

### 5. Поиск документов PDF

```json
{
  "parameters": {
    "operation": "search",
    "engine": "yandex",
    "query": "отчет о финансовых результатах",
    "filetype": "pdf",
    "lang": "ru",
    "limit": 10
  }
}
```

### 6. Поиск с временным фильтром

```json
{
  "parameters": {
    "operation": "search",
    "engine": "google",
    "query": "коронавирус вакцина",
    "dateRange": "20230101..20231231",
    "lang": "ru",
    "limit": 20
  }
}
```

### 7. Мега-поиск по всем системам

```json
{
  "parameters": {
    "operation": "search",
    "engine": "mega",
    "query": "искусственный интеллект",
    "lang": "ru",
    "limit": 25
  }
}
```

## Примеры workflow

### Workflow 1: Мониторинг новостей

```
1. Schedule Trigger (каждый час)
2. OpenSERP Node (поиск новостей за последний день)
   - operation: search
   - engine: yandex
   - query: "новости экономики"
   - dateRange: {{ $now.format('YYYYMMDD') }}..{{ $now.format('YYYYMMDD') }}
   - limit: 10
3. Code Node (фильтрация новых ссылок)
4. Webhook Node (отправка уведомлений)
```

### Workflow 2: Анализ конкурентов

```
1. Manual Trigger
2. OpenSERP Node (поиск по бренду)
   - operation: search
   - engine: mega
   - query: "конкурент бренд"
   - limit: 50
3. Code Node (анализ результатов)
4. Google Sheets Node (сохранение данных)
```

### Workflow 3: Контент-маркетинг

```
1. Form Trigger (ввод ключевого слова)
2. OpenSERP Node (поиск по ключевику)
   - operation: search
   - engine: yandex
   - query: {{ $json.keyword }}
   - limit: 20
3. Code Node (анализ топ-10 результатов)
4. OpenAI Node (генерация идей контента)
5. Email Node (отправка отчета)
```

## Примеры обработки результатов

### Фильтрация рекламных объявлений

```javascript
// В Code Node
const results = $input.all()[0].json.results;
const organicResults = results.filter(result => !result.ad);
return organicResults;
```

### Группировка по доменам

```javascript
const results = $input.all()[0].json.results;
const domainGroups = {};

results.forEach(result => {
  const domain = new URL(result.url).hostname;
  if (!domainGroups[domain]) {
    domainGroups[domain] = [];
  }
  domainGroups[domain].push(result);
});

return domainGroups;
```

### Извлечение контактов

```javascript
const results = $input.all()[0].json.results;
const contactInfo = results.map(result => {
  return {
    title: result.title,
    url: result.url,
    description: result.description,
    email: result.description.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi)?.[0] || '',
    phone: result.description.match(/\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/g)?.[0] || ''
  };
}).filter(item => item.email || item.phone);

return contactInfo;
```

## Интеграция с другими сервисами

### Отправка в Telegram

```javascript
const results = $input.all()[0].json.results.slice(0, 5);
const message = results.map((result, index) => 
  `${index + 1}. ${result.title}\n${result.url}\n${result.description}`
).join('\n\n');

return {
  chat_id: 'YOUR_CHAT_ID',
  text: `🔍 Результаты поиска:\n\n${message}`
};
```

### Сохранение в Google Sheets

```javascript
const results = $input.all()[0].json.results;
const rows = results.map(result => [
  result.rank,
  result.title,
  result.url,
  result.description,
  result.engine || '',
  new Date().toISOString()
]);

return rows;
```

### Создание отчета в Markdown

```javascript
const results = $input.all()[0].json.results;
const query = $('OpenSERP').json.query;
const engine = $('OpenSERP').json.engine;

const report = `# Отчет по поиску: "${query}"

**Поисковая система:** ${engine}
**Количество результатов:** ${results.length}
**Дата:** ${new Date().toLocaleDateString('ru-RU')}

## Результаты

${results.map(result => `
### ${result.rank}. ${result.title}

**URL:** ${result.url}
**Описание:** ${result.description}
${result.ad ? '**Реклама**' : '**Органический результат**'}
---
`).join('')}

---
*Отчет создан с помощью OpenSERP и n8n*
`;

return { report };
```

## Оптимизация производительности

### Кэширование результатов

```javascript
const cacheKey = `search_${$json.query}_${$json.engine}_${$json.limit}`;
const cached = await $cache.get(cacheKey);

if (cached) {
  return cached;
}

const results = await $http.get(`https://api.openserp.com/search?q=${$json.query}`);
await $cache.set(cacheKey, results.data, { ttl: 3600 }); // 1 час

return results.data;
```

### Пагинация

```javascript
const query = $json.query;
const limit = 10;
const page = $json.page || 1;
const offset = (page - 1) * limit;

const results = await $http.get(`https://api.openserp.com/search?q=${query}&limit=${limit}&offset=${offset}`);

return {
  results: results.data.results,
  currentPage: page,
  totalPages: Math.ceil(results.data.total / limit),
  hasNextPage: page < Math.ceil(results.data.total / limit)
};
```

## Обработка ошибок

### Retry логика

```javascript
const maxRetries = 3;
const delay = 1000; // 1 секунда

for (let i = 0; i < maxRetries; i++) {
  try {
    const results = await $http.get('https://api.openserp.com/search?q=test');
    return results.data;
  } catch (error) {
    if (i === maxRetries - 1) throw error;
    await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
  }
}
```

### Обработка капчи

```javascript
try {
  const results = await $http.get('https://api.openserp.com/search?q=test');
  return results.data;
} catch (error) {
  if (error.response?.status === 403) {
    // Капча detected
    return {
      error: 'Captcha detected',
      message: 'Please wait before making another request',
      retryAfter: 300 // 5 минут
    };
  }
  throw error;
}
```

Эти примеры помогут вам создать мощные workflow для автоматизации поиска и анализа данных с помощью ноды OpenSERP в n8n.