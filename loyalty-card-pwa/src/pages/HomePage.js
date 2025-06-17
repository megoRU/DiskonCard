import React, { useState, useEffect, useCallback } from 'react';
import { getCardsFromStorage, deleteCardFromStorage, saveCardsToStorage } from '../utils/localStorage'; // Import saveCardsToStorage
import { useTranslation } from 'react-i18next';
import BarcodeModal from '../components/BarcodeModal';
import { useLongPress } from 'use-long-press';
import { FiTrash2 } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Import dnd components
import './HomePage.css';

const HomePage = ({ isEditMode, setIsEditMode }) => {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [selectedCardForBarcode, setSelectedCardForBarcode] = useState(null);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);

  const fetchCards = useCallback(() => {
    const storedCards = getCardsFromStorage();
    setCards(storedCards);
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleLongPress = useCallback((event, { context: cardId }) => {
    if (!isEditMode) {
      setIsEditMode(true);
    }
  }, [isEditMode, setIsEditMode]);

  const longPressOptions = { threshold: 500 };
  const bind = useLongPress(isEditMode ? null : handleLongPress, longPressOptions);

  const handleCardClick = (card) => {
    if (isEditMode) {
      // In edit mode, clicking a card does nothing for now (could be selection later)
      // Delete is handled by a separate button.
    } else {
      setSelectedCardForBarcode(card);
      setIsBarcodeModalOpen(true);
    }
  };

  const handleDeleteCard = (cardId, event) => {
    event.stopPropagation();
    if (window.confirm(t('homePage.confirmDeleteMessage'))) {
      deleteCardFromStorage(cardId);
      const updatedCards = cards.filter(card => card.id !== cardId);
      setCards(updatedCards); // Update local state immediately
      if (updatedCards.length === 0) {
        setIsEditMode(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsBarcodeModalOpen(false);
    setSelectedCardForBarcode(null);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination || !isEditMode) {
      return;
    }
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCards(items);
    saveCardsToStorage(items);
  };

  const cardsContainerClass = isEditMode ? "cards-grid cards-container-edit-mode" : "cards-grid";

  return (
    <div className="home-page">
      <h1>{t('homePage.title')}</h1>
      {cards.length === 0 && !isEditMode ? ( // Hide "no cards" message if in edit mode with 0 cards (edge case)
        <div className="no-cards-message">
          <p>{t('homePage.noCardsMessage')}</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="cardsDroppableArea" direction="horizontal" isDropDisabled={!isEditMode}>
            {(provided, snapshot) => (
              <div
                className={cardsContainerClass}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {cards.map((card, index) => (
                  <Draggable
                    key={card.id}
                    draggableId={card.id}
                    index={index}
                    isDragDisabled={!isEditMode}
                  >
                    {(providedDraggable, snapshotDraggable) => (
                      <div
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps} // Apply drag handle to the whole card
                        style={{
                          ...providedDraggable.draggableProps.style,
                          // Add custom styles for dragging if needed:
                          // opacity: snapshotDraggable.isDragging ? 0.8 : 1,
                          // boxShadow: snapshotDraggable.isDragging ? '0 0 10px rgba(0,0,0,0.3)' : '',
                        }}
                        className={`card-item ${isEditMode ? 'card-item-edit-mode' : ''} ${snapshotDraggable.isDragging ? 'card-item-dragging' : ''}`}
                        onClick={() => handleCardClick(card)}
                        {...bind(card.id)} // Long press binding
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(card)}
                      >
                        {isEditMode && (
                          <button
                            className="delete-card-btn"
                            onClick={(e) => handleDeleteCard(card.id, e)}
                            aria-label={t('homePage.deleteCardAriaLabel', 'Delete card')}
                          >
                            <FiTrash2 />
                          </button>
                        )}
                        <h3>{card.storeName}</h3>
                        <p className="card-number">{card.cardNumber}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
