import { BoardData } from '@/types/kanban';

export const initialBoardData: BoardData = {
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'User authentication flow',
      details: 'Design OAuth2 sign-in workflows and account recovery sequences.',
    },
    'card-2': {
      id: 'card-2',
      title: 'Performance profiling',
      details: 'Benchmark server response times under peak load simulation.',
    },
    'card-3': {
      id: 'card-3',
      title: 'Database schema migration',
      details: 'Migrate relational entities to support versioned board state.',
    },
    'card-4': {
      id: 'card-4',
      title: 'API rate limiting',
      details: 'Configure token bucket algorithm on external endpoints.',
    },
    'card-5': {
      id: 'card-5',
      title: 'Drag-and-drop interactions',
      details: 'Fine-tune smooth card reordering and cross-column animations.',
    },
    'card-6': {
      id: 'card-6',
      title: 'Design token alignment',
      details: 'Integrate primary blue and purple secondary accent styles.',
    },
    'card-7': {
      id: 'card-7',
      title: 'Security audit review',
      details: 'Inspect automated dependency scans and input sanitization.',
    },
    'card-8': {
      id: 'card-8',
      title: 'Mobile responsive layout',
      details: 'Verify column horizontal scroll and touch-drag behaviors.',
    },
    'card-9': {
      id: 'card-9',
      title: 'Initial project setup',
      details: 'Scaffold repository structure and configure development pipeline.',
    },
    'card-10': {
      id: 'card-10',
      title: 'Base UI components',
      details: 'Implement shared modal, button, and typography primitives.',
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Backlog',
      cardIds: ['card-1', 'card-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Ready',
      cardIds: ['card-3', 'card-4'],
    },
    'column-3': {
      id: 'column-3',
      title: 'In Progress',
      cardIds: ['card-5', 'card-6'],
    },
    'column-4': {
      id: 'column-4',
      title: 'In Review',
      cardIds: ['card-7', 'card-8'],
    },
    'column-5': {
      id: 'column-5',
      title: 'Done',
      cardIds: ['card-9', 'card-10'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5'],
};
