# Исправление ошибки загрузки пакета n8n-nodes-openserp

## Проблема

При установке пакета n8n-nodes-openserp появляется ошибка:
```
Error loading package "n8n-nodes-openserp" :The specified package could not be loaded
Cause: Cannot find module '/home/node/.n8n/nodes/node_modules/n8n-nodes-openserp/dist/credentials/OpenSERPApi.credentials.js'
```

## Решение

### Вариант 1: Установка через npm (рекомендуется)

1. Остановите n8n
2. Установите последнюю версию пакета:
   ```bash
   npm install n8n-nodes-openserp@1.0.4
   ```
3. Перезапустите n8n

### Вариант 2: Установка из исходного кода

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/sergeevgit1/openserp.git
   cd openserp/n8n-node-openserp
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Скомпилируйте TypeScript в JavaScript:
   ```bash
   npm run build
   ```
   > Эта команда создаст директорию `dist` с необходимыми JavaScript файлами

4. Создайте символическую ссылку в директории n8n:
   ```bash
   npm link
   cd ~/.n8n
   npm link n8n-nodes-openserp
   ```

5. Перезапустите n8n

### Вариант 3: Локальная установка без символических ссылок

1. Перейдите в директорию с исходным кодом:
   ```bash
   cd openserp/n8n-node-openserp
   ```

2. Выполните шаги 1-3 из Варианта 2

3. Скопируйте директорию в n8n:
   ```bash
   cp -r . ~/.n8n/nodes/node_modules/n8n-nodes-openserp
   ```

4. Перезапустите n8n

## Проверка

После установки убедитесь, что следующие файлы существуют:
- `~/.n8n/nodes/node_modules/n8n-nodes-openserp/dist/index.js`
- `~/.n8n/nodes/node_modules/n8n-nodes-openserp/dist/credentials/OpenSERPApi/OpenSERPApi.credentials.js`
- `~/.n8n/nodes/node_modules/n8n-nodes-openserp/dist/nodes/OpenSERP/OpenSERP.node.js`

## Исправления в версии 1.0.4

Версия 1.0.4 включает следующие исправления:
- Исправлена структура package.json в соответствии с требованиями n8n
- Файлы теперь корректно размещаются в директории dist
- Пути к credential и node файлам указаны правильно

## Дополнительная информация

Более подробная информация об использовании ноды доступна в файле [`INSTALLATION.md`](INSTALLATION.md).