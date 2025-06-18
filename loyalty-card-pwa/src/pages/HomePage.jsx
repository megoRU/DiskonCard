import React, { useState, useEffect, useCallback } from 'react';
import { getCardsFromStorage, deleteCardFromStorage, saveCardsToStorage } from '../utils/localStorage'; // Import saveCardsToStorage
import { useTranslation } from 'react-i18next';
import BarcodeModal from '../components/BarcodeModal.jsx'; // Updated import
import { useLongPress } from 'use-long-press';
import { FiTrash2 } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; // Import dnd components
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

    setCards([...items]);
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
          <Droppable
            droppableId="cardsDroppableArea"
            direction="vertical"
            isDropDisabled={!isEditMode}
            isCombineEnabled={false} // Explicitly set
          >
            {(provided, snapshot) => (
              <div
                className={cardsContainerClass}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {isEditMode ? (
                  cards.map((card, index) => {
                    let bgImage = null;
                    if (card.coverImage) {
                      bgImage = card.coverImage;
                    } else if (card.logoUrl && card.logoUrl !== '/card-logos/default.png') {
                      bgImage = card.logoUrl;
                    }
                    return (
                    <Draggable
                      key={card.id}
                      draggableId={card.id.toString()}
                      index={index}
                      isDragDisabled={!isEditMode} // This will always be false here, but keep for consistency
                    >
                      {(providedDraggable, snapshotDraggable) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps} // Apply drag handle to the whole card
                          style={{
                            ...providedDraggable.draggableProps.style,
                            backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                          }}
                          className={`card-item ${isEditMode ? 'card-item-edit-mode' : ''} ${snapshotDraggable.isDragging ? 'card-item-dragging' : ''}`}
                          onClick={() => handleCardClick(card)}
                          {...bind(card.id)} // Long press binding
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(card)}
                        >
                          {card.coverImage && (
                            <img
                              src={card.logoUrl || '/card-logos/default.png'}
                              alt={t('homePage.cardLogoAlt', { storeName: card.storeName || t('homePage.defaultCardName', 'Card') })}
                              className="card-logo"
                              onError={(e) => { e.target.src = '/card-logos/default.png'; }}
                            />
                          )}
                          {isEditMode && (
                            <button
                              className="delete-card-btn"
                              onClick={(e) => handleDeleteCard(card.id, e)}
                              aria-label={t('homePage.deleteCardAriaLabel', 'Delete card')}
                            >
                              <FiTrash2 />
                            </button>
                          )}
                          {/* Text content removed to show background image */}
                        </div>
                      )}
                    </Draggable>
                  );
                })
                ) : (
                  cards.map((card) => { // No index needed if not dragging
                    let bgImage = null;
                    if (card.coverImage) {
                      bgImage = card.coverImage;
                    } else if (card.logoUrl && card.logoUrl !== '/card-logos/default.png') {
                      bgImage = card.logoUrl;
                    }
                    return (
                    <div
                      key={card.id} // Still need a key for React list rendering
                      className={`card-item`} // Base class, no edit-mode or dragging specific classes
                      style={{
                        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                      }}
                      onClick={() => handleCardClick(card)}
                      {...bind(card.id)} // Long press binding for entering edit mode
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(card)}
                    >
                      {card.coverImage && (
                        <img
                          src={card.logoUrl || '/card-logos/default.png'}
                          alt={t('homePage.cardLogoAlt', { storeName: card.storeName || t('homePage.defaultCardName', 'Card') })}
                          className="card-logo"
                          onError={(e) => { e.target.src = '/card-logos/default.png'; }}
                        />
                      )}
                      {/* No delete button when not in edit mode */}
                    </div>
                  );
                })
                )}
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
