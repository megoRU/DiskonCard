import React, { useCallback, useLayoutEffect, useState } from "react";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
    sortableKeyboardCoordinates,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLongPress } from "use-long-press";
import { FiTrash2 } from "react-icons/fi";
import {
    deleteCardFromStorage,
    getCardsFromStorage,
    saveCardsToStorage,
} from "../utils/localStorage";
import BarcodeModal from "../components/BarcodeModal.jsx";
import "./HomePage.css";

const SortableCardItem = ({ card, isEditMode, onCardClick, onDeleteCard, bindLongPress }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: String(card.id),
        disabled: !isEditMode,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        backgroundImage: card.coverImage ? `url(${card.coverImage})` : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`card-item ${isEditMode ? "card-item-edit-mode" : ""}`}
            onClick={() => onCardClick(card)}
            {...bindLongPress(card.id)}
            {...(isEditMode ? { ...attributes, ...listeners } : {})}
            role="button"
            tabIndex={0}
            aria-label={card.storeName || "Дисконтная карта"}
        >
            {isEditMode && (
                <button
                    className="delete-card-btn"
                    onClick={(e) => onDeleteCard(card.id, e)}
                    aria-label="Удалить карту"
                    type="button"
                >
                    <FiTrash2 />
                </button>
            )}
        </div>
    );
};

const CardPreview = ({ card }) => {
    if (!card) return null;
    return (
        <div
            className="card-item card-item-dragging"
            style={{
                backgroundImage: card.coverImage ? `url(${card.coverImage})` : undefined,
            }}
        >
            <span className="card-preview-title">{card.storeName}</span>
        </div>
    );
};

const HomePage = ({ isEditMode, setIsEditMode }) => {
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [activeId, setActiveId] = useState(null);

    const fetchCards = useCallback(() => {
        setCards(getCardsFromStorage());
    }, []);

    useLayoutEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleLongPress = useCallback(() => {
        if (!isEditMode) setIsEditMode(true);
    }, [isEditMode, setIsEditMode]);

    const bind = useLongPress(handleLongPress, { threshold: 500 });

    const handleCardClick = (card) => {
        if (!isEditMode) setSelectedCard(card);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        const card = cards.find((c) => c.id === id);
        if (window.confirm(`Удалить ${card?.storeName || ""} карту?`)) {
            const updated = cards.filter((c) => c.id !== id);
            setCards(updated);
            deleteCardFromStorage(id);
            if (!updated.length) setIsEditMode(false);
        }
    };

    const handleCloseModal = () => setSelectedCard(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            setCards((items) => {
                const oldIndex = items.findIndex((i) => String(i.id) === String(active.id));
                const newIndex = items.findIndex((i) => String(i.id) === String(over.id));
                const updated = arrayMove(items, oldIndex, newIndex);
                saveCardsToStorage(updated);
                return updated;
            });
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const activeCard = activeId ? cards.find((c) => String(c.id) === String(activeId)) : null;

    return (
        <div className="home-page">
            <h1>Ваши карты</h1>
            {!cards.length && !isEditMode ? (
                <div className="no-cards-message">
                    <p>Добавьте свою первую карту!</p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <SortableContext
                        items={cards.map((c) => String(c.id))}
                        strategy={rectSortingStrategy}
                    >
                        <div
                            className={`cards-grid ${isEditMode ? "cards-container-edit-mode" : ""}`}
                        >
                            {cards.map((card) => (
                                <SortableCardItem
                                    key={card.id}
                                    card={card}
                                    isEditMode={isEditMode}
                                    onCardClick={handleCardClick}
                                    onDeleteCard={handleDelete}
                                    bindLongPress={bind}
                                />
                            ))}
                        </div>
                    </SortableContext>
                    <DragOverlay adjustScale={false}>
                        {activeCard ? <CardPreview card={activeCard} /> : null}
                    </DragOverlay>
                </DndContext>
            )}
            {selectedCard && (
                <BarcodeModal cardData={selectedCard} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default HomePage;
