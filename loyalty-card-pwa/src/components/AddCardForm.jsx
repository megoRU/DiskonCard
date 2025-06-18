import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { addCardToStorage } from '../utils/localStorage';
import { getStoreLogoUrl } from '../utils/storeLogos.js'; // Import getStoreLogoUrl
// Camera imports removed
import { useTranslation } from 'react-i18next';
import Notification from './Notification'; // Import Notification component
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

const AddCardForm = () => {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [coverImageData, setCoverImageData] = useState(null); // State for cover image data URL
  const [selectedStoreLogoUrl, setSelectedStoreLogoUrl] = useState(null); // State for store logo URL
  // showCamera state removed
  const [notification, setNotification] = useState({ message: '', type: 'success' }); // Notification state
  const navigate = useNavigate();

  useEffect(() => {
    if (storeName) {
      const logoUrl = getStoreLogoUrl(storeName);
      setSelectedStoreLogoUrl(logoUrl);
    } else {
      setSelectedStoreLogoUrl(null); // Reset logo if storeName is empty
    }
  }, [storeName]); // Run effect when storeName changes

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
    addCardToStorage({
      cardNumber,
      storeName,
      coverImage: coverImageData,
      storeLogoUrl: selectedStoreLogoUrl // Pass selectedStoreLogoUrl
    });
    setNotification({ message: t('addCardForm.cardAddedSuccess'), type: 'success' });
    setCardNumber('');
    setStoreName('');
    setCoverImageData(null); // Reset cover image data
    setSelectedStoreLogoUrl(null); // Reset store logo URL
    // navigate('/'); // Navigation might be too fast, consider delaying or allowing user to see notification
    // For now, let's keep navigation to see how it behaves with notification.
    // If notification isn't visible long enough, could navigate in onClose of Notification
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
        {selectedStoreLogoUrl && (
          <div className="store-logo-preview" style={{ marginTop: '5px', marginBottom: '15px', textAlign: 'left' }}>
            <img src={selectedStoreLogoUrl} alt={t('addCardForm.storeLogoAlt', `${storeName} Logo`)} style={{ maxHeight: '40px', maxWidth: '150px', display: 'inline-block', verticalAlign: 'middle' }} />
          </div>
        )}
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
