import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCardToStorage } from '../utils/localStorage';
// import { getStoreLogoUrl } from '../utils/storeLogos.js'; // Will be removed
import { useTranslation } from 'react-i18next';
import Notification from './Notification';
import './AddCardForm.css';

const popularStores = [
  "Магнит",
  "Пятёрочка",
  "Перекрёсток",
  "Лента",
  "М.Видео",
  "Спортмастер",
  "Л'Этуаль",
  "DNS",
  "Ozon",
  "Wildberries"
];

// Task Step 1: Transliteration function and map
const storeNameMap = {
  'пятёрочка': 'pyaterochka',
  'пятерочка': 'pyaterochka',
  'перекресток': 'perekrestok',
  'перекрёсток': 'perekrestok',
  'окей': 'okey',
  'дикси': 'dixy',
  'магнит': 'magnit',
};

function getAsciiStoreName(name) {
  const lowerName = name.trim().toLowerCase();
  if (storeNameMap[lowerName]) {
    return storeNameMap[lowerName];
  }
  const rusToLat = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  let asciiName = '';
  for (let i = 0; i < lowerName.length; i++) {
    asciiName += rusToLat[lowerName[i]] || lowerName[i];
  }
  // Remove non-alphanumeric characters except underscore, and replace spaces
  return asciiName.replace(/[^a-z0-9_]/g, '').replace(/\s+/g, '_');
}

const AddCardForm = () => {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [storeName, setStoreName] = useState('');

  // Task 1: Log raw storeName
  useEffect(() => {
    console.log("StoreName updated (raw):", storeName);
  }, [storeName]);

  const [logoUrl, setLogoUrl] = useState('/card-logos/default.png'); // New state for logoUrl
  const [coverImageData, setCoverImageData] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const navigate = useNavigate();

  // Task Step 2: Updated useEffect for logoUrl
  useEffect(() => {
    if (!storeName.trim()) {
      setLogoUrl('/card-logos/default.png');
      // Task 2: Log inside useEffect for logoUrl (added a specific log for this case)
      console.log("AddCardForm - useEffect for logoUrl: storeName is empty, set to default.png");
      return;
    }
    const asciiName = getAsciiStoreName(storeName);
    const newLogoUrl = asciiName ? `/card-logos/${asciiName}.png` : '/card-logos/default.png';
    // Task 2: Log inside useEffect for logoUrl
    console.log("AddCardForm - useEffect for logoUrl: storeName=", storeName, ", asciiName=", asciiName, ", newLogoUrl=", newLogoUrl);
    setLogoUrl(newLogoUrl);
  }, [storeName]);

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageData(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImageData(null); // Reset if file is not an image or not selected
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cardNumber || !storeName) {
      setNotification({ message: t('addCardForm.fillFieldsAlert'), type: 'error' });
      return;
    }
    // Task 3: Log in handleSubmit
    console.log("AddCardForm - handleSubmit: storeName=", storeName, ", logoUrl=", logoUrl);
    addCardToStorage({
      cardNumber,
      storeName,
      logoUrl: logoUrl, // Save the new logoUrl
      coverImage: coverImageData,
    });
    setNotification({ message: t('addCardForm.cardAddedSuccess'), type: 'success' });
    setCardNumber('');
    setStoreName(''); // This will trigger useEffect and reset logoUrl to default via setStoreName
    setCoverImageData(null);
    // setSelectedStoreLogoUrl(null); // Removed
    // or after a short delay.
    setTimeout(() => navigate('/'), 500); // Delay navigation slightly
  };

  // handleTakePhoto function removed

  // Camera conditional rendering removed

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />
      <form onSubmit={handleSubmit} className="add-card-form">
        <div className="form-group">
          <label htmlFor="storeName">{t('addCardForm.storeNameLabel')}</label>
        <input
          type="text"
          id="storeName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder={t('addCardForm.storeNamePlaceholder', 'e.g. Coffee Shop')}
          required
          list="store-suggestions" // Added list attribute
        />
        {/* Added datalist */}
        <datalist id="store-suggestions">
          {popularStores.map((store, index) => (
            <option key={index} value={store} />
          ))}
        </datalist>
        {/* Logo preview using logoUrl state and onError handler */}
        <div className="store-logo-preview" style={{ marginTop: '5px', marginBottom: '15px', textAlign: 'left' }}>
          <img
            src={logoUrl}
            alt={t('addCardForm.storeLogoAlt', { storeName: storeName || 'Default' })}
            /* style attribute removed, expecting styles from AddCardForm.css */
            onError={(e) => { e.target.src = '/card-logos/default.png'; }}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="cardNumber">{t('addCardForm.cardNumberLabel')}</label>
        <input
          type="tel" // Changed type to "tel"
          inputMode="numeric" // Added inputMode="numeric"
          id="cardNumber"
          value={cardNumber}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
            setCardNumber(numericValue);
          }}
          placeholder={t('addCardForm.cardNumberPlaceholder', 'e.g. 123456789')}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="coverImage">{t('addCardForm.coverImageLabel', 'Обложка карты (изображение)')}</label>
        <input
          type="file"
          id="coverImage"
          accept="image/*"
          onChange={handleCoverImageChange}
        />
        {coverImageData && (
          <div className="image-preview" style={{ marginTop: '10px' }}>
            <img src={coverImageData} alt={t('addCardForm.coverPreviewAlt', 'Предпросмотр обложки')} style={{ maxWidth: '100px', maxHeight: '100px', display: 'block' }} />
          </div>
        )}
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">{t('addCardForm.addCardButton')}</button>
        {/* "Add by Photo" button removed */}
      </div>
    </form>
  </>
  );
};

export default AddCardForm;
