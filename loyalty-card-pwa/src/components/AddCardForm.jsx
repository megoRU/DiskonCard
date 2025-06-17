import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCardToStorage } from '../utils/localStorage';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useTranslation } from 'react-i18next';
import './AddCardForm.css';

const AddCardForm = () => {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cardNumber || !storeName) {
      alert(t('addCardForm.fillFieldsAlert'));
      return;
    }
    addCardToStorage({ cardNumber, storeName });
    alert(t('addCardForm.cardAddedSuccess'));
    setCardNumber('');
    setStoreName('');
    navigate('/');
  };

  const handleTakePhoto = (dataUri) => {
    console.log('Photo taken:', dataUri);
    alert(t('addCardForm.photoCapturedSuccess'));
    setShowCamera(false);
  };

  if (showCamera) {
    return (
      <div className="camera-container">
        <Camera
          onTakePhotoAnimationDone={handleTakePhoto}
          idealFacingMode="environment"
        />
        <button onClick={() => setShowCamera(false)} className="close-camera-btn">
          {t('addCardForm.closeCameraButton')}
        </button>
      </div>
    );
  }

  return (
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
        />
      </div>
      <div className="form-group">
        <label htmlFor="cardNumber">{t('addCardForm.cardNumberLabel')}</label>
        <input
          type="text"
          id="cardNumber"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder={t('addCardForm.cardNumberPlaceholder', 'e.g. 123456789')}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-btn">{t('addCardForm.addCardButton')}</button>
        <button
          type="button"
          onClick={() => setShowCamera(true)}
          className="photo-btn"
        >
          {t('addCardForm.addByPhotoButton')}
        </button>
      </div>
    </form>
  );
};

export default AddCardForm;
