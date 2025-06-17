import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCardToStorage } from '../utils/localStorage';
// Camera imports removed
import { useTranslation } from 'react-i18next';
import Notification from './Notification'; // Import Notification component
import './AddCardForm.css';

const AddCardForm = () => {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  // showCamera state removed
  const [notification, setNotification] = useState({ message: '', type: 'success' }); // Notification state
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cardNumber || !storeName) {
      setNotification({ message: t('addCardForm.fillFieldsAlert'), type: 'error' });
      return;
    }
    addCardToStorage({ cardNumber, storeName });
    setNotification({ message: t('addCardForm.cardAddedSuccess'), type: 'success' });
    setCardNumber('');
    setStoreName('');
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
        {/* "Add by Photo" button removed */}
      </div>
    </form>
  </>
  );
};

export default AddCardForm;
