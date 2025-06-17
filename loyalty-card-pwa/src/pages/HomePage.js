import React, { useState, useEffect } from 'react';
import { getCardsFromStorage } from '../utils/localStorage';
import { useTranslation } from 'react-i18next';
import BarcodeModal from '../components/BarcodeModal'; // Import the modal
import './HomePage.css';

const HomePage = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [selectedCardForBarcode, setSelectedCardForBarcode] = useState(null);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);

  useEffect(() => {
    const storedCards = getCardsFromStorage();
    setCards(storedCards);
  }, []);

  const handleCardClick = (card) => {
    setSelectedCardForBarcode(card);
    setIsBarcodeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBarcodeModalOpen(false);
    setSelectedCardForBarcode(null);
  };

  return (
    <div className="home-page">
      <h1>{t('homePage.title')}</h1>
      {cards.length === 0 ? (
        <div className="no-cards-message">
          <p>{t('homePage.noCardsMessage')}</p>
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map(card => (
            <div
              key={card.id}
              className="card-item"
              onClick={() => handleCardClick(card)}
              role="button" // Make it clear it's clickable
              tabIndex={0}  // Make it focusable
              onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(card)} // Keyboard accessibility
            >
              <h3>{card.storeName}</h3>
              <p className="card-number">{card.cardNumber}</p>
            </div>
          ))}
        </div>
      )}
      {isBarcodeModalOpen && selectedCardForBarcode && (
        <BarcodeModal
          cardData={selectedCardForBarcode}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default HomePage;
