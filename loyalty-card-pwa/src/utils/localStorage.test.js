import { addCardToStorage, getCardsFromStorage, saveCardsToStorage } from './localStorage';

// Mock localStorage
const mockStoreInstance = {}; // Use a single object instance

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(key => {
      // console.log(`MOCK LS GET: key='${key}', value='${mockStoreInstance[key]}' (type: ${typeof mockStoreInstance[key]})`);
      // Ensure that if a key truly doesn't exist, it returns null, not undefined.
      return mockStoreInstance.hasOwnProperty(key) ? mockStoreInstance[key] : null;
    }),
    setItem: jest.fn((key, value) => {
      // console.log(`MOCK LS SET: key='${key}', value='${value}' (type: ${typeof value})`);
      mockStoreInstance[key] = value; // Value must be a string
    }),
    clear: jest.fn(() => {
      // console.log('MOCK LS CLEAR: store was', JSON.stringify(mockStoreInstance));
      // Clear properties of the existing object, don't reassign the top-level variable
      for (const key in mockStoreInstance) {
        if (mockStoreInstance.hasOwnProperty(key)) {
          delete mockStoreInstance[key];
        }
      }
      // console.log('MOCK LS CLEAR: store is now', JSON.stringify(mockStoreInstance));
    }),
    removeItem: jest.fn(key => {
      // console.log(`MOCK LS REMOVE: key='${key}'`);
      delete mockStoreInstance[key];
    }),
  }
});

describe('localStorage Utils', () => {
  beforeEach(() => {
    localStorage.clear(); // This will now empty the properties of mockStoreInstance
    Object.values(window.localStorage).forEach(mockFn => {
      if (jest.isMockFunction(mockFn) && mockFn.mockClear) {
        mockFn.mockClear();
      }
    });
    // console.log('--- Test Start ---');
  });

  describe('addCardToStorage', () => {
    it('should add a new card with a unique ID and dateAdded', () => {
      // console.log('Test 1: Initial mockStoreInstance:', JSON.stringify(mockStoreInstance));
      const newCard = { storeName: 'Test Store', cardNumber: '12345' };
      const addedCard = addCardToStorage(newCard);
      // console.log('Test 1: addedCard object:', JSON.stringify(addedCard));
      // console.log('Test 1: mockStoreInstance after addCardToStorage:', JSON.stringify(mockStoreInstance)); // Corrected variable name

      expect(addedCard.storeName).toBe('Test Store');
      expect(addedCard.cardNumber).toBe('12345');
      expect(addedCard.id).toBeDefined();
      expect(addedCard.dateAdded).toBeDefined();

      const cardsInStorageString = localStorage.getItem('loyaltyCards');
      console.log('Test 1: cardsInStorageString from getItem:', cardsInStorageString,`(type: ${typeof cardsInStorageString})`);

      expect(cardsInStorageString).not.toBeNull();
      // Add an assertion to ensure cardsInStorageString is a string, as JSON.parse expects a string.
      expect(typeof cardsInStorageString).toBe('string');
      const cardsInStorage = JSON.parse(cardsInStorageString);

      expect(cardsInStorage.length).toBe(1);
      expect(cardsInStorage[0]).toEqual(addedCard);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      // Verify setItem was called with the correct stringified data that getItem later returned
      expect(localStorage.setItem).toHaveBeenCalledWith('loyaltyCards', cardsInStorageString);
    });

    it('should add to existing cards', () => {
      // console.log('Test 2: Initial mockStoreInstance:', JSON.stringify(mockStoreInstance)); // Corrected variable name
      const date = new Date().toISOString();
      const initialCards = [{ id: '1', storeName: 'Old Store', cardNumber: '000', dateAdded: date }];
      localStorage.setItem('loyaltyCards', JSON.stringify(initialCards));
      localStorage.setItem.mockClear();

      const newCard = { storeName: 'New Store', cardNumber: '111' };
      const addedCard = addCardToStorage(newCard);
      // console.log('Test 2: addedCard object:', JSON.stringify(addedCard));
      // console.log('Test 2: mockStoreInstance after addCardToStorage:', JSON.stringify(mockStoreInstance)); // Corrected variable name

      const cardsInStorageString = localStorage.getItem('loyaltyCards');
      // console.log('Test 2: cardsInStorageString from getItem:', cardsInStorageString);
      expect(cardsInStorageString).not.toBeNull();
      expect(typeof cardsInStorageString).toBe('string');
      const cardsInStorage = JSON.parse(cardsInStorageString);

      expect(cardsInStorage.length).toBe(2);
      expect(cardsInStorage[1].storeName).toBe('New Store');
      expect(cardsInStorage[1].id).toBe(addedCard.id); // Check new card details
      expect(cardsInStorage[0]).toEqual(initialCards[0]);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCardsFromStorage', () => {
    it('should return an empty array if no cards are in storage', () => {
      // console.log('Test 3: Initial mockStoreInstance:', JSON.stringify(mockStoreInstance)); // Corrected variable name
      const cards = getCardsFromStorage();
      expect(cards).toEqual([]);
      expect(localStorage.getItem).toHaveBeenCalledWith('loyaltyCards');
    });

    it('should return cards if they exist in storage', () => {
      // console.log('Test 4: Initial mockStoreInstance:', JSON.stringify(mockStoreInstance)); // Corrected variable name
      const date = new Date().toISOString();
      const mockCards = [{ id: '1', storeName: 'Store A', cardNumber: '123', dateAdded: date }];
      localStorage.setItem('loyaltyCards', JSON.stringify(mockCards));
      // No need to clear getItem mock history here unless specifically testing call order for getItem
      // localStorage.getItem.mockClear();
      // console.log('Test 4: mockStoreInstance after setItem:', JSON.stringify(mockStoreInstance)); // Corrected variable name


      const cards = getCardsFromStorage();
      // console.log('Test 4: cards from getCardsFromStorage:', JSON.stringify(cards));
      expect(cards).toEqual(mockCards);
      expect(localStorage.getItem).toHaveBeenCalledWith('loyaltyCards');
    });
  });

  describe('saveCardsToStorage', () => {
    it('should save all cards to localStorage, overwriting existing ones', () => {
      // console.log('Test 5: Initial mockStoreInstance:', JSON.stringify(mockStoreInstance)); // Corrected variable name
      const initialDate = new Date().toISOString();
      const date1 = new Date().toISOString();
      const date2 = new Date().toISOString();

      const initialCards = [{ id: 'old', storeName: 'Old', cardNumber: '0', dateAdded: initialDate }];
      localStorage.setItem('loyaltyCards', JSON.stringify(initialCards));
      localStorage.setItem.mockClear();
      // console.log('Test 5: mockStoreInstance after initial setItem:', JSON.stringify(mockStoreInstance)); // Corrected variable name

      const cardsToSave = [
        { id: '1', storeName: 'Store X', cardNumber: '100', dateAdded: date1 },
        { id: '2', storeName: 'Store Y', cardNumber: '200', dateAdded: date2 }
      ];
      saveCardsToStorage(cardsToSave);
      // console.log('Test 5: mockStoreInstance after saveCardsToStorage:', JSON.stringify(mockStoreInstance)); // Corrected variable name


      expect(localStorage.setItem).toHaveBeenCalledWith('loyaltyCards', JSON.stringify(cardsToSave));
      const cardsInStorageString = localStorage.getItem('loyaltyCards');
      // console.log('Test 5: cardsInStorageString from getItem:', cardsInStorageString);
      expect(cardsInStorageString).not.toBeNull();
      expect(typeof cardsInStorageString).toBe('string');
      const cardsInStorage = JSON.parse(cardsInStorageString);
      expect(cardsInStorage).toEqual(cardsToSave);
      expect(cardsInStorage.length).toBe(2);
    });
  });
});
