'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { BoardData, Card, Column } from '@/types/kanban';
import { initialBoardData } from '@/data/initialData';
import { Header } from './Header';
import { KanbanColumn } from './KanbanColumn';
import styles from './KanbanBoard.module.css';

interface KanbanBoardProps {
  initialData?: BoardData;
}

export function KanbanBoard({ initialData = initialBoardData }: KanbanBoardProps) {
  const [boardData, setBoardData] = useState<BoardData>(initialData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalCards = Object.keys(boardData.cards).length;
  const totalColumns = boardData.columnOrder.length;

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = boardData.columns[source.droppableId];
    const finishColumn = boardData.columns[destination.droppableId];

    if (!startColumn || !finishColumn) return;

    if (startColumn === finishColumn) {
      const newCardIds = Array.from(startColumn.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newColumn: Column = {
        ...startColumn,
        cardIds: newCardIds,
      };

      setBoardData((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [newColumn.id]: newColumn,
        },
      }));
      return;
    }

    // Moving across columns
    const startCardIds = Array.from(startColumn.cardIds);
    startCardIds.splice(source.index, 1);
    const newStartColumn: Column = {
      ...startColumn,
      cardIds: startCardIds,
    };

    const finishCardIds = Array.from(finishColumn.cardIds);
    finishCardIds.splice(destination.index, 0, draggableId);
    const newFinishColumn: Column = {
      ...finishColumn,
      cardIds: finishCardIds,
    };

    setBoardData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    }));
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    setBoardData((prev) => {
      const targetColumn = prev.columns[columnId];
      if (!targetColumn) return prev;

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...targetColumn,
            title: newTitle,
          },
        },
      };
    });
  };

  const handleAddCard = (columnId: string, title: string, details: string) => {
    const newCardId = `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newCard: Card = {
      id: newCardId,
      title,
      details,
    };

    setBoardData((prev) => {
      const targetColumn = prev.columns[columnId];
      if (!targetColumn) return prev;

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [newCardId]: newCard,
        },
        columns: {
          ...prev.columns,
          [columnId]: {
            ...targetColumn,
            cardIds: [...targetColumn.cardIds, newCardId],
          },
        },
      };
    });
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setBoardData((prev) => {
      const targetColumn = prev.columns[columnId];
      if (!targetColumn) return prev;

      const updatedCardIds = targetColumn.cardIds.filter((id) => id !== cardId);
      const updatedCards = { ...prev.cards };
      delete updatedCards[cardId];

      return {
        ...prev,
        cards: updatedCards,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...targetColumn,
            cardIds: updatedCardIds,
          },
        },
      };
    });
  };

  return (
    <div className={styles.boardContainer}>
      <Header totalCards={totalCards} totalColumns={totalColumns} />

      <main className={styles.mainContent}>
        <div className={styles.boardHeader}>
          <div className={styles.boardTitleGroup}>
            <h2 className={styles.boardTitle}>Project Board</h2>
            <p className={styles.boardSubtitle}>
              Drag cards between columns or add new tasks to organize work.
            </p>
          </div>
        </div>

        {!isMounted ? (
          <div className={styles.skeletonContainer}>
            {boardData.columnOrder.map((colId) => (
              <div key={colId} className={styles.columnSkeleton} />
            ))}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className={styles.columnsWrapper} data-testid="kanban-columns-wrapper">
              {boardData.columnOrder.map((columnId) => {
                const column = boardData.columns[columnId];
                if (!column) return null;
                const cards = column.cardIds
                  .map((id) => boardData.cards[id])
                  .filter((card): card is Card => Boolean(card));

                return (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    cards={cards}
                    onRename={handleRenameColumn}
                    onAddCard={handleAddCard}
                    onDeleteCard={handleDeleteCard}
                  />
                );
              })}
            </div>
          </DragDropContext>
        )}
      </main>
    </div>
  );
}
