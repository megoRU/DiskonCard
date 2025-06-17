import React, { useState, useEffect } from 'react';
import { getCardsFromStorage } from '../utils/localStorage';
import './HomePage.css'; // Import CSS for styling

const HomePage = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Fetch cards from localStorage when the component mounts
    const storedCards = getCardsFromStorage();
    setCards(storedCards);
  }, []);

  return (
    <div className="home-page">
      <h1>My Cards</h1>
      {cards.length === 0 ? (
        <div className="no-cards-message">
          <p>No cards yet. Add your first card!</p>
          {/* Link to add card page can be added here if desired */}
          {/* Example: <Link to="/add-card">Add Card</Link> */}
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map(card => (
            <div key={card.id} className="card-item">
              <h3>{card.storeName}</h3>
              <p className="card-number">{card.cardNumber}</p>
              {/* <p className="card-date">Added: {new Date(card.dateAdded).toLocaleDateString()}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
