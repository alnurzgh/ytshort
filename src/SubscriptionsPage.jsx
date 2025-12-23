import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, RefreshCw } from 'lucide-react';
import { getAvatar } from './utils/avatarHelper';

// Компонент скелетона для карточки подписки
const SubCardSkeleton = () => (
    <div className="sub-card">
        <div className="sub-poster skeleton-pulse" style={{ background: '#1a1a1a' }}></div>
        <div className="sub-card-overlay">
            <div className="sub-avatar-large skeleton-pulse" style={{ background: '#252525', border: 'none' }}></div>
            <div className="sub-info" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="skeleton-pulse" style={{ width: '60%', height: '18px', borderRadius: '4px' }}></div>
                <div className="skeleton-pulse" style={{ width: '40%', height: '14px', borderRadius: '4px' }}></div>
            </div>
            <div className="skeleton-pulse" style={{ width: '100%', height: '40px', borderRadius: '4px', marginTop: '16px' }}></div>
        </div>
    </div>
);

const SubscriptionsPage = ({ onLogin }) => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Генератор имен каналов
    const generateChannelName = () => {
        const firstNames = ["Alex", "Ivan", "Max", "Dima", "Kate", "Alina", "Nastya", "Olya", "Viktor", "Sergey", "Kira", "Nikita", "Egor", "Danya", "Misha", "Sasha", "Vlad", "Roman", "Anton", "Yulia", "Maria", "Anna"];
        const lastNames = ["Gaming", "Plays", "Official", "Studio", "Channel", "TV", "Hub", "Edit", "Clips", "Shorts", "Pro", "HD", "Anime", "Memes"];
        const prefixes = ["Super", "Mega", "Pro", "Best", "Epic", "Cool", "True", "Real"];
        
        const type = Math.random();
        if (type < 0.4) {
            return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        } else if (type < 0.7) {
            return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${firstNames[Math.floor(Math.random() * firstNames.length)]}`;
        } else {
            return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${firstNames[Math.floor(Math.random() * firstNames.length)]}`;
        }
    };

    const generateChannelUsername = (name) => {
        return name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
    };

    // Имитация загрузки данных с задержкой для демонстрации скелетонов
    const fetchSubscriptions = (pageNumber) => {
        setIsLoading(true);
        setTimeout(() => {
            const newItems = Array.from({ length: 6 }).map((_, i) => {
                const channelName = generateChannelName();
                const username = generateChannelUsername(channelName);
                return {
                    id: `sub-${pageNumber}-${i}-${Date.now()}`,
                    name: channelName,
                    username: username,
                    avatar: getAvatar(username),
                    poster: `https://picsum.photos/400/600?random=${Math.random()}`,
                    isVerified: Math.random() > 0.6 // 40% каналов с галочкой
                };
            });

            setItems(prev => [...prev, ...newItems]);
            setIsLoading(false);
            if (pageNumber >= 5) setHasMore(false);
        }, 1200); // Увеличенная задержка для наглядности пульсации
    };

    useEffect(() => {
        fetchSubscriptions(page);
    }, [page]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
            if (!isLoading && hasMore) {
                setPage(prev => prev + 1);
            }
        }
    };

    return (
        <div className="subs-container" onScroll={handleScroll}>
            <div className="subs-header">
                <div className="subs-top-actions">
                    <button className="subs-action-btn" onClick={onLogin}>
                        <RefreshCw size={16} /> <span>Приобрес...</span>
                    </button>
                    <button className="subs-action-btn" onClick={onLogin}>
                        <Smartphone size={16} /> <span>Скачать п...</span>
                    </button>
                    <button className="subs-login-btn" onClick={onLogin}>Войти</button>
                </div>
            </div>

            <div className="subs-grid">
                {/* Рендер существующих элементов */}
                {items.map((item) => (
                    <div key={item.id} className="sub-card">
                        <img src={item.poster} alt="" className="sub-poster" />
                        <div className="sub-card-overlay">
                            <img src={item.avatar} alt="" className="sub-avatar-large" />
                            <div className="sub-info">
                                <div className="sub-name">
                                    {item.name}
                                    {item.isVerified && <span className="verified-badge">✓</span>}
                                </div>
                                <div className="sub-username">@{item.username}</div>
                            </div>
                            <button className="btn-subscribe" onClick={onLogin}>Подписаться</button>
                        </div>
                    </div>
                ))}

                {/* Рендер скелетонов при загрузке новых страниц или первой загрузке */}
                {isLoading && Array.from({ length: 6 }).map((_, i) => (
                    <SubCardSkeleton key={`skeleton-${i}`} />
                ))}
            </div>

            {!hasMore && items.length > 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#8a8b91' }}>
                    Вы посмотрели всех рекомендуемых авторов
                </div>
            )}
        </div>
    );
};

export default SubscriptionsPage;