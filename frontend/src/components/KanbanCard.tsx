import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/types/kanban';
import styles from './KanbanCard.module.css';
import { TrashIcon } from './icons';

interface KanbanCardProps {
  card: Card;
  index: number;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
}

export function KanbanCard({ card, index, columnId, onDelete }: KanbanCardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${styles.card} ${snapshot.isDragging ? styles.cardDragging : ''}`}
          data-testid={`card-${card.id}`}
        >
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(columnId, card.id);
              }}
              aria-label={`Delete card "${card.title}"`}
              data-testid={`delete-card-${card.id}`}
            >
              <TrashIcon size={15} />
            </button>
          </div>
          {card.details && <p className={styles.cardDetails}>{card.details}</p>}
          <div className={styles.cardIndicator} />
        </div>
      )}
    </Draggable>
  );
}
