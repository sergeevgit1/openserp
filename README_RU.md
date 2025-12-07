# OpenSERP (Search Engine Results Page)

![OpenSERP](/logo.svg)

[![Go Report Card](https://goreportcard.com/badge/github.com/karust/openserp)](https://goreportcard.com/report/github.com/karust/openserp)
[![Go Reference](https://pkg.go.dev/badge/github.com/karust/openserp?style=for-the-badge)](https://pkg.go.dev/github.com/karust/openserp)
[![release](https://img.shields.io/github/release/karust/openserp)](https://github.com/karust/openserp/releases)

<!--[![Docker Pulls](https://img.shields.io/docker/pulls/karust/openserp)](https://hub.docker.com/repository/docker/karust/openserp)-->

**OpenSERP** предоставляет бесплатный доступ к API для нескольких поисковых систем, включая **[Google, Yandex, Baidu, Bing, DuckDuckGo]**. Получайте комплексные результаты поиска без дорогих подписок на API!

## Возможности

- 🔍 **Поддержка нескольких поисковых систем**: Google, Yandex, Baidu, Bing, DuckDuckGo...
- 🌐 **Мегапоиск**: Агрегация результатов из нескольких поисковых систем одновременно
- 🖼 **Изображения**: Также доступен поиск изображений!
- 🎯 **Расширенная фильтрация**: Язык, диапазон дат, тип файла, поиск по конкретным сайтам
- 🌍 **Поддержка прокси**: Поддержка HTTP/SOCKS5 прокси
- 🐳 **Готов к работе с Docker**: Лёгкое развёртывание с помощью Docker

## Быстрый старт ⚡️

### Docker (Рекомендуется)

```bash
# Запуск API-сервера через готовый образ
docker run -p 127.0.0.1:7000:7000 -it karust/openserp serve -a 0.0.0.0 -p 7000

# Или используйте docker-compose
docker compose up --build
```

### Из исходного кода

```bash
# Клонирование и сборка
git clone https://github.com/karust/openserp.git
cd openserp
go build -o openserp .

# Запуск сервера
./openserp serve
```

## 🌐 Мегапоиск и Мегаизображения - ищите всё сразу!

**Мегапоиск** агрегирует результаты из нескольких поисковых систем одновременно с автоматическим удалением дубликатов. **Мегаизображения** делает то же самое для поиска изображений!

### Мегапоиск (веб-результаты)

```bash
# Поиск по ВСЕМ поисковым системам сразу
curl "http://localhost:7000/mega/search?text=golang&limit=10"

# Выбор конкретных поисковых систем
curl "http://localhost:7000/mega/search?text=golang&engines=duckduckgo,bing&limit=15"

# Расширенная фильтрация
curl "http://localhost:7000/mega/search?text=Donald+Trump&engines=duckduckgo,bing&limit=20&date=20251005..20251005&lang=EN"
```

- Пример ответа API:

```json
[
  {
    "rank": 1,
    "url": "https://en.wikipedia.org/wiki/Golden_Retriever",
    "title": "Golden Retriever - Wikipedia",
    "description": "The Golden Retriever is a Scottish breed of retriever dog of medium size. It is characterised by a gentle and affectionate nature and a striking golden coat. It is a working dog, and registration is subject to successful completion of a working trial. [2] It is commonly kept as a companion dog and is among the most frequently registered breeds in several Western countries; some may compete in ...",
    "ad": false,
    "engine": "duckduckgo"
  },
  {
    "rank": 2,
    "url": "https://www.bing.com/ck/a?!&&p=6f15ac4589858d0a104cd6f55cc8e91e8d8d6da91f905b626921f67f2323a467JmltdHM9MTc1OTE5MDQwMA&ptn=3&ver=2&hsh=4&fclid=2357c2f4-6131-68de-359f-d48c607c691d&u=a1aHR0cHM6Ly93d3cuZ29sZGVucmV0cmlldmVyZm9ydW0uY29tL3RocmVhZHMvdW5kZXJzdGFuZGluZy13aHktZ29sZGVuLXJldHJpZXZlciVFMiU4MCU5OXMtbGlmZXNwYW4taGFsdmVkLWluLXRoZS1sYXN0LTM1LXllYXJzLjM1NzMyMi8&ntb=1",
    "title": "Golden Retriever Dog Forums\nhttps://www.goldenretrieverforum.com › threads › understanding-why-g…",
    "description": "Oct 20, 2024 · Back in the 1970s, Golden Retrievers routinely lived until 16 and 17 years old, they are now living until 9 or 10 years old. Golden Retrievers seem to be dying mostly of bone …",
    "ad": false,
    "engine": "bing"
  },
  {
    "rank": 3,
    "url": "http://www.baidu.com/link?url=2544q3ugc68j0scVxdpWCSX-gl2AmuCy1l7uRR3loIfS1hmJWMiJKW4MDGWoZrLE7X-ybu1L7T8PspoL7iy_dK",
    "title": "golden retrievers是什么意思_golden retrievers怎么读_解释_用法...",
    "description": "\n\n2025年9月21日golden retrievers 读音:美英 golden retrievers基本解释 金毛猎犬 分词解释 golden金(黄)色的 retrievers寻猎物犬( retriever的名词复数 ) 词组短语 golden retrieversfor sale出售金毛寻回犬 golden retrieversnear me我附近的金毛寻回犬 golden retrieverspuppies金毛寻回犬幼犬...\ndanci.gei6.com/golden...retrievers...",
    "ad": false,
    "engine": "baidu"
  }
]
```

### Мегаизображения (результаты изображений)

```bash
# Поиск изображений по ВСЕМ поисковым системам
curl "http://localhost:7000/mega/image?text=golang logo&limit=20"
```

### Доступные поисковые системы

```bash
# Проверка доступных поисковых систем
curl "http://localhost:7000/mega/engines"
```

**Доступные поисковые системы:** `google`, `yandex`, `baidu`, `bing`, `duckduckgo`

## 🔍 API отдельных поисковых систем

### Параметры поиска

| Параметр | Описание             | Пример                           |
| --------- | -------------------- | --------------------------------- |
| `text`    | Поисковый запрос     | `golang programming`              |
| `lang`    | Код языка            | `EN`, `DE`, `RU`, `ES`            |
| `date`    | Диапазон дат         | `20230101..20231231`              |
| `file`    | Расширение файла     | `PDF`, `DOC`, `XLS`               |
| `site`    | Поиск по сайту       | `github.com`, `stackoverflow.com` |
| `limit`   | Количество результатов| `10`, `25`, `50`                  |
| `answers` | Включить результаты Q&A | `true`, `false`                   |

### Примеры использования отдельных поисковых систем

```bash
# Поиск в DuckDuckGo
curl "http://localhost:7000/duck/search?text=golang&limit=7"

# Поиск в Google
curl "http://localhost:7000/google/search?text=golang&lang=EN&limit=10"
```

### Поиск изображений

```bash
# Изображения Bing
curl "http://localhost:7000/bing/image?text=golang&limit=20"

# Изображения Baidu
curl "http://localhost:7000/baidu/image?text=golang&limit=15"
```

## 🌐 Поддержка прокси

OpenSERP поддерживает HTTP и SOCKS5 прокси с аутентификацией:

```bash
# SOCKS5 прокси
./openserp serve --proxy socks5://127.0.0.1:1080

# HTTP прокси с аутентификацией
./openserp search bing "query" --proxy http://user:pass@127.0.0.1:8080
```

## Лицензия

Этот проект лицензирован под лицензией MIT - подробности смотрите в файле [LICENSE](LICENSE).

## 🤝 Участие в разработке

Вклады приветствуются! Не стесняйтесь отправлять Pull Request.

## 👾 Проблемы и поддержка

Если вы столкнулись с какими-либо проблемами или у вас есть вопросы:

- Откройте проблему на GitHub
- Проверьте существующие проблемы на наличие решений
- Ознакомьтесь с документацией выше