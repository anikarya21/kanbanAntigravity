import React, { useState, useRef, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Column, Card } from '@/types/kanban';
import { KanbanCard } from './KanbanCard';
import styles from './KanbanColumn.module.css';
import { PlusIcon, EditIcon, CheckIcon, CloseIcon } from './icons';

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  onRename: (columnId: string, newTitle: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
}

export function KanbanColumn({
  column,
  cards,
  onRename,
  onAddCard,
  onDeleteCard,
}: KanbanColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDetails, setNewCardDetails] = useState('');

  const titleInputRef = useRef<HTMLInputElement>(null);
  const cardTitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleInput(column.title);
  }, [column.title]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isAddingCard && cardTitleInputRef.current) {
      cardTitleInputRef.current.focus();
    }
  }, [isAddingCard]);

  const handleSaveTitle = () => {
    const trimmed = titleInput.trim();
    if (trimmed && trimmed !== column.title) {
      onRename(column.id, trimmed);
    } else {
      setTitleInput(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setTitleInput(column.title);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelTitle();
    }
  };

  const handleSubmitCard = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newCardTitle.trim();
    if (!trimmedTitle) return;

    onAddCard(column.id, trimmedTitle, newCardDetails.trim());
    setNewCardTitle('');
    setNewCardDetails('');
    setIsAddingCard(false);
  };

  const handleCancelAddCard = () => {
    setNewCardTitle('');
    setNewCardDetails('');
    setIsAddingCard(false);
  };

  return (
    <div className={styles.column} data-testid={`column-${column.id}`}>
      <div className={styles.columnHeader}>
        <div className={styles.titleContainer}>
          {isEditingTitle ? (
            <div className={styles.titleEditForm}>
              <input
                ref={titleInputRef}
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                className={styles.titleInput}
                data-testid={`column-title-input-${column.id}`}
                aria-label="Edit column title"
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className={`${styles.headerActionBtn} ${styles.headerActionBtnSuccess}`}
                aria-label="Save column title"
                data-testid={`column-title-save-${column.id}`}
              >
                <CheckIcon size={14} />
              </button>
              <button
                type="button"
                onClick={handleCancelTitle}
                className={styles.headerActionBtn}
                aria-label="Cancel editing column title"
              >
                <CloseIcon size={14} />
              </button>
            </div>
          ) : (
            <div
              className={styles.titleDisplay}
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename column"
              data-testid={`column-title-wrapper-${column.id}`}
            >
              <h2 className={styles.columnTitle} data-testid={`column-title-${column.id}`}>
                {column.title}
              </h2>
              <span className={styles.editIconBtn}>
                <EditIcon size={13} />
              </span>
            </div>
          )}
        </div>

        <span className={styles.badge} data-testid={`column-card-count-${column.id}`}>
          {cards.length}
        </span>
      </div>

      <Droppable droppableId={column.id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.cardList} ${
              snapshot.isDraggingOver ? styles.cardListDraggingOver : ''
            }`}
            data-testid={`column-cards-${column.id}`}
          >
            {cards.map((card, index) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                columnId={column.id}
                onDelete={onDeleteCard}
              />
            ))}
            {provided.placeholder}
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className={styles.emptyState}>No cards in this column</div>
            )}
          </div>
        )}
      </Droppable>

      <div className={styles.footer}>
        {isAddingCard ? (
          <form onSubmit={handleSubmitCard} className={styles.addCardForm}>
            <input
              ref={cardTitleInputRef}
              type="text"
              placeholder="Card title"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className={styles.formInput}
              required
              data-testid={`add-card-title-input-${column.id}`}
            />
            <textarea
              placeholder="Card details (optional)"
              value={newCardDetails}
              onChange={(e) => setNewCardDetails(e.target.value)}
              className={styles.formTextarea}
              data-testid={`add-card-details-input-${column.id}`}
            />
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleCancelAddCard}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!newCardTitle.trim()}
                data-testid={`add-card-submit-${column.id}`}
              >
                Add Card
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCard(true)}
            className={styles.addCardTrigger}
            data-testid={`add-card-btn-${column.id}`}
          >
            <PlusIcon size={15} />
            <span>Add Card</span>
          </button>
        )}
      </div>
    </div>
  );
}
