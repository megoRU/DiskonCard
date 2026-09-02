const CARDS_STORAGE_KEY = "loyaltyCards";

export const getCardsFromStorage = () => {
  try {
    const cardsJson = localStorage.getItem(CARDS_STORAGE_KEY);
    return cardsJson ? JSON.parse(cardsJson) : [];
  } catch (error) {
    console.error("Error reading cards from localStorage:", error);
    return [];
  }
};

export const saveCardsToStorage = (cards) => {
  try {
    if (!Array.isArray(cards)) return false;
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
    return true;
  } catch (error) {
    console.error("Error saving cards to localStorage:", error);
    return false;
  }
};

export const addCardToStorage = (newCard) => {
  if (!newCard || typeof newCard !== "object") return null;
  const cards = getCardsFromStorage();
  const cardToAdd = {
    storeName: newCard.storeName || "",
    cardNumber: newCard.cardNumber || "",
    coverImage: newCard.coverImage || null,
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    dateAdded: new Date().toISOString(),
  };
  cards.push(cardToAdd);
  saveCardsToStorage(cards);
  return cardToAdd;
};

export const deleteCardFromStorage = (cardId) => {
  if (!cardId) return getCardsFromStorage();
  let cards = getCardsFromStorage();
  cards = cards.filter((card) => String(card.id) !== String(cardId));
  saveCardsToStorage(cards);
  return cards;
};
