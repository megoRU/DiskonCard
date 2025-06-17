const CARDS_STORAGE_KEY = 'loyaltyCards';

export const getCardsFromStorage = () => {
  const cardsJson = localStorage.getItem(CARDS_STORAGE_KEY);
  return cardsJson ? JSON.parse(cardsJson) : [];
};

export const saveCardsToStorage = (cards) => {
  localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
};

export const addCardToStorage = (newCard) => {
  const cards = getCardsFromStorage();
  // Add a unique ID and date added
  const cardToAdd = {
    ...newCard,
    id: Date.now().toString(), // Simple unique ID
    dateAdded: new Date().toISOString(),
  };
  cards.push(cardToAdd);
  saveCardsToStorage(cards);
  return cardToAdd; // Return the card with id and dateAdded
};

export const deleteCardFromStorage = (cardId) => {
  let cards = getCardsFromStorage();
  cards = cards.filter(card => card.id !== cardId);
  saveCardsToStorage(cards);
  return cards; // Return the updated list of cards, or just true/false for success
};
