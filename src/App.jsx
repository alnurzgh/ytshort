import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import './assets/css/style.css';
import { generateComments } from './utils/commentsGenerator';
import { getAvatar } from './utils/avatarHelper';

// Контекст звука (создаем прямо здесь, чтобы не плодить файлы, если тебе так удобнее)
const AudioContext = React.createContext();
const AudioProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(0.5);
    const toggleMute = () => setIsMuted(prev => !prev);
    return (
        <AudioContext.Provider value={{ isMuted, setIsMuted, volume, setVolume, toggleMute }}>
            {children}
        </AudioContext.Provider>
    );
};
const useAudio = () => React.useContext(AudioContext);

// !!! ВАЖНО: Убедитесь, что эти файлы существуют в папке src
import PrivacyPage from './PrivacyPage';
import SubscriptionsPage from './SubscriptionsPage';
import TermsPage from './TermsPage';
import ExplorePage from './ExplorePage';
import { searchVideos } from './utils/apiService';
import {
    Home, Compass, Users, Tv, PlusSquare, User, MoreHorizontal,
    Search, Plus, Music, Volume2, VolumeX, X,
    Smartphone, ChevronDown as ChevronDownSmall, QrCode,
    RefreshCw, Send, Link, Code, Facebook, MessageCircle, ArrowLeft,
    ThumbsUp, ThumbsDown, ChevronDown, Mic, Bell, Menu, Clock, List
} from 'lucide-react';

/* === ГЕНЕРАЦИЯ ДАННЫХ === */
const commentsData = generateComments(300);
const FALLBACK_AVATAR = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

/* === TOAST УВЕДОМЛЕНИЕ === */
const Toast = ({ message }) => (
    <div className="toast-notification">
        {message}
    </div>
);

/* === МОДАЛЬНОЕ ОКНО ВХОДА === */
const LoginModal = ({ onClose, onPrivacyClick, onTermsClick }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-header">
                    <h2>Войти в YouTube Shorts</h2>
                </div>

                <div className="modal-body">
                    <button className="login-btn-option">
                        <div className="login-btn-icon"><QrCode size={20} /></div>
                        <span className="login-btn-text">Введите QR-код</span>
                    </button>
                    <button className="login-btn-option">
                        <div className="login-btn-icon"><User size={20} /></div>
                        <span className="login-btn-text">Введите телефон / почту / имя</span>
                    </button>
                    <button className="login-btn-option">
                        <div className="login-btn-icon">
                            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                        </div>
                        <span className="login-btn-text">Продолжить с Google</span>
                    </button>
                    <button className="login-btn-option">
                        <div className="login-btn-icon">
                            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#1877F2" d="M24 0C10.74 0 0 10.74 0 24c0 11.99 8.77 21.97 20.25 23.77V29.56h-6.09v-5.56h6.09v-5.28c0-6.01 3.58-9.34 9.07-9.34 2.62 0 5.36.47 5.36.47v5.9h-3.01c-2.98 0-3.91 1.85-3.91 3.75v4.5h6.64l-1.06 5.56h-5.58v18.21C39.23 45.97 48 35.99 48 24c0-13.26-10.74-24-24-24z"/></svg>
                        </div>
                        <span className="login-btn-text">Продолжить с Facebook</span>
                    </button>
                    <button className="login-btn-option">
                        <div className="login-btn-icon">
                            <svg width="20" height="20" viewBox="0 0 384 512" fill="white"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/></svg>
                        </div>
                        <span className="login-btn-text">Продолжить с Apple</span>
                    </button>
                </div>

                <div className="modal-footer">
                    <p>
                        Продолжая пользоваться аккаунтом, относящимся к региону <strong>Казахстан</strong>, вы принимаете <span className="link-text-btn" onClick={onTermsClick}>Условия использования</span> и подтверждаете, что ознакомились с документом <span className="link-text-btn" onClick={onPrivacyClick}>Политика конфиденциальности</span>.
                    </p>
                    <div className="modal-signup-prompt">
                        Ещё нет аккаунта? <span className="signup-link">Регистрация</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* === ОБНОВЛЕННАЯ ПАНЕЛЬ ПОИСКА === */
const SearchDrawer = ({ isOpen, onClose, history, onSearchSave }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const NEW_LOGO_URL = "/youtube-shorts-1.svg";

    useEffect(() => {
        if (isOpen && inputRef.current) setTimeout(() => inputRef.current.focus(), 100);
    }, [isOpen]);

    useEffect(() => {
        if (query.trim() === '') {
            setSuggestions([]);
            setIsLoading(false);
            return;
        }
        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const results = await searchVideos(query);
                setSuggestions(results);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const handleClear = () => { setQuery(''); inputRef.current.focus(); };

    // Новая функция выбора
    const handleSelect = (term) => {
        setQuery(term);
        onSearchSave(term);
    };

    return (
        <div className={`search-panel ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="search-panel-sidebar">
                <div className="mini-logo-container" onClick={onClose}>
                    <img src={NEW_LOGO_URL} alt="YouTube Shorts" className="mini-logo-img" />
                </div>
                <div className="mini-nav-item" onClick={onClose}><Home size={28} strokeWidth={2} /></div>
                <div className="mini-nav-item" onClick={onClose}><Compass size={26} strokeWidth={2} /></div>
                <div className="mini-nav-item" onClick={onClose}><Users size={26} strokeWidth={2} /></div>
                <div className="mini-nav-item" onClick={onClose}><Tv size={26} strokeWidth={2} /></div>
                <div className="mini-nav-item active"><Search size={28} strokeWidth={3} /></div>
                <div className="mini-nav-item" onClick={onClose}><User size={26} strokeWidth={2} /></div>
            </div>

            <div className="search-panel-content">
                <div className="search-content-header">
                    <div className="search-header-title">Поиск</div>
                    <button className="search-close-circle" onClick={onClose}><X size={24} /></button>
                </div>
                <div className="search-input-container">
                    <div className="search-input-box">
                        <Search size={18} color="#8a8b91" style={{minWidth: 18}} />
                        <input
                            ref={inputRef}
                            type="text"
                            className="search-real-input"
                            placeholder="Поиск"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{marginLeft: 10}}
                        />
                        {isLoading ? (
                            <div className="input-loader"><RefreshCw size={14} className="spin-anim" /></div>
                        ) : (
                            <button className={`input-clear-btn ${query ? 'visible' : ''}`} onClick={handleClear}><X size={14} color="white" strokeWidth={3} /></button>
                        )}
                    </div>
                </div>
                <div className="search-results-list">
                    {/* ДОБАВЛЕНА ИСТОРИЯ */}
                    {!isLoading && query === '' && history.length > 0 && (
                        <div className="search-history">
                            <div className="history-title">Недавнее</div>
                            {history.map((h, i) => (
                                <div key={i} className="result-item" onClick={() => handleSelect(h)}>
                                    <div className="result-text">{h}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!isLoading && query === '' && history.length === 0 && <div style={{color: '#8a8b91', padding: '20px 24px', fontSize: 14}}>Введите запрос для поиска</div>}
                    {!isLoading && query !== '' && suggestions.length === 0 && <div style={{color: '#8a8b91', padding: '20px 24px', fontSize: 14}}>Ничего не найдено по запросу «{query}»</div>}
                    {!isLoading && suggestions.map((item, index) => (
                        <div className="result-item" key={index} onClick={() => handleSelect(item)}>
                            <div className="result-icon"><Search size={16} /></div>
                            <div className="result-text">{item}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* === МОДАЛКА ВСТАВКИ КОДА (EMBED) === */
const EmbedModal = ({ onClose, videoUrl, videoId, username }) => {
    const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    const handleCopyCode = () => { navigator.clipboard.writeText(embedCode); onClose(); };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="embed-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="embed-header">
                    <div className="embed-title">Вставка видео</div>
                    <button className="close-modal-btn" onClick={onClose} style={{position: 'static'}}><X size={24} /></button>
                </div>
                <div className="embed-body">
                    <div className="embed-instruction">Скопируйте код, чтобы вставить это в видео</div>
                    <textarea className="embed-code-box" readOnly value={embedCode} onClick={(e) => e.target.select()} />
                    <button className="btn-copy-embed" onClick={handleCopyCode}>Копировать код</button>
                    <div className="embed-footer-text">Вставляя это видео на свою страницу, вы принимаете наши <a href="#">Условия использования</a> и подтверждаете, что прочитали и поняли <a href="#">Политику конфиденциальности</a>.</div>
                </div>
            </div>
        </div>
    );
};

/* === МОДАЛЬНОЕ ОКНО ПОДЕЛИТЬСЯ === */
const ShareModal = ({ onClose, onLogin, onCopy, onEmbed, onShareSocial }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="share-modal-wrapper" onClick={(e) => e.stopPropagation()}>
                <div className="share-header">
                    <div className="share-title">Поделиться</div>
                    <button className="share-close-btn" onClick={onClose}><X size={16} /></button>
                </div>
                <div className="share-body">
                    <div className="share-grid">
                        <div className="share-item" onClick={onLogin}><div className="share-icon-circle share-repost"><RefreshCw size={28} color="white" /></div><span className="share-label">Репост</span></div>
                        <div className="share-item" onClick={onLogin}><div className="share-icon-circle share-friends"><Send size={28} color="white" style={{marginLeft: -2}} /></div><span className="share-label">Отправить друзьям</span></div>
                        <div className="share-item" onClick={onCopy}><div className="share-icon-circle share-copy"><Link size={28} color="white" /></div><span className="share-label">Copy</span></div>
                        <div className="share-item" onClick={() => onShareSocial('whatsapp')}><div className="share-icon-circle share-whatsapp"><MessageCircle size={28} color="white" /></div><span className="share-label">WhatsApp</span></div>
                        <div className="share-item" onClick={onEmbed}><div className="share-icon-circle share-embed"><Code size={28} color="white" /></div><span className="share-label">Вставка</span></div>
                        <div className="share-item" onClick={() => onShareSocial('facebook')}><div className="share-icon-circle share-facebook"><Facebook size={28} color="white" /></div><span className="share-label">Facebook</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* === СКЕЛЕТОНЫ === */
const AppSkeleton = () => (
    <div className="app-skeleton">
        <div className="skeleton-top-nav"></div>
        <div className="skeleton-nav-buttons"><div className="skeleton-nav-circle"></div><div className="skeleton-nav-circle"></div></div>
        <div className="skeleton-sidebar-col">
            <div className="skeleton-rect" style={{ height: '40px', width: '40px', borderRadius: '50%', marginBottom: '20px' }}></div>
            <div className="skeleton-rect" style={{ height: '36px', width: '100%', borderRadius: '18px', marginBottom: '20px' }}></div>
            {Array.from({ length: 7 }).map((_, i) => (<div key={i} className="skeleton-rect" style={{ height: '30px', width: '80%' }}></div>))}
            <div className="skeleton-rect" style={{ height: '48px', width: '100%', marginTop: 'auto', borderRadius: '4px' }}></div>
        </div>
        <div className="skeleton-main-col">
            <div className="skeleton-phone"></div>
            <div className="skeleton-actions-col">
                {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="skeleton-circle"></div>))}
            </div>
        </div>
    </div>
);

const CommentSkeleton = () => (
    <div className="skeleton-item">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-content"><div className="skeleton-line short"></div><div className="skeleton-line long"></div></div>
    </div>
);

/* === КОМПОНЕНТ ЛАЙКА === */
const CommentLike = ({ initialLikes }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [count, setCount] = useState(initialLikes);
    const isNumber = typeof initialLikes === 'number';

    const handleLike = (e) => {
        e.stopPropagation();
        if (isLiked) {
            setIsLiked(false);
            if (isNumber) setCount(prev => prev - 1);
        } else {
            setIsLiked(true);
            if (isNumber) setCount(prev => prev + 1);
        }
    };

    return (
        <div className="comment-like-container" onClick={handleLike}>
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" style={{transform: isLiked ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s'}}>
                <path d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
                      fill={isLiked ? "#FF0000" : "none"}
                      stroke={isLiked ? "#FF0000" : "#8a8b91"}
                      strokeWidth="4"/>
            </svg>
            <span className={`comment-like-count ${isLiked ? 'liked' : ''}`}>{count}</span>
        </div>
    );
};

/* === КОМПОНЕНТ КОММЕНТАРИЯ === */
const CommentItem = memo(({ comment, onLogin }) => {
    const [visibleReplies, setVisibleReplies] = useState(0);
    const totalReplies = comment.repliesList?.length || 0;
    const BATCH_SIZE = 3;

    const handleShowMore = () => { setVisibleReplies(prev => Math.min(prev + BATCH_SIZE, totalReplies)); };
    const handleImageError = (e) => { e.target.onerror = null; e.target.src = FALLBACK_AVATAR; };

    return (
        <div className="comment-item-wrapper">
            <div className="comment-item">
                <img src={comment.avatar} alt="" className="comment-avatar" onError={handleImageError} />
                <div className="comment-content">
                    <div className="comment-user">{comment.user}</div>
                    <div className="comment-text">{comment.text}</div>
                    <div className="comment-meta">
                        <span className="comment-date">{comment.date}</span>
                        <span className="comment-reply" onClick={onLogin}>Ответить</span>
                    </div>
                </div>
                <CommentLike initialLikes={comment.likes} />
            </div>
            {visibleReplies > 0 && (
                <div className="replies-list">
                    {comment.repliesList.slice(0, visibleReplies).map(reply => (
                        <div className="comment-item reply-item" key={reply.id}>
                            <img src={reply.avatar} alt="" className="comment-avatar small" onError={handleImageError} />
                            <div className="comment-content">
                                <div className="comment-user">{reply.user}</div>
                                <div className="comment-text">{reply.text}</div>
                                <div className="comment-meta">
                                    <span className="comment-date">{reply.date}</span>
                                    <span className="comment-reply" onClick={onLogin}>Ответить</span>
                                </div>
                            </div>
                            <CommentLike initialLikes={reply.likes} />
                        </div>
                    ))}
                </div>
            )}
            {totalReplies > 0 && visibleReplies < totalReplies && (
                <div className="view-replies-wrapper">
                    <div className="view-replies" onClick={handleShowMore}>
                        <div className="view-replies-line"></div>
                        <span>{visibleReplies === 0 ? `Просмотреть ответы (${totalReplies})` : `Посмотреть еще`}</span>
                        <ChevronDownSmall size={14} style={{ marginLeft: 2, transform: 'translateY(1px)' }} />
                    </div>
                </div>
            )}
        </div>
    );
});

/* === КОМПОНЕНТ ПЛЕЕРА === */
const VideoPlayer = ({ video, isActive, isCommentsOpen, toggleComments, closeComments, onLogin, onShare, onScrollDown }) => {
    const videoRef = useRef(null);
    const commentsListRef = useRef(null);

    // ВНЕДРЕН ГЛОБАЛЬНЫЙ ЗВУК
    const { isMuted, volume, toggleMute } = useAudio();

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(video.stats.likes);
    const [dislikeCount, setDislikeCount] = useState(Math.floor(Math.random() * 1000) + 50);
    const [hearts, setHearts] = useState([]);
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(0);
    const [wasPlaying, setWasPlaying] = useState(false);
    const clickTimeoutRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    // ВНЕДРЕН INTERSECTION OBSERVER ДЛЯ АВТОПЛЕЯ
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current?.play().catch(() => {});
                    setIsPlaying(true);
                } else {
                    videoRef.current?.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.6 }
        );
        if (videoRef.current) observer.observe(videoRef.current);
        return () => observer.disconnect();
    }, []);

    // СИНХРОНИЗАЦИЯ С ГЛОБАЛЬНЫМ ЗВУКОМ
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
            videoRef.current.volume = volume;
        }
    }, [isMuted, volume]);

    useEffect(() => {
        let timer;
        if (isCommentsOpen) {
            setVisibleCommentsCount(0);
            timer = setTimeout(() => { setVisibleCommentsCount(15); }, 400);
        } else {
            timer = setTimeout(() => { setVisibleCommentsCount(0); }, 1000);
        }
        return () => clearTimeout(timer);
    }, [isCommentsOpen]);

    const handleScrollComments = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            if (visibleCommentsCount < commentsData.length && visibleCommentsCount > 0) {
                setVisibleCommentsCount(prev => Math.min(prev + 20, commentsData.length));
            }
        }
    };

    const handleTimeUpdate = useCallback(() => {
        if (!isScrubbing && videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            if (videoRef.current.duration !== duration) setDuration(videoRef.current.duration || 0);
        }
    }, [isScrubbing, duration]);

    const handleVideoClick = (e) => {
        e.stopPropagation();
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            return;
        }
        clickTimeoutRef.current = setTimeout(() => {
            setShowControls(true);
            if (videoRef.current) {
                if (videoRef.current.paused) {
                    videoRef.current.play();
                    setIsPlaying(true);
                } else {
                    videoRef.current.pause();
                    setIsPlaying(false);
                }
            }
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => { setShowControls(false); }, 800);
            clickTimeoutRef.current = null;
        }, 250);
    };

    const handleBackgroundClick = () => { if (isCommentsOpen) closeComments(); };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newHeartId = Date.now();
        setHearts(prev => [...prev, { id: newHeartId, x, y }]);
        setTimeout(() => { setHearts(prev => prev.filter(heart => heart.id !== newHeartId)); }, 1000);
    };

    const handleCommentsClick = (e) => { e.stopPropagation(); toggleComments(); };

    const handleScrubStart = (e) => {
        e.stopPropagation();
        setWasPlaying(isPlaying);
        if(videoRef.current) videoRef.current.pause();
        setIsPlaying(false);
        setIsScrubbing(true);
    };
    const handleScrubChange = (e) => {
        e.stopPropagation();
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if(videoRef.current) videoRef.current.currentTime = newTime;
    };
    const handleScrubEnd = (e) => {
        e.stopPropagation();
        setIsScrubbing(false);
        if (wasPlaying && videoRef.current) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
        }
    };

    const handleVolumeChange = (e) => {
        e.stopPropagation();
        const newVol = parseFloat(e.target.value);

        // 1. Обновляем глобальное состояние (для следующих видео)
        setVolume(newVol);

        // 2. Обновляем текущее видео
        if (videoRef.current) {
            videoRef.current.volume = newVol;
            videoRef.current.muted = newVol === 0;
        }

        // 3. Если громкость > 0, выключаем Mute автоматически
        if (newVol > 0) {
            setIsMuted(false);
        } else {
            setIsMuted(true);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="video-post">
            <div className="video-main-area" onClick={handleBackgroundClick}>
                <div
                    className="video-wrapper"
                    onClick={handleVideoClick}
                    onDoubleClick={handleDoubleClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="floating-hearts-container">
                        {hearts.map(heart => (
                            <div key={heart.id} className="floating-heart" style={{ left: heart.x, top: heart.y }}>
                                <svg width="80" height="80" viewBox="0 0 48 48" fill="none"><path d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z" fill="#FF0000" /></svg>
                            </div>
                        ))}
                    </div>

                    <div className={`play-pause-overlay ${showControls ? 'visible' : ''}`}>
                        {isPlaying ? (
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="white" style={{ opacity: 0.9 }}><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                        ) : (
                            <svg width="52" height="52" viewBox="0 0 24 24" fill="white" style={{ opacity: 0.9, marginLeft: 6 }}><path d="M5 3l14 9-14 9V3z" /></svg>
                        )}
                    </div>

                    {isScrubbing && (<div className="scrubbing-overlay">{formatTime(currentTime)} / {formatTime(duration)}</div>)}

                    <video
                        ref={videoRef}
                        src={video.video_url}
                        className="video-element"
                        loop
                        muted={isMuted}
                        playsInline
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={(e) => setDuration(e.target.duration)}
                        onError={(e) => {
                            const error = e.target.error;
                            console.error("Ошибка загрузки видео:", video.video_url);
                            console.error("Код ошибки:", error?.code);
                            console.error("Сообщение ошибки:", error?.message);
                            if (error) {
                                switch(error.code) {
                                    case error.MEDIA_ERR_ABORTED:
                                        console.error("Видео загрузка была прервана");
                                        break;
                                    case error.MEDIA_ERR_NETWORK:
                                        console.error("Произошла ошибка сети при загрузке видео");
                                        break;
                                    case error.MEDIA_ERR_DECODE:
                                        console.error("Произошла ошибка декодирования видео");
                                        break;
                                    case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                        console.error("Формат видео не поддерживается или файл не найден");
                                        break;
                                    default:
                                        console.error("Неизвестная ошибка");
                                        break;
                                }
                            }
                        }}
                        onLoadStart={() => {
                            console.log("Начало загрузки:", video.video_url);
                        }}
                        onCanPlay={() => {
                            console.log("Видео готово:", video.video_url);
                        }}
                    />

                    {/* Верхняя панель управления как в YouTube Shorts */}
                    <div className="video-top-controls" onClick={(e) => e.stopPropagation()}>
                        <button className="top-control-btn" onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
                            {isMuted ? <VolumeX size={20} color="white" /> : <Volume2 size={20} color="white" />}
                        </button>
                        <button className="top-control-btn" onClick={(e) => { e.stopPropagation(); onLogin(); }}>
                            <MoreHorizontal size={20} color="white" />
                        </button>
                    </div>

                    {/* Скрытый контейнер для volume slider */}
                    <div className={`volume-container ${isHovered ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <div className="volume-slider-wrapper">
                            <div className="volume-slider-track">
                                <div className="volume-slider-fill" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}></div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="volume-slider"
                                    style={{ '--volume-percent': `${(isMuted ? 0 : volume) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="progress-container" onClick={(e) => e.stopPropagation()}>
                        <div className="progress-bg"></div>
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                        <div className="progress-thumb" style={{ left: `${progressPercent}%` }}></div>
                        <input type="range" min="0" max={duration || 100} step="0.01" value={currentTime} className="progress-input-hidden" onMouseDown={handleScrubStart} onChange={handleScrubChange} onMouseUp={handleScrubEnd} onTouchStart={handleScrubStart} onTouchEnd={handleScrubEnd} />
                    </div>

                    <div className={`video-overlay ${isScrubbing ? 'hidden' : ''}`}>
                        <div className="author-name">@{video.author.username}</div>
                        <div className="video-title">{video.title || video.description}</div>
                    </div>
                </div>

                <div className="actions-sidebar" onClick={(e) => e.stopPropagation()}>
                    <div className="action-btn" onClick={(e) => { 
                        e.stopPropagation(); 
                        if (isDisliked) {
                            setIsDisliked(false);
                            setDislikeCount(prev => prev - 1);
                        }
                        const newLiked = !isLiked;
                        setIsLiked(newLiked);
                        setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
                    }}>
                        <ThumbsUp size={24} color={isLiked ? "#FF0000" : "white"} style={{ transition: 'color 0.2s' }} />
                        <span className="action-label">{formatNumber(likeCount)}</span>
                    </div>
                    <div className="action-btn" onClick={(e) => { 
                        e.stopPropagation(); 
                        if (isLiked) {
                            setIsLiked(false);
                            setLikeCount(prev => prev - 1);
                        }
                        const newDisliked = !isDisliked;
                        setIsDisliked(newDisliked);
                        setDislikeCount(prev => newDisliked ? prev + 1 : prev - 1);
                    }}>
                        <ThumbsDown size={24} color={isDisliked ? "#FF0000" : "white"} style={{ transition: 'color 0.2s' }} />
                        <span className="action-label">{formatNumber(dislikeCount)}</span>
                    </div>
                    <div className="action-btn" onClick={handleCommentsClick}>
                        <MessageCircle size={24} color="white" />
                        <span className="action-label">{formatNumber(video.stats.comments)}</span>
                    </div>
                    <div className="action-btn" onClick={(e) => { e.stopPropagation(); onShare(); }}>
                        <Send size={24} color="white" />
                        <span className="action-label">Подели...</span>
                    </div>
                    <div className="action-btn remix-btn" onClick={(e) => { e.stopPropagation(); onLogin(); }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <span className="action-label">Ремикс</span>
                    </div>
                    <div className="avatar-container" onClick={onLogin}>
                        <img src={video.author.avatar_url} alt="avatar" className="avatar" />
                    </div>
                    <div className="action-btn scroll-down-btn" onClick={(e) => { 
                        e.stopPropagation(); 
                        if (onScrollDown) onScrollDown();
                    }}>
                        <ChevronDown size={24} color="white" />
                    </div>
                </div>
            </div>

            <div className={`comments-panel ${isCommentsOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="comments-header">
                    <div className="comments-title">Комментарии ({video.stats.comments})</div>
                    <div className="close-btn" onClick={closeComments}><X size={20} /></div>
                </div>
                <div className="comments-list" ref={commentsListRef} onScroll={handleScrollComments}>
                    {visibleCommentsCount === 0 && isCommentsOpen ? (
                        Array.from({ length: 10 }).map((_, i) => <CommentSkeleton key={i} />)
                    ) : (
                        commentsData.slice(0, visibleCommentsCount).map((comment) => (
                            <CommentItem key={comment.id} comment={comment} onLogin={onLogin} />
                        ))
                    )}
                    {visibleCommentsCount > 0 && visibleCommentsCount < commentsData.length && (
                        <div style={{ padding: '10px 0' }}><CommentSkeleton /></div>
                    )}
                </div>
                <div className="comments-footer">
                    <button className="login-to-comment" onClick={onLogin}>Войти, чтобы прокомментировать</button>
                </div>
            </div>
        </div>
    );
};

/* === ОСНОВНОЕ ПРИЛОЖЕНИЕ === */
function AppContent() {
    const [videos, setVideos] = useState([]);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activePage, setActivePage] = useState('explore');
    const feedRef = useRef(null);
    const LIMIT = 5;

    // ВНЕДРЕНА ИСТОРИЯ ПОИСКА
    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });

    const handleSearchSave = (term) => {
        const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    // Локальные видео файлы как fallback
    const localVideos = [
        "/videos/birds.mp4",
        "/videos/diavolo.mp4",
        "/videos/fern.mp4",
        "/videos/fern2.mp4",
        "/videos/Humanity's greatest sniper.mp4",
        "/videos/ichigo.mp4",
        "/videos/invincible.mp4",
        "/videos/jjba.mp4",
        "/videos/kaidzi.mp4",
        "/videos/L discovers that Light is Kira.mp4",
        "/videos/omnimen.mp4",
        "/videos/tuffpigeon.mp4"
    ];

    // Генератор данных для локальных видео с соответствующими названиями и описаниями
    const generateLocalVideoData = (videoUrl, index) => {
        // Определяем данные для каждого видео на основе имени файла
        const videoDataMap = {
            "birds.mp4": {
                channel: "Nature Moments",
                title: "Креативная имитация птичьего гнезда с помощью инструментов",
                description: "Креативная имитация птичьего гнезда с помощью инструментов показывает как мама-птица заботится о птенцах #wildlife #nature #birds",
                music: "Nature Sounds"
            },
            "diavolo.mp4": {
                channel: "JoJo Edits",
                title: "Diavolo в бесконечном цикле",
                description: "Золотой Ветер встречает Время Приключений в этом уникальном кроссовере где Diavolo попадает в бесконечный цикл судьбы #jojo #adventuretime #goldenwind",
                music: "Adventure Time Theme"
            },
            "fern.mp4": {
                channel: "Adventure Time",
                title: "Fern: копия главного героя",
                description: "Травяной двойник Финна сталкивается с экзистенциальным кризисом пытаясь понять свое место в мире где он всего лишь копия #adventuretime #fern #identity",
                music: "Adventure Time OST"
            },
            "fern2.mp4": {
                channel: "Adventure Time",
                title: "Fern продолжает поиск себя",
                description: "Продолжение драматической истории Fern который борется с осознанием что он не оригинал а лишь травяная версия героя #adventuretime #fern #clone",
                music: "Adventure Time OST"
            },
            "Humanity's greatest sniper.mp4": {
                channel: "Anime History",
                title: "Легендарный финский снайпер",
                description: "История легендарного финского снайпера Симо Хяюхя известного как Белая Смерть в аниме адаптации #sniper #history #anime",
                music: "Epic Soundtrack"
            },
            "ichigo.mp4": {
                channel: "Gaming Crossovers",
                title: "Ичиго в Fortnite",
                description: "Ичиго Куросаки из Блич появляется в Fortnite демонстрируя фирменные движения и стиль в игровом мире #fortnite #bleach #ichigo #crossover",
                music: "Fortnite Emote Sound"
            },
            "invincible.mp4": {
                channel: "Superhero Edits",
                title: "Лучшие моменты Неуязвимого",
                description: "Лучшие моменты и мемы из сериала Неуязвимый собранные в одном видео для фанатов супергеройского экшена #invincible #superhero #memes",
                music: "Superhero Theme"
            },
            "jjba.mp4": {
                channel: "JoJo Edits",
                title: "JoJo Steel Ball Run: Soundman",
                description: "Официальный трейлер седьмого сезона JoJo Steel Ball Run с фокусом на персонаже Soundman и его уникальных способностях #jojo #steelballrun #soundman",
                music: "JoJo OST"
            },
            "kaidzi.mp4": {
                channel: "Anime Edits",
                title: "Наруто vs Луффи: айшоуспид был неправ",
                description: "Айшоуспид заявил что Луффи лучше Наруто но этот легендарный эдит доказывает обратное! Динамичные сцены с Наруто демонстрируют его невероятную силу решимость и ключевые моменты из аниме которые показывают почему Наруто не уступает другим популярным персонажам #naruto #onepiece #luffy #animeedit #aishouspeed #narutovsluffy #anime #shorts",
                music: "Naruto OST"
            },
            "L discovers that Light is Kira.mp4": {
                channel: "Death Note Memes",
                title: "L и Light: культовое противостояние",
                description: "Мемы и юмористические моменты из культового противостояния L и Light в аниме Тетрадь Смерти #deathnote #memes #LvsLight",
                music: "Death Note Theme"
            },
            "omnimen.mp4": {
                channel: "Invincible Deep",
                title: "Omni-Man: внутренние конфликты",
                description: "Эмоциональная глубина Omni-Man раскрывающая его внутренние конфликты и человеческую сторону за маской супергероя #invincible #omniman #emotions",
                music: "Emotional Soundtrack"
            },
            "tuffpigeon.mp4": {
                channel: "Wildlife Stories",
                title: "Голубь на крыле самолета",
                description: "Невероятный случай когда голубь решил прокатиться на крыле самолета во время полета демонстрируя смелость дикой природы #pigeon #airplane #wildlife",
                music: "Original Sound"
            }
        };
        
        // Получаем имя файла из URL
        const fileName = videoUrl.split('/').pop();
        const videoData = videoDataMap[fileName] || {
            channel: "Cool Clips",
            title: "Интересный контент!",
            description: "Интересный контент! 🔥",
            music: "Original Sound"
        };
        
        // Кодируем URL для правильной обработки специальных символов (пробелы, апострофы и т.д.)
        // Разделяем путь и имя файла, кодируем только имя файла
        const urlParts = videoUrl.split('/');
        const fileNameEncoded = encodeURIComponent(urlParts[urlParts.length - 1]);
        const encodedUrl = urlParts.slice(0, -1).join('/') + '/' + fileNameEncoded;
        
        return {
            id: `local-${index}`,
            video_url: encodedUrl,
            title: videoData.title || videoData.description.substring(0, 60),
            description: videoData.description,
            music: videoData.music,
            author: {
                username: videoData.channel,
                avatar_url: getAvatar(videoData.channel)
            },
            stats: {
                likes: Math.floor(Math.random() * 500000) + 10000,
                comments: Math.floor(Math.random() * 5000) + 100,
                shares: Math.floor(Math.random() * 5000) + 50
            }
        };
    };

    const fetchVideos = async (pageToLoad) => {
        try {
            if (pageToLoad === 1) setIsLoading(true);
            else setIsFetchingMore(true);
            
            // ПРЯМОЕ ИСПОЛЬЗОВАНИЕ ЛОКАЛЬНЫХ ВИДЕО
            // Всегда используем локальные видео с правильными данными (канал, описание, музыка)
            const startIdx = (pageToLoad - 1) * LIMIT;
            const endIdx = startIdx + LIMIT;
            const videosForPage = localVideos.slice(startIdx, endIdx);
            
            if (videosForPage.length === 0) {
                setHasMore(false);
                if (pageToLoad === 1) {
                    setVideos([]);
                }
                return;
            }
            
            // Генерируем данные для каждого локального видео с правильными названиями и описаниями
            const validatedVideos = videosForPage.map((videoUrl, idx) => {
                const globalIdx = startIdx + idx;
                return generateLocalVideoData(videoUrl, globalIdx);
            });
            
            if (validatedVideos.length < LIMIT || endIdx >= localVideos.length) {
                setHasMore(false);
            }
            if (pageToLoad === 1) {
                setVideos(validatedVideos);
                if (validatedVideos.length > 0) setActiveVideoId(validatedVideos[0].id);
            } else {
                setVideos(prev => [...prev, ...validatedVideos]);
            }
        } catch (error) {
            console.error("Ошибка загрузки видео:", error);
            
            // Используем локальные видео при ошибке
            if (pageToLoad === 1) {
                console.log("Используем локальные видео");
                const localData = localVideos.slice(0, LIMIT).map((url, idx) => generateLocalVideoData(url, idx));
                setVideos(localData);
                if (localData.length > 0) setActiveVideoId(localData[0].id);
                setHasMore(false);
            }
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    };

    useEffect(() => { fetchVideos(1); }, []);
    useEffect(() => { if (page > 1) { fetchVideos(page); } }, [page]);

    const toggleComments = () => setIsCommentsOpen(prev => !prev);
    const closeComments = () => setIsCommentsOpen(false);
    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);
    const openShareModal = () => setIsShareModalOpen(true);
    const closeShareModal = () => setIsShareModalOpen(false);
    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);
    const openEmbedModal = () => { setIsShareModalOpen(false); setIsEmbedModalOpen(true); };
    const closeEmbedModal = () => setIsEmbedModalOpen(false);

    const handleCopyLink = () => {
        const video = videos.find(v => v.id === activeVideoId);
        if (video) {
            navigator.clipboard.writeText(`https://www.youtube.com/shorts/${video.id}`);
            setShowToast(true);
            setIsShareModalOpen(false);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    const handleShareSocial = (platform) => {
        const video = videos.find(v => v.id === activeVideoId);
        if (!video) return;
        const url = encodeURIComponent(`https://www.youtube.com/shorts/${video.id}`);
        let link = "";
        if (platform === 'whatsapp') link = `https://api.whatsapp.com/send/?text=${url}&type=custom_url&app_absent=0`;
        else if (platform === 'facebook') link = `https://www.facebook.com/sharer/sharer.php?display=popup&sdk=joey&u=${url}`;
        if (link) { window.open(link, '_blank'); setIsShareModalOpen(false); }
    };

    const handleAuthAction = () => { setIsShareModalOpen(false); setIsLoginModalOpen(true); };
    const handleOpenPrivacy = () => { setIsLoginModalOpen(false); setActivePage('privacy'); };
    const handleOpenTerms = () => { setIsLoginModalOpen(false); setActivePage('terms'); };
    const handleBackToFeed = () => { setActivePage('feed'); };
    const handleGoHome = () => openLoginModal();
    const handleGoExplore = () => setActivePage('explore');
    const handleGoSubscriptions = () => openLoginModal();

    const handleScroll = (e) => {
        const container = e.target;
        const index = Math.round(container.scrollTop / container.clientHeight);
        if (videos[index] && videos[index].id !== activeVideoId) {
            setActiveVideoId(videos[index].id);
        }
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight - scrollTop <= clientHeight * 2.5) {
            if (hasMore && !isLoading && !isFetchingMore) {
                setPage(prev => prev + 1);
            }
        }
    };

    const scrollToNext = () => {
        if (feedRef.current) {
            const container = feedRef.current;
            container.scrollTo({ top: container.scrollTop + container.clientHeight, behavior: 'auto' });
        }
    };

    const scrollToPrev = () => {
        if (feedRef.current) {
            const container = feedRef.current;
            container.scrollTo({ top: container.scrollTop - container.clientHeight, behavior: 'auto' });
        }
    };

    // ГОРЯЧИЕ КЛАВИШИ (В ТОМ ЧИСЛЕ "M" ДЛЯ ЗВУКА)
    const { toggleMute } = useAudio();
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activePage !== 'explore') return;
            if (e.key === 'ArrowDown') { e.preventDefault(); scrollToNext(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); scrollToPrev(); }
            else if (e.key.toLowerCase() === 'm') { toggleMute(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeVideoId, videos, activePage, toggleMute]);

    const activeIndex = videos.findIndex(v => v.id === activeVideoId);
    if (isLoading && page === 1) return <AppSkeleton />;

    return (
        <div className="app-container">
            {showToast && <Toast message="Скопировано" />}
            {activePage === 'privacy' && <PrivacyPage onBack={handleBackToFeed} />}
            {activePage === 'terms' && <TermsPage onBack={handleBackToFeed} />}
            <SearchDrawer isOpen={isSearchOpen} onClose={closeSearch} history={searchHistory} onSearchSave={handleSearchSave} />

            {isLoginModalOpen && (
                <LoginModal onClose={closeLoginModal} onPrivacyClick={handleOpenPrivacy} onTermsClick={handleOpenTerms} />
            )}
            {isShareModalOpen && (
                <ShareModal onClose={closeShareModal} onLogin={handleAuthAction} onCopy={handleCopyLink} onShareSocial={handleShareSocial} onEmbed={openEmbedModal} />
            )}
            {isEmbedModalOpen && videos[activeIndex] && (
                <EmbedModal onClose={closeEmbedModal} videoUrl={`https://www.youtube.com/shorts/${videos[activeIndex].id}`} videoId={videos[activeIndex].id} username={videos[activeIndex].author.username} />
            )}

            {/* Верхняя панель (Header) */}
            <header className="top-header">
                <div className="header-left">
                    <button className="menu-btn" onClick={handleGoHome}>
                        <Menu size={24} color="white" />
                    </button>
                    <div className="header-logo" onClick={handleGoHome}>
                        <img src="/youtube-shorts-1.svg" alt="YouTube Shorts" className="header-logo-img" />
                    </div>
                </div>
                <div className="header-center">
                    <div className="header-search-bar" onClick={openSearch}>
                        <Search size={18} color="#8a8b91" />
                        <span className="header-search-text">Введите запрос</span>
                    </div>
                    <button className="header-mic-btn" onClick={openLoginModal}>
                        <Mic size={20} color="white" />
                    </button>
                </div>
                <div className="header-right">
                    <button className="header-create-btn" onClick={openLoginModal}>
                        <Plus size={20} color="white" />
                        <span>Создать</span>
                    </button>
                    <button className="header-notification-btn" onClick={openLoginModal}>
                        <Bell size={20} color="white" />
                        <span className="notification-badge">9+</span>
                    </button>
                    <button className="header-avatar-btn" onClick={openLoginModal}>
                        <img src={getAvatar('user')} alt="User" className="header-avatar" />
                    </button>
                </div>
            </header>

            <div className="app-main-content">
                <nav className="sidebar" onClick={(e) => e.stopPropagation()}>
                    <div className="nav-section">
                        <div className="nav-item" onClick={handleGoHome}>
                            <Home size={26} strokeWidth={2} color="white" />
                            <span style={{ color: 'white' }}>Главная</span>
                        </div>
                        <div className={`nav-item ${activePage === 'explore' ? 'active' : ''}`} onClick={handleGoExplore}>
                            <Compass size={26} strokeWidth={activePage === 'explore' ? 3 : 2} color={activePage === 'explore' ? '#FF0000' : 'white'} />
                            <span style={{ color: activePage === 'explore' ? '#FF0000' : 'white' }}>Shorts</span>
                        </div>
                        <div className="nav-item" onClick={handleGoSubscriptions}>
                            <Users size={26} strokeWidth={2} color="white" />
                            <span style={{ color: 'white' }}>Подписки</span>
                        </div>
                    </div>
                    <div className="nav-section-divider"></div>
                    <div className="nav-section">
                        <div className="nav-section-title">Вы</div>
                        <div className="nav-item" onClick={openLoginModal}>
                            <Clock size={26} strokeWidth={2} />
                            <span>История</span>
                        </div>
                        <div className="nav-item" onClick={openLoginModal}>
                            <List size={26} strokeWidth={2} />
                            <span>Плейлисты</span>
                        </div>
                    </div>
                </nav>

                {activePage === 'explore' && (
                <main ref={feedRef} className="feed-container" onScroll={handleScroll}>
                    <div className={`navigation-buttons ${isCommentsOpen ? 'shifted' : ''}`}>
                        <button className={`nav-btn-circle ${activeIndex === 0 ? 'disabled-top' : ''}`} onClick={scrollToPrev}><span className="arrow-custom up"></span></button>
                        <button className={`nav-btn-circle ${activeIndex === videos.length - 1 && !hasMore ? 'disabled-bottom' : ''}`} onClick={scrollToNext}><span className="arrow-custom down"></span></button>
                    </div>

                    {videos.map((video) => (
                        <VideoPlayer
                            key={video.id}
                            video={video}
                            isActive={activeVideoId === video.id}
                            isCommentsOpen={isCommentsOpen}
                            toggleComments={toggleComments}
                            closeComments={closeComments}
                            onLogin={openLoginModal}
                            onShare={openShareModal}
                            onScrollDown={scrollToNext}
                        />
                    ))}
                    {isFetchingMore && <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'gray'}}>Загрузка видео...</div>}
                </main>
            )}
                {activePage === 'subscriptions' && <SubscriptionsPage onLogin={openLoginModal} />}
            </div>
        </div>
    );
}

// ЭКСПОРТ С ПРОВАЙДЕРОМ
export default function App() {
    return (
        <AudioProvider>
            <AppContent />
        </AudioProvider>
    );
}