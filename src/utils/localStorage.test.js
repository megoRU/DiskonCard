import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCardsFromStorage,
  saveCardsToStorage,
  addCardToStorage,
  deleteCardFromStorage,
} from './localStorage';

describe('localStorage utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return empty array when localStorage is empty', () => {
    expect(getCardsFromStorage()).toEqual([]);
  });

  it('should save and retrieve cards correctly', () => {
    const cards = [{ id: '1', storeName: 'X5', cardNumber: '123456' }];
    const saved = saveCardsToStorage(cards);
    expect(saved).toBe(true);
    expect(getCardsFromStorage()).toEqual(cards);
  });

  it('should add a new card with id and dateAdded', () => {
    const newCard = { storeName: 'Магнит', cardNumber: '987654' };
    const added = addCardToStorage(newCard);
    expect(added).not.toBeNull();
    expect(added.storeName).toBe('Магнит');
    expect(added.id).toBeDefined();
    expect(added.dateAdded).toBeDefined();

    const storedCards = getCardsFromStorage();
    expect(storedCards.length).toBe(1);
    expect(storedCards[0].cardNumber).toBe('987654');
  });

  it('should delete a card by id', () => {
    const card1 = addCardToStorage({ storeName: 'Store 1', cardNumber: '111' });
    const card2 = addCardToStorage({ storeName: 'Store 2', cardNumber: '222' });

    expect(getCardsFromStorage().length).toBe(2);

    deleteCardFromStorage(card1.id);
    const remaining = getCardsFromStorage();
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(card2.id);
  });
});
