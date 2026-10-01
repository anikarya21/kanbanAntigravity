import React from 'react';
import styles from './Header.module.css';
import { BoardIcon } from './icons';

interface HeaderProps {
  totalCards: number;
  totalColumns: number;
}

export function Header({ totalCards, totalColumns }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brandGroup}>
        <div className={styles.brandIconWrapper}>
          <BoardIcon size={22} />
        </div>
        <div className={styles.brandTitles}>
          <h1 className={styles.brandName}>
            Kanban Board
            <span className={styles.brandAccentDot} />
          </h1>
          <span className={styles.brandTagline}>Single Board Workspace</span>
        </div>
      </div>

      <div className={styles.metaGroup}>
        <span className={styles.badge}>
          {totalColumns} Columns
        </span>
        <span className={`${styles.badge} ${styles.badgeAccent}`}>
          {totalCards} Cards
        </span>
      </div>

      <div className={styles.accentBar} />
    </header>
  );
}
