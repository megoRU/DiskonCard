import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCardToStorage } from "../utils/localStorage";
import Notification from "../components/Notification";
import "./AddCardPage.css";

const popularStores = ["Магнит", "X5", "Дикси", "Окей", "Лента", "FixPrice", "METRO"];

const storeNameMap = {
    "пятёрочка": "x5",
    "пятерочка": "x5",
    "перекресток": "x5",
    "перекрёсток": "x5",
    "окей": "okey",
    "дикси": "dixy",
    "магнит": "magnit",
    "лента": "lenta",
    "fixprice": "fixprice",
    "FixPrice": "fixprice",
    "METRO": "metro"
};

const rusToLat = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh",
    щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function getAsciiStoreName(name) {
    const lower = name.trim().toLowerCase();
    if (storeNameMap[lower]) return storeNameMap[lower];
    return [...lower]
        .map(ch => rusToLat[ch] || ch)
        .join("")
        .replace(/[^a-z0-9_]/g, "")
        .replace(/\s+/g, "_");
}

const AddCardPage = () => {
    const [storeName, setStoreName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [debouncedStoreName, setDebouncedStoreName] = useState("");
    const [logoDataUrl, setLogoDataUrl] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [notification, setNotification] = useState({ message: "", type: "success" });
    const [imageLoadError, setImageLoadError] = useState(false);
    const navigate = useNavigate();

    // Дебаунсинг ввода названия магазина
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedStoreName(storeName.trim()), 400);
        return () => clearTimeout(timer);
    }, [storeName]);

    // Проверка, выбрана ли точная опция из списка
    const isStoreSelected = popularStores.includes(storeName.trim());

    // Загрузка логотипа по debouncedStoreName
    useEffect(() => {
        if (!debouncedStoreName) {
            setLogoDataUrl(null);
            setImageLoadError(false);
            return;
        }
        if (!isStoreSelected) {
            setLogoDataUrl(null);
            setImageLoadError(false);
            return;
        }

        const asciiName = getAsciiStoreName(debouncedStoreName);
        const logoUrl = `/card-logos/${asciiName}.png`;

        fetch(logoUrl)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoDataUrl(reader.result);
                    setImageLoadError(false);
                };
                reader.readAsDataURL(blob);
            })
            .catch(() => {
                setLogoDataUrl(null);
                setImageLoadError(true);
            });
    }, [debouncedStoreName, isStoreSelected]);

    // Обработка загрузки кастомной обложки
    const onCoverImageChange = e => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result);
                setLogoDataUrl(reader.result);
                setImageLoadError(false);
            };
            reader.readAsDataURL(file);
        } else {
            setCoverImage(null);
            setLogoDataUrl(null);
            setImageLoadError(false);
        }
    };

    // Отправка формы
    const onSubmit = e => {
        e.preventDefault();
        if (!cardNumber.trim() || !storeName.trim()) {
            setNotification({ message: 'Заполните "Номер карты" и "Название магазина".', type: "error" });
            return;
        }
        if (!isStoreSelected) {
            setNotification({ message: "Выберите магазин из списка.", type: "error" });
            return;
        }
        if (!logoDataUrl || imageLoadError) {
            setNotification({ message: "Ошибка загрузки логотипа.", type: "error" });
            return;
        }

        addCardToStorage({
            cardNumber,
            storeName,
            logoUrl: coverImage || `/card-logos/${getAsciiStoreName(storeName)}.png`,
            coverImage: logoDataUrl,
        });

        setNotification({ message: "Карта успешно добавлена!", type: "success" });
        setCardNumber("");
        setStoreName("");
        setCoverImage(null);
        setLogoDataUrl(null);
        navigate("/");
    };

    return (
        <div className="add-card-page">
            <h1>Добавление карты</h1>

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: "", type: "success" })}
            />

            <form onSubmit={onSubmit} className="add-card-form" noValidate>
                <label htmlFor="storeName">Название магазина:</label>
                <input
                    id="storeName"
                    type="text"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    placeholder="Выберите магазин из списка"
                    required
                    list="store-suggestions"
                    autoComplete="off"
                    spellCheck={false}
                />
                <datalist id="store-suggestions">
                    {popularStores.map((store, i) => (
                        <option key={i} value={store} />
                    ))}
                </datalist>

                <label htmlFor="cardNumber">Номер карты:</label>
                <input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="123456789"
                    required
                    inputMode="numeric"
                    pattern="[0-9]+"
                />

                <label htmlFor="coverImage">Обложка карты (изображение):</label>
                <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={onCoverImageChange}
                />

                {logoDataUrl && !imageLoadError && (
                    <div className="image-preview">
                        <img
                            src={logoDataUrl}
                            alt="Предпросмотр обложки"
                            className="preview-image"
                            onError={() => setLogoDataUrl(null)}
                        />
                    </div>
                )}

                <button type="submit" className="submit-btn" disabled={!isStoreSelected}>
                    Добавить карту
                </button>
            </form>
        </div>
    );
};

export default AddCardPage;
