# Публикация ноды OpenSERP в npm

## Подготовка к публикации

1. **Убедитесь, что все изменения закоммичены**:
   ```bash
   git add .
   git commit -m "Ready for publishing"
   git push
   ```

2. **Проверьте версию в package.json**:
   ```json
   {
     "name": "n8n-nodes-openserp",
     "version": "1.0.0"
   }
   ```

3. **Соберите проект**:
   ```bash
   npm run build
   ```

4. **Проверьте, что все файлы в порядке**:
   ```bash
   ls -la dist/
   ```

## Публикация

1. **Войдите в npm** (если еще не вошли):
   ```bash
   npm login
   ```

2. **Опубликуйте пакет**:
   ```bash
   npm publish
   ```

3. **Проверьте публикацию**:
   - Перейдите на https://www.npmjs.com/package/n8n-nodes-openserp
   - Убедитесь, что пакет появился

## Обновление версии

Для публикации новой версии:

1. **Обновите версию в package.json**:
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

2. **Опубликуйте снова**:
   ```bash
   npm publish
   ```

## Проверка установки

После публикации проверьте установку:

1. **В новой директории**:
   ```bash
   mkdir test-installation
   cd test-installation
   npm init -y
   npm install n8n-nodes-openserp
   ```

2. **Проверьте структуру**:
   ```bash
   ls node_modules/n8n-nodes-openserp/
   ```

## Интеграция с n8n

После успешной публикации:

1. **Пользователи могут установить через интерфейс n8n**:
   - Settings → Community Nodes
   - Install a community node
   - Ввести: `n8n-nodes-openserp`

2. **Или через npm**:
   ```bash
   npm install n8n-nodes-openserp
   ```

3. **Перезапустить n8n**

## Тестирование после публикации

1. **Создайте тестовый workflow** в n8n
2. **Добавьте ноду OpenSERP**
3. **Настройте учетные данные**
4. **Выполните тестовый поиск**

## Решение проблем

### Если публикация не удалась

1. **Проверьте имя пакета**:
   ```bash
   npm view n8n-nodes-openserp
   ```

2. **Проверьте, что имя не занято**:
   ```bash
   npm view n8n-nodes-openserp
   ```

3. **Проверьте аутентификацию**:
   ```bash
   npm whoami
   ```

### Если нода не появляется в n8n

1. **Проверьте установку**:
   ```bash
   npm list n8n-nodes-openserp
   ```

2. **Проверьте структуру dist/**:
   ```bash
   ls -la dist/nodes/OpenSERP/
   ls -la dist/credentials/OpenSERPApi/
   ```

3. **Перезапустите n8n с очисткой кэша**:
   ```bash
   rm -rf ~/.n8n
   # Запустите n8n снова
   ```

## Автоматизация публикации

Для автоматизации можно использовать GitHub Actions:

1. **Создайте файл .github/workflows/publish.yml**
2. **Настройте секреты в GitHub**:
   - NPM_TOKEN
   - GITHUB_TOKEN

3. **Автоматическая публикация при создании тега**:
   ```yaml
   name: Publish to npm
   on:
     push:
       tags:
         - 'v*'
   jobs:
     publish:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16'
             registry-url: 'https://registry.npmjs.org'
         - run: npm ci
         - run: npm run build
         - run: npm publish
           env:
             NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```

## Поддержка пользователей

После публикации:

1. **Отвечайте на вопросы** в GitHub Issues
2. **Обновляйте документацию**
3. **Выпускайте новые версии** с исправлениями
4. **Собирайте обратную связь** для улучшений

## Полезные ссылки

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [npm Publishing Documentation](https://docs.npmjs.com/cli/v8/commands/publish)
- [Semantic Versioning](https://semver.org/)