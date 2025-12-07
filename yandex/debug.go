package yandex

import (
	"fmt"
	"os"
	"time"

	"github.com/go-rod/rod"
)

func DebugYandexSearch() {
	// Создаем браузер
	browser := rod.New().
		MustConnect().
		MustIgnoreCertErrors(true)

	// Создаем новую страницу
	page := browser.MustPage()

	// Устанавливаем пользовательский агент, чтобы имитировать обычный браузер
	page.MustEval(`() => {
		Object.defineProperty(navigator, 'webdriver', {
			get: () => undefined,
		});
	}`)

	// Открываем страницу поиска Яндекса
	fmt.Println("Открытие страницы поиска Яндекса...")
	page.MustNavigate("https://www.yandex.com/search/?text=golang")

	// Ждем загрузки страницы
	page.MustWaitLoad()

	// Ждем немного, чтобы страница полностью загрузилась
	time.Sleep(3 * time.Second)

	// Делаем скриншот для визуальной проверки
	page.MustScreenshot("yandex_search.png")

	// Получаем HTML страницы и сохраняем в файл
	html := page.MustHTML()
	err := os.WriteFile("yandex_search.html", []byte(html), 0644)
	if err != nil {
		fmt.Printf("Ошибка при сохранении HTML: %v\n", err)
	}

	// Ищем элементы с результатами поиска
	fmt.Println("Поиск элементов результатов поиска...")
	
	// Пробуем найти старые элементы
	oldElements := page.MustElements("li.serp-item")
	fmt.Printf("Найдено старых элементов li.serp-item: %d\n", len(oldElements))

	// Пробуем найти заголовки h2
	h2Elements := page.MustElements("h2")
	fmt.Printf("Найдено заголовков h2: %d\n", len(h2Elements))

	// Пробуем найти другие возможные контейнеры с результатами
	possibleContainers := []string{
		"li[data-cid]",
		"div.organic",
		"div.serp-item",
		"div.Organic",
		"li[data-cid]",
	}

	for _, selector := range possibleContainers {
		elements := page.MustElements(selector)
		found := len(elements)
		if found > 0 {
			fmt.Printf("Найдено элементов с селектором '%s': %d\n", selector, found)
		}
	}

	// Пробуем найти заголовки в разных контейнерах
	titleSelectors := []string{
		"h2",
		"h3",
		"a > h2",
		"a > h3",
		".organic__title",
		".OrganicTitle",
		".serp-item__title",
		"[data-cid] h2",
		"[data-cid] h3",
	}

	for _, selector := range titleSelectors {
		elements := page.MustElements(selector)
		found := len(elements)
		if found > 0 {
			fmt.Printf("Найдено заголовков с селектором '%s': %d\n", selector, found)
			
			// Выводим первые несколько заголовков для примера
			for i := 0; i < min(3, len(elements)); i++ {
				title := elements[i].MustText()
				fmt.Printf("  Пример заголовка %d: %s\n", i+1, title)
			}
		}
	}

	fmt.Println("Анализ завершен. HTML сохранен в yandex_search.html для дальнейшего изучения.")
	
	// Не закрываем браузер сразу, чтобы можно было посмотреть
	time.Sleep(2 * time.Second)
	browser.MustClose()
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}