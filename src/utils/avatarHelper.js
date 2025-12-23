// src/utils/avatarHelper.js
// Утилита для работы с аватарами из папки ava

// Список всех аватаров (92 файла) - перемешанный порядок
const avatarFiles = [
    "WhatsApp Image 2025-12-22 at 02.40.59.jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.32 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.01 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.53 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.26 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.03 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.55 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.29 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.26 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.57 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.24 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.00 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.52 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.31 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.02.jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.54 (4).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.27 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.03 (4).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.58 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.28 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.01 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.56 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.30 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.26.jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.59 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.23.jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.03 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.52 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.26 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.02 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.54 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.32 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.00 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.57 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.29 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.25.jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.55 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.31 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.01 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.53 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.27 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.03 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.58 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.24 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.02 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.56 (4).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.28 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.00.jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.59 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.30 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.26 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.52 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.25.jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.03.jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.54 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.26 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.02 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.57 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.32 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.01.jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.55 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.29 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.26 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.58 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.23 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.00 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.56 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.31 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.25 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.53 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.27 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.01 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.54 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.28 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.03 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.56 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.30 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.02 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.59 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.24.jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.26 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.52.jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.33.jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.03 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.53.jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.26.jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.01 (1).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.54.jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.27.jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.00 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.55.jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.28.jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.26 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.56.jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.30.jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.03 (3).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.57.jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.31.jpeg",
    "WhatsApp Image 2025-12-22 at 02.41.02 (2).jpeg",
    "WhatsApp Image 2025-12-22 at 02.40.58.jpeg",
    "WhatsApp Image 2025-12-22 at 02.42.32.jpeg"
];

// Функция для получения аватара на основе seed (детерминированно, но с максимально случайным распределением)
export const getAvatar = (seed) => {
    let hash1 = 5381; // djb2 начальное значение
    let hash2 = 0;    // SDBM начальное значение
    let hash3 = 2166136261; // FNV-1a начальное значение
    
    if (typeof seed === 'string') {
        // Проходим по строке тремя разными алгоритмами одновременно
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            
            // djb2 алгоритм
            hash1 = ((hash1 << 5) + hash1) + char;
            
            // SDBM алгоритм
            hash2 = char + (hash2 << 6) + (hash2 << 16) - hash2;
            
            // FNV-1a алгоритм
            hash3 ^= char;
            hash3 += (hash3 << 1) + (hash3 << 4) + (hash3 << 7) + (hash3 << 8) + (hash3 << 24);
        }
        
        // Комбинируем все три хеша
        let combined = hash1 ^ hash2 ^ hash3;
        
        // Добавляем информацию о позициях символов для большего разнообразия
        for (let i = 0; i < Math.min(seed.length, 10); i++) {
            combined = combined ^ (seed.charCodeAt(i) * (i + 1) * 0x517cc1b7);
        }
        
        // Финальное смешивание через несколько раундов
        combined = combined ^ (combined >>> 15);
        combined = combined * 0x2c1b3c6d;
        combined = combined ^ (combined >>> 12);
        combined = combined * 0x297a2d39;
        combined = combined ^ (combined >>> 15);
        combined = combined ^ (combined << 7);
        combined = combined ^ (combined >>> 3);
        combined = combined ^ (combined << 11);
        
        hash1 = combined;
        
    } else if (typeof seed === 'number') {
        hash1 = seed;
        hash1 = hash1 ^ (hash1 >>> 15);
        hash1 = hash1 * 0x2c1b3c6d;
        hash1 = hash1 ^ (hash1 >>> 12);
        hash1 = hash1 * 0x297a2d39;
        hash1 = hash1 ^ (hash1 >>> 15);
        hash1 = hash1 ^ (hash1 << 7);
        hash1 = hash1 ^ (hash1 >>> 3);
        hash1 = hash1 ^ (hash1 << 11);
    }
    
    // Используем умножение на большое простое число и модуль для равномерного распределения
    const largePrime = 2147483647; // Большое простое число (2^31 - 1)
    const absHash = Math.abs(hash1) >>> 0;
    const scaled = (absHash * largePrime) >>> 0;
    const index = scaled % avatarFiles.length;
    
    const fileName = avatarFiles[index];
    
    // Кодируем имя файла для URL (на случай специальных символов)
    const encodedFileName = encodeURIComponent(fileName);
    
    return `/ava/${encodedFileName}`;
};

// Функция для получения случайного аватара (без seed)
export const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatarFiles.length);
    const fileName = avatarFiles[randomIndex];
    const encodedFileName = encodeURIComponent(fileName);
    return `/ava/${encodedFileName}`;
};
