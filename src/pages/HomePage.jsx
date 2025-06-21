import React, {useCallback, useLayoutEffect, useState} from "react";
import {
  deleteCardFromStorage,
  getCardsFromStorage,
  saveCardsToStorage,
} from "../utils/localStorage";
import BarcodeModal from "../components/BarcodeModal.jsx";
import {useLongPress} from "use-long-press";
import {FiTrash2} from "react-icons/fi";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import "./HomePage.css";

const HomePage = ({isEditMode, setIsEditMode}) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchCards = useCallback(() => {
    setCards(getCardsFromStorage());
  }, []);

  useLayoutEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleLongPress = useCallback(() => {
    if (!isEditMode) setIsEditMode(true);
  }, [isEditMode, setIsEditMode]);

  const bind = useLongPress(handleLongPress, {threshold: 500});

  const handleCardClick = (card) => {
    if (!isEditMode) setSelectedCard(card);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const card = cards.find(c => c.id === id);
    if (window.confirm(`Удалить ${card?.storeName || ""} карту?`)) {
      const updated = cards.filter(c => c.id !== id);
      setCards(updated);
      deleteCardFromStorage(id);
      if (!updated.length) setIsEditMode(false);
    }
  };

  const handleCloseModal = () => setSelectedCard(null);

  const onDragEnd = ({source, destination}) => {
    if (!destination || !isEditMode) return;
    const updated = [...cards];
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    setCards(updated);
    saveCardsToStorage(updated);
  };

  const renderCard = (card, index) => {
    const cardElement = (
        <div
            className={`card-item ${isEditMode ? "card-item-edit-mode" : ""}`}
            style={{backgroundImage: card.coverImage ? `url(${card.coverImage})` : undefined}}
            onClick={() => handleCardClick(card)}
            {...bind(card.id)}
            role="button"
            tabIndex={0}
        >
          {isEditMode && (
              <button
                  className="delete-card-btn"
                  onClick={(e) => handleDelete(card.id, e)}
                  aria-label="Удалить карту"
              >
                <FiTrash2 />
              </button>
          )}
        </div>
    );

    return (
        <Draggable
            key={card.id}
            draggableId={String(card.id)}
            index={index}
            isDragDisabled={!isEditMode}
        >
          {(provided) => (
              <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...(isEditMode ? provided.dragHandleProps : {})}
                  style={provided.draggableProps.style}
              >
                {cardElement}
              </div>
          )}
        </Draggable>
    );
  };

  return (
      <div className="home-page">
        <h1>Ваши карты</h1>
        {!cards.length && !isEditMode ? (
            <div className="no-cards-message">
              <p>Добавьте свою первую карту!</p>
            </div>
        ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="cards" direction="vertical">
                {(provided) => (
                    <div
                        className={`cards-grid ${isEditMode ? "cards-container-edit-mode" : ""}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                      {cards.map(renderCard)}
                      {provided.placeholder}
                    </div>
                )}
              </Droppable>
            </DragDropContext>
        )}
        {selectedCard && (
            <BarcodeModal cardData={selectedCard} onClose={handleCloseModal} />
        )}
      </div>
  );
};

export default HomePage;
