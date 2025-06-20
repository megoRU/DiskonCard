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
import { imageUrlToBase64 } from '../utils/imageUtils';

const popularStores = ["Магнит", "X5", "Дикси", "Окей", "Лента", "FixPrice", "METRO"];

const AddCardPage = () => {
    const [storeName, setStoreName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [imageBase64, setImageBase64] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const navigate = useNavigate();

    const onTextInputChange = e => {
        const text = e.target.value;
        setStoreName(text);
        // setCoverImage(null); // Reset cover image when store name changes - This will be handled by specific cases or default
        // setImageBase64(null); // Reset logo data URL - This will be handled by specific cases or default

        const updateImageData = async (imageUrl) => {
            try {
                const base64Data = await imageUrlToBase64(imageUrl);
                setImageBase64(base64Data);
            } catch (error) {
                console.error("Failed to convert image to base64:", error);
                // Optionally, set to a fallback or null
                setImageBase64(null);
                // setCoverImage(null); // coverImage should retain its original path or be null if not a predefined store
            }
        };

        switch (text) {
            case "X5":
                setCoverImage(x5); // Set coverImage state to the original path
                updateImageData(x5); // This will set imageBase64 state via setImageBase64
                break;
            case "Магнит":
                setCoverImage(magnit);
                updateImageData(magnit);
                break;
            case "Дикси":
                setCoverImage(dixy);
                updateImageData(dixy);
                break;
            case "Окей":
                setCoverImage(okey);
                updateImageData(okey);
                break;
            case "Лента":
                setCoverImage(lenta);
                updateImageData(lenta);
                break;
            case "FixPrice":
                setCoverImage(fixprice);
                updateImageData(fixprice);
                break;
            case "METRO":
                setCoverImage(metro);
                updateImageData(metro);
                break;
            default:
                setImageBase64(null);
                setCoverImage(null);
        }
    };

    const onCoverImageChange = e => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageBase64(reader.result);
            setCoverImage(null);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = e => {
        e.preventDefault();

        addCardToStorage({
            cardNumber,
            storeName,
            logoUrl: coverImage,
            coverImage: imageBase64,
        });

        setCardNumber("");
        setStoreName("");
        setCoverImage(null);
        setImageBase64(null);
        navigate("/");
    };

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
                    placeholder="Номер карты"
                    required
                />

                <label htmlFor="coverImage">Обложка карты (изображение):</label>
                <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={onCoverImageChange}
                />

                {imageBase64 && (
                    <div className="image-preview">
                        <img
                            src={imageBase64}
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
