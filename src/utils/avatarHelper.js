// src/utils/avatarHelper.js
// Утилита для генерации аватаров через API

// Функция для получения аватара на основе seed (детерминированно)
export const getAvatar = (seed) => {
    if (!seed) seed = 'user';
    
    // Используем UI Avatars API для генерации аватаров на основе имени
    const name = String(seed).substring(0, 2).toUpperCase();
    const colors = [
        'FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8',
        'F7DC6F', 'BB8FCE', '85C1E2', 'F8B739', '52BE80',
        'E74C3C', '3498DB', '9B59B6', '1ABC9C', 'F39C12'
    ];
    
    // Генерируем индекс цвета на основе seed
    let hash = 0;
    const seedStr = String(seed);
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    const bgColor = colors[colorIndex];
    
    // Используем UI Avatars API
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=128&bold=true`;
};

// Функция для получения случайного аватара
export const getRandomAvatar = () => {
    const randomName = Math.random().toString(36).substring(7);
    return getAvatar(randomName);
};
