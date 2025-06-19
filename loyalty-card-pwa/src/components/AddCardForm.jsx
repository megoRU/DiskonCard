import React, {useState, useEffect, useLayoutEffect} from "react";
import { useNavigate } from "react-router-dom";
import { addCardToStorage } from "../utils/localStorage";
import Notification from "./Notification";
import "./AddCardForm.css";

const HARDCODED_DEFAULT_LOGO_BASE64 = "";

const popularStores = [
  "Магнит",
  "X5",
  "Дикси",
  "Окей",
  "Лента",
  "FixPrice",
  "METRO"
];

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
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function getAsciiStoreName(name) {
  const lowerName = name.trim().toLowerCase();
  if (storeNameMap[lowerName]) return storeNameMap[lowerName];
  return [...lowerName]
      .map((ch) => rusToLat[ch] || ch)
      .join("")
      .replace(/[^a-z0-9_]/g, "")
      .replace(/\s+/g, "_");
}

const AddCardForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [storeName, setStoreName] = useState("");
  const [debouncedStoreName, setDebouncedStoreName] = useState("");
  const [selectedLogoDataUrl, setSelectedLogoDataUrl] = useState(null);
  const [coverImageData, setCoverImageData] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const [imageOnErrorRecoveryFlag, setImageOnErrorRecoveryFlag] = useState(0);
  const [imageLoadError, setImageLoadError] = useState(false);

  const navigate = useNavigate();

  useLayoutEffect(() => {
    const handler = setTimeout(() => setDebouncedStoreName(storeName), 500);
    return () => clearTimeout(handler);
  }, [storeName]);

  const fetchAndSetLogoDataUrl = async (imageUrl, fallbackUrl) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Primary logo not found");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedLogoDataUrl(reader.result);
        setImageLoadError(false);
      };
      reader.onerror = () => {
        setSelectedLogoDataUrl(null);
        setImageLoadError(true);
      };
      reader.readAsDataURL(blob);
    } catch {
      if (imageUrl !== fallbackUrl) {
        fetchAndSetLogoDataUrl(fallbackUrl, fallbackUrl);
      } else {
        setSelectedLogoDataUrl(null);
        setImageLoadError(true);
      }
    }
  };

  useLayoutEffect(() => {
    if (!debouncedStoreName.trim()) {
      fetchAndSetLogoDataUrl("/card-logos/default.png", "/card-logos/default.png");
      return;
    }
    const asciiName = getAsciiStoreName(debouncedStoreName);
    const logoPath = asciiName ? `/card-logos/${asciiName}.png` : "/card-logos/default.png";
    fetchAndSetLogoDataUrl(logoPath, "/card-logos/default.png");
  }, [debouncedStoreName, imageOnErrorRecoveryFlag]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageData(reader.result);
        setSelectedLogoDataUrl(reader.result);
        setImageLoadError(false);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImageData(null);
      const asciiName = getAsciiStoreName(debouncedStoreName);
      const logoPath = debouncedStoreName.trim() && asciiName
          ? `/card-logos/${asciiName}.png`
          : "/card-logos/default.png";
      fetchAndSetLogoDataUrl(logoPath, "/card-logos/default.png");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber.trim() || !storeName.trim()) {
      setNotification({ message: "Заполните поля \"Номер карты\" и \"Название магазина\".", type: "error" });
      return;
    }
    if (!selectedLogoDataUrl || imageLoadError) {
      setNotification({ message: "Ошибка загрузки логотипа.", type: "error" });
      return;
    }
    addCardToStorage({
      cardNumber,
      storeName,
      logoUrl: `/card-logos/${getAsciiStoreName(storeName)}.png`,
      coverImage: selectedLogoDataUrl,
    });
    setNotification({ message: "Карта успешно добавлена!", type: "success" });
    setCardNumber("");
    setStoreName("");
    setCoverImageData(null);
    navigate("/");
  };

  return (
      <>
        <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: "", type: "success" })}
        />
        <form onSubmit={handleSubmit} className="add-card-form">
          <div className="form-group">
            <label htmlFor="storeName">Название магазина:</label>
            <input
                id="storeName"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Название"
                required
                list="store-suggestions"
            />
            <datalist id="store-suggestions">
              {popularStores.map((store, i) => (
                  <option key={i} value={store} />
              ))}
            </datalist>
          </div>
          <div className="form-group">
            <label htmlFor="cardNumber">Номер карты:</label>
            <input
                id="cardNumber"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="123456789"
                required
            />
          </div>
          <div className="form-group">
            <label htmlFor="coverImage">Обложка карты (изображение)</label>
            <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
            />
            <div className="image-preview">
              {selectedLogoDataUrl && !imageLoadError ? (
                  <img
                      src={selectedLogoDataUrl}
                      alt="Предпросмотр обложки"
                      className="preview-image"
                      onError={() => setImageOnErrorRecoveryFlag((f) => f + 1)}
                  />
              ) : null}
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Добавить карту</button>
          </div>
        </form>
      </>
  );
};

export default AddCardForm;
