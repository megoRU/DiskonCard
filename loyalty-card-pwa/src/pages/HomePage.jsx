import React, { useState, useEffect, useCallback } from "react";
import {
  getCardsFromStorage,
  deleteCardFromStorage,
  saveCardsToStorage,
} from "../utils/localStorage";
import BarcodeModal from "../components/BarcodeModal.jsx";
import { useLongPress } from "use-long-press";
import { FiTrash2 } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./HomePage.css";

const HomePage = ({ isEditMode, setIsEditMode }) => {
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

  const handleLongPress = useCallback(
    (event, { context: cardId }) => {
      if (!isEditMode) {
        setIsEditMode(true);
      }
    },
    [isEditMode, setIsEditMode],
  );

  const longPressOptions = { threshold: 500 };
  const bind = useLongPress(
    isEditMode ? null : handleLongPress,
    longPressOptions,
  );

  const handleCardClick = (card) => {
    if (!isEditMode) {
      setSelectedCardForBarcode(card);
      setIsBarcodeModalOpen(true);
    }
  };

  const handleDeleteCard = (cardId, event) => {
    event.stopPropagation();
    if (window.confirm("Вы уверены, что хотите удалить эту карту?")) {
      deleteCardFromStorage(cardId);
      const updatedCards = cards.filter((card) => card.id !== cardId);
      setCards(updatedCards);
      if (updatedCards.length === 0) setIsEditMode(false);
    }
  };

  const handleCloseModal = () => {
    setIsBarcodeModalOpen(false);
    setSelectedCardForBarcode(null);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination || !isEditMode) return;
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCards([...items]);
    saveCardsToStorage(items);
  };

  const renderCardContent = (card, index, isDraggable) => {
    // card.coverImage is now expected to always be a base64 data URL.
    // It's populated during card creation (AddCardForm) from either a fetched predefined logo
    // or a user-uploaded file, with a fallback to a default logo's base64.
    const bgImage = card.coverImage;
    // const fallbackImage = "/card-logos/default.png"; // Удалено, так как связанный img удален

    const cardInner = (
      <div
        className={`card-item ${isEditMode ? "card-item-edit-mode" : ""}`}
        onClick={() => handleCardClick(card)}
        {...bind(card.id)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) =>
          (e.key === "Enter" || e.key === " ") && handleCardClick(card)
        }
        style={{
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        }}
      >
        {/* Скрытый тег img для обработки onError удален, так как он был избыточен.
            Fallback для backgroundImage обеспечивается CSS свойством background-color. */}
        {isEditMode && (
          <button
            className="delete-card-btn"
            onClick={(e) => handleDeleteCard(card.id, e)}
            aria-label="Удалить карту"
          >
            <FiTrash2 />
          </button>
        )}
      </div>
    );

    if (isDraggable) {
      return (
        <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={provided.draggableProps.style}
            >
              {cardInner}
            </div>
          )}
        </Draggable>
      );
    }

    return <div key={card.id}>{cardInner}</div>;
  };

  const cardsContainerClass = isEditMode
    ? "cards-grid cards-container-edit-mode"
    : "cards-grid";

  return (
    <div className="home-page">
      <h1>Ваши карты</h1>
      {cards.length === 0 && !isEditMode ? (
        <div className="no-cards-message">
          <p>Карт пока нет. Добавьте свою первую карту!</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable
            droppableId="cardsDroppableArea"
            direction="vertical"
            isDropDisabled={!isEditMode}
            isCombineEnabled={false}
          >
            {(provided) => (
              <div
                className={cardsContainerClass}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {cards.map((card, index) =>
                  renderCardContent(card, index, isEditMode),
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
