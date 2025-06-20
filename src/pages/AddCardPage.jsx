import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCardToStorage } from "../utils/localStorage";
import "./AddCardPage.css";
import x5 from '/image/x5.png';
import dixy from '/image/dixy.png';
import fixprice from '/image/fixprice.png';
import magnit from '/image/magnit.png';
import metro from '/image/metro.png';
import okey from '/image/okey.png';
import lenta from '/image/lenta.png';

const popularStores = ["Магнит", "X5", "Дикси", "Окей", "Лента", "FixPrice", "METRO"];

const AddCardPage = () => {
    const [storeName, setStoreName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [logoDataUrl, setLogoDataUrl] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const navigate = useNavigate();

    const onTextInputChange = e => {
        const text = e.target.value;
        setStoreName(text);

        switch (text) {
            case "X5":
                setLogoDataUrl(x5);
                setCoverImage(x5);
                break;
            case "Магнит":
                setLogoDataUrl(magnit);
                setCoverImage(magnit);
                break;
            case "Дикси":
                setLogoDataUrl(dixy);
                setCoverImage(dixy);
                break;
            case "Окей":
                setLogoDataUrl(okey);
                setCoverImage(okey);
                break;
            case "Лента":
                setLogoDataUrl(lenta);
                setCoverImage(lenta);
                break;
            case "FixPrice":
                setLogoDataUrl(fixprice);
                setCoverImage(fixprice);
                break;
            case "METRO":
                setLogoDataUrl(metro);
                setCoverImage(metro);
                break;
            default:
                setLogoDataUrl(null);
                setCoverImage(null);
        }
    };


    const onCoverImageChange = e => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setLogoDataUrl(reader.result);
            setCoverImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = e => {
        e.preventDefault();

        addCardToStorage({
            cardNumber,
            storeName,
            logoUrl: coverImage || `/images/${getAsciiStoreName(storeName)}.png`,
            coverImage: logoDataUrl,
        });

        setCardNumber("");
        setStoreName("");
        setCoverImage(null);
        setLogoDataUrl(null);
        navigate("/");
    };

    const getAsciiStoreName = name =>
        name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();

    if (coverImage) {
        console.log(coverImage.startsWith('data:image'));
    }

    return (
        <div className="add-card-page">
            <h1>Добавление карты</h1>

            <form onSubmit={onSubmit} className="add-card-form" noValidate>
                <label htmlFor="storeName">Название магазина:</label>
                <input
                    id="storeName"
                    type="text"
                    value={storeName}
                    onChange={onTextInputChange}
                    placeholder="Магазин"
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

                {logoDataUrl && (
                    <div className="image-preview">
                        <img
                            src={logoDataUrl}
                            alt="Предпросмотр обложки"
                            className="preview-image"
                        />
                    </div>
                )}

                <button type="submit" className="submit-btn">
                    Добавить карту
                </button>
            </form>
        </div>
    );
};

export default AddCardPage;
