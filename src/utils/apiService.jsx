// src/utils/apiService.js

// ВАША НОВАЯ ССЫЛКА НА РЕСУРС
const API_URL = 'https://8ef68bf520424b69.mokky.dev/podskazka';

export const searchVideos = async (query) => {
    if (!query) return [];

    try {
        // ИЗМЕНЕНИЕ: Убрали первую звездочку (*).
        // Было: ?text=*${query}* (искать везде)
        // Стало: ?text=${query}* (искать только слова, начинающиеся с этого запроса)
        const response = await fetch(`${API_URL}?text=${query}*`);

        if (!response.ok) {
            throw new Error('Ошибка сети');
        }

        const data = await response.json();

        // Превращаем массив объектов в массив строк
        const suggestions = data.map(item => item.text);

        // Возвращаем первые 12 результатов
        return suggestions.slice(0, 12);

    } catch (error) {
        console.error("Ошибка поиска:", error);
        return [];
    }
};