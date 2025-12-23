import React, { useState, useEffect, useRef } from 'react';
import { Plus, Smartphone, User } from 'lucide-react';
import { getAvatar } from './utils/avatarHelper';

const CATEGORIES = [
    "Все", "Пение и танцы", "Юмор", "Спорт", "Аниме и комиксы",
    "Отношения", "Шоу", "Липсинк", "Повседневность", "Гейминг",
    "Общество", "Животные", "Авто", "Еда"
];

// Генератор имен пользователей
const generateUsername = () => {
    const prefixes = ["super", "mega", "pro", "best", "epic", "cool", "true", "real", "just", "only"];
    const names = ["alex", "ivan", "max", "dima", "kate", "alina", "nastya", "olya", "viktor", "sergey", "player", "gamer", "kira", "nikita", "egor", "danya", "misha", "sasha", "vlad", "roman"];
    const suffixes = ["gaming", "plays", "official", "yt", "studio", "channel", "tv", "hub", "fan", "pro", "edit", "clips", "shorts"];
    const separators = ["", "_", ".", ""];
    
    const type = Math.random();
    const name = names[Math.floor(Math.random() * names.length)];
    const separator = separators[Math.floor(Math.random() * separators.length)];
    const number = Math.floor(Math.random() * 10000);
    
    if (type < 0.3) return `${name}${separator}${number}`;
    else if (type < 0.6) {
        const suff = suffixes[Math.floor(Math.random() * suffixes.length)];
        return `${name}${separator}${suff}`;
    } else if (type < 0.85) {
        const pref = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suff = suffixes[Math.floor(Math.random() * suffixes.length)];
        return `${pref}${separator}${name}${separator}${suff}`;
    } else return `user${number}`;
};

// Описания для видео
const descriptions = [
    "Лучший момент из аниме! 🔥", "Этот клип просто огонь! ⚡", "Легендарный момент! 👑", "Как же это круто! 💯", 
    "Это стало мемом! 😂", "Мой любимый персонаж! ❤️", "Ностальгия накрыла 🥺", "Этот арк был вау! 📺",
    "Игровой клип который взорвал интернет 🎮", "Лучший эпизод без вопросов! ⭐", "Плакал здесь 😭", 
    "Это изменило мою жизнь 💫", "Шикарный монтаж! 🎬", "Топ контент! 🏆", "Это так смешно! 🤣",
    "Дайдзавааа! 😍", "Жду продолжения! ⏳", "Обожаю такие видео! ✨", "Это зашло! ✅"
];

// Генератор данных
const generateExploreItems = (category, count) => {
    return Array.from({ length: count }).map((_, i) => {
        const username = generateUsername();
        return {
            id: `${category}-${i}-${Date.now()}`,
            desc: descriptions[Math.floor(Math.random() * descriptions.length)],
            likes: Math.floor(Math.random() * 900000) + 1000,
            poster: `https://picsum.photos/400/600?random=${Math.random()}`,
            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
            author: {
                username: username,
                avatar: getAvatar(username)
            }
        };
    });
};

// --- НОВЫЙ КОМПОНЕНТ: СКЕЛЕТОН ---
const CardSkeleton = () => (
    <div className="explore-card-wrapper">
        <div className="explore-card-media skeleton-pulse" style={{ background: '#1a1a1a' }}>
            {/* Пустой блок с анимацией пульсации */}
        </div>
        <div className="explore-card-info">
            <div className="explore-user-row">
                <div className="explore-user-avatar skeleton-pulse" style={{ background: '#1a1a1a' }}></div>
                <div className="skeleton-pulse" style={{ width: '60%', height: '12px', background: '#1a1a1a', borderRadius: '4px' }}></div>
            </div>
        </div>
    </div>
);

const ExploreCard = ({ item }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        setIsPlaying(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) playPromise.catch(() => {});
        }
    };

    const handleMouseLeave = () => {
        setIsPlaying(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const formatLikes = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="explore-card-wrapper">
            <div className="explore-card-media" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <img src={item.poster} alt="" className={`explore-poster ${isPlaying ? 'hidden' : ''}`} />
                <video ref={videoRef} src={item.videoUrl} className="explore-video-preview" loop muted playsInline />
                <div className="explore-card-gradient"></div>
                <div className="explore-card-content">
                    <div className="explore-desc-text">{item.desc}</div>
                </div>
                <div className="explore-likes-overlay">
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z" stroke="white" strokeWidth="2" fill="transparent"/></svg>
                    <span>{formatLikes(item.likes)}</span>
                </div>
            </div>
            <div className="explore-card-info">
                <div className="explore-user-row">
                    <img src={item.author.avatar} alt="" className="explore-user-avatar" />
                    <span className="explore-username">{item.author.username}</span>
                </div>
            </div>
        </div>
    );
};

const ExplorePage = ({ onLogin }) => {
    const [activeCategory, setActiveCategory] = useState("Все");
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Состояние загрузки

    useEffect(() => {
        setIsLoading(true); // Включаем загрузку при смене категории

        // Имитируем сетевой запрос
        const timer = setTimeout(() => {
            const count = activeCategory === "Все" ? 24 : 12;
            setItems(generateExploreItems(activeCategory, count));
            setIsLoading(false); // Выключаем загрузку
        }, 800); // 0.8 сек задержки для визуала

        return () => clearTimeout(timer);
    }, [activeCategory]);

    return (
        <div className="explore-container">
            <div className="explore-header-wrapper">
                <div className="categories-bar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="explore-top-actions">
                    <button className="explore-icon-btn" title="Загрузить" onClick={onLogin}>
                        <Plus size={22} />
                    </button>
                    <button className="explore-icon-btn" title="Приложение" onClick={onLogin}>
                        <Smartphone size={22} />
                    </button>
                    <button className="explore-icon-btn" title="Войти" onClick={onLogin}>
                        <User size={22} />
                    </button>
                </div>
            </div>

            <div className="explore-grid">
                {isLoading
                    ? Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)
                    : items.map((item) => <ExploreCard key={item.id} item={item} />)
                }
            </div>
        </div>
    );
};

export default ExplorePage;