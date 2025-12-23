// src/utils/commentsGenerator.js
import { getAvatar } from './avatarHelper';

/* === БАЗА ДЛЯ ГЕНЕРАЦИИ НИКНЕЙМОВ === */
const prefixes = ["super", "mega", "just", "its", "real", "only", "the", "mr", "ms", "pro", "best", "epic", "cool", "true", "real"];
const names = ["alex", "ivan", "max", "dima", "kate", "alina", "nastya", "olya", "viktor", "sergey", "player", "gamer", "ninja", "shadow", "ghost", "kira", "artem", "nikita", "egor", "danya", "misha", "sasha", "dasha", "masha", "pasha", "liza", "mila", "sonya", "vanya", "tolya", "danil", "ilya", "vlad", "roman", "anton", "yulia", "maria", "anna"];
const suffixes = ["gaming", "plays", "official", "yt", "studio", "channel", "tv", "hub", "world", "fan", "love", "pro", "hd", "4k", "edit", "clips", "memes", "anime", "gaming", "shorts"];
const separators = ["", "_", ".", "", "", "_"];

const generateUsername = () => {
    const type = Math.random();
    const name = names[Math.floor(Math.random() * names.length)];
    const separator = separators[Math.floor(Math.random() * separators.length)];
    const number = Math.floor(Math.random() * 10000);

    if (type < 0.25) return `${name}${separator}${number}`;
    else if (type < 0.5) {
        const pref = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suff = suffixes[Math.floor(Math.random() * suffixes.length)];
        return `${pref}${separator}${name}${separator}${suff}`;
    } else if (type < 0.7) {
        const suff = suffixes[Math.floor(Math.random() * suffixes.length)];
        return `${name}${separator}${suff}`;
    } else if (type < 0.85) return `${name}${separator}Gaming${number}`;
    else if (type < 0.95) return `${name}${separator}YT${number}`;
    else return `user${Math.floor(Math.random() * 99999999)}`;
};

/* === БАЗА КОММЕНТАРИЕВ === */
const commentsBase = [
    // Птицы (birds.mp4) - про инструменты имитирующие гнездо
    "Как это так похоже на настоящих птенцов", "Мама кормит их так естественно", "Инструменты выглядят как живые", "Это гениально сделано", "Покажу друзьям", "Так реалистично", "Creative idea", "The mom bird is so caring", "This is genius", "Nature is amazing",
    
    // Diavolo (diavolo.mp4) - цикл смертей
    "Diavolo застрял в вечном цикле", "Requiem сделал свое дело", "Это наказание которое он заслужил", "Классический момент из Golden Wind", "Adventure Time начало было огонь", "Diavolo infinite death", "Best punishment ever", "He deserved this", "Golden Requiem power",
    
    // Fern (fern.mp4, fern2.mp4) - клон который не может найти себя
    "Fern так одинок в своем поиске", "Его экзистенциальный кризис разрывает сердце", "Он не виноват что родился клоном", "Adventure Time показывает такую глубокую историю", "Fern deserves better", "This is so sad", "Why Fern why", "Identity crisis hits hard",
    
    // Снайпер (Humanity's greatest sniper.mp4)
    "Белая Смерть легенда", "Симо Хяюхя настоящий герой", "Исторический персонаж в аниме", "Этот снайпер был невероятным", "White Death legend", "Simo Hayha was insane", "Historical accuracy", "This sniper is legendary",
    
    // Ичиго в Fortnite (ichigo.mp4)
    "Ичиго в Fortnite это мечта", "Bleach и Fortnite вместе наконец", "Fashion движения выглядят круто", "Какой же он стильный", "Ichigo crossover when", "Fortnite needs more anime", "This emote is fire", "Bleach in games",
    
    // Invincible (invincible.mp4) - эдиты и приколы
    "Invincible лучший супергеройский сериал", "Столько мемов из одного шоу", "Это стало культовым", "Invincible edits are top tier", "Best superhero show", "So many memes", "This show is wild",
    
    // JoJo трейлер Soundman (jjba.mp4)
    "Steel Ball Run анимация выглядит потрясающе", "Soundman интересный персонаж", "JoJo седьмой сезон будет легендой", "New JoJo part looks amazing", "Soundman ability is cool", "Steel Ball Run hype is real", "JoJo never disappoints",
    
    // Наруто (kaidzi.mp4) - айшоуспид про луффи vs наруто эдит
    "Айшоуспид сказал что луффи лучше но наруто доказывает обратное", "Этот эдит для наруто просто огонь", "Луффи крутой но наруто легенда", "Aishouspeed was wrong about this", "Naruto edit goes hard", "Luffy is great but Naruto is peak", "This edit proves Naruto supremacy", "Айшоуспид ошибся наруто топ", "Лучший эдит наруто который я видел",
    
    // Death Note прикол (L discovers that Light is Kira.mp4)
    "L и Light вечное противостояние", "Мемы из Death Note лучшие", "L гениальный детектив", "Light думал что его не поймают", "L vs Light forever", "Death Note memes are gold", "This anime is perfect", "Best detective story",
    
    // Omni-Man депрессия (omnimen.mp4)
    "Omni-Man показывает человеческую сторону", "Его внутренние конфликты так реальны", "Он все еще любит свою семью", "Omni-Man emotions hit different", "He still cares deep down", "This is so emotional", "Character development",
    
    // Голубь на самолете (tuffpigeon.mp4)
    "Голубь решил прокатиться на самолете", "Как он там удержался на скорости", "Смелость дикой природы", "Pigeon on plane wing", "How did it survive", "Nature is wild", "That pigeon is brave",
    
    // Общие реакции
    "Это круто", "Вау не ожидал", "Топ контент", "Это легендарно", "Шикарно получилось", "Это шедевр", "Супер", "Обожаю такие видео",
    "Смотрю уже 5 раз", "Не могу перестать пересматривать", "Добавил в избранное", "Лучшее видео за сегодня", "Это зашло", "Подписался из-за этого",
    "Кто еще здесь из 2025", "Ваши мысли", "Согласны со мной", "Это правда так", "Обсудим в комментариях",
    "Продолжай в том же духе", "У тебя талант", "Очень круто получилось", "Подписка обязательна", "Больше такого",
    "That's awesome", "So good", "Love this", "Amazing", "Incredible", "Perfect", "This is fire", "Keep it up", "Watched 5 times", "Can't stop rewatching"
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[randomInt(0, arr.length - 1)];

const generateLikes = () => {
    const r = Math.random();
    if (r > 0.95) return (Math.random() * 10).toFixed(1) + 'M';
    if (r > 0.8) return (Math.random() * 300).toFixed(1) + 'K';
    return randomInt(0, 1500);
};

const generateDate = () => {
    const r = Math.random();
    if (r > 0.8) return `${randomInt(2, 6)} дн. назад`;
    if (r > 0.5) return `${randomInt(1, 23)} ч. назад`;
    if (r > 0.2) return `${randomInt(2, 59)} мин. назад`;
    return "Только что";
};

// Функция getAvatar импортирована из avatarHelper.js

const generateReplies = (count) => {
    if (count <= 0) return [];
    return Array.from({ length: count }).map(() => {
        const user = generateUsername();
        return {
            id: `reply-${Math.random().toString(36).substr(2, 9)}`,
            user: user,
            text: randomItem(commentsBase),
            date: generateDate(),
            avatar: getAvatar(user), // Аватар зависит от имени
            likes: generateLikes()
        };
    });
};

export const generateComments = (count = 300) => {
    return Array.from({ length: count }).map((_, i) => {
        const repliesCount = Math.random() > 0.85 ? randomInt(3, 20) : randomInt(0, 1);
        const user = generateUsername();
        return {
            id: i + 1,
            user: user,
            text: randomItem(commentsBase),
            date: generateDate(),
            avatar: getAvatar(user),
            likes: generateLikes(),
            repliesList: generateReplies(repliesCount)
        };
    });
};