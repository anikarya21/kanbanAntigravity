import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { KanbanBoard } from '@/components/KanbanBoard';
import { initialBoardData } from '@/data/initialData';

describe('KanbanBoard Unit Tests', () => {
  it('renders board header with title and 5 initial columns', async () => {
    render(<KanbanBoard />);

    expect(screen.getByText('Project Board')).toBeInTheDocument();
    expect(screen.getByText('5 Columns')).toBeInTheDocument();

    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('In Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders dummy cards with titles and details', async () => {
    render(<KanbanBoard />);

    expect(screen.getByText('User authentication flow')).toBeInTheDocument();
    expect(
      screen.getByText('Design OAuth2 sign-in workflows and account recovery sequences.')
    ).toBeInTheDocument();

    expect(screen.getByText('Security audit review')).toBeInTheDocument();
    expect(
      screen.getByText('Inspect automated dependency scans and input sanitization.')
    ).toBeInTheDocument();
  });

  it('allows renaming a column', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const columnTitle = screen.getByTestId('column-title-column-1');
    expect(columnTitle).toHaveTextContent('Backlog');

    // Click column title to trigger editing mode
    await user.click(columnTitle);

    const titleInput = screen.getByTestId('column-title-input-column-1') as HTMLInputElement;
    expect(titleInput).toBeInTheDocument();

    // Type new title
    await user.clear(titleInput);
    await user.type(titleInput, 'Discovery{Enter}');

    expect(screen.queryByTestId('column-title-input-column-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('column-title-column-1')).toHaveTextContent('Discovery');
  });

  it('cancels column renaming when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const columnTitle = screen.getByTestId('column-title-column-2');
    expect(columnTitle).toHaveTextContent('Ready');

    await user.click(columnTitle);

    const titleInput = screen.getByTestId('column-title-input-column-2');
    await user.clear(titleInput);
    await user.type(titleInput, 'Changed Title{Escape}');

    expect(screen.queryByTestId('column-title-input-column-2')).not.toBeInTheDocument();
    expect(screen.getByTestId('column-title-column-2')).toHaveTextContent('Ready');
  });

  it('allows adding a new card to a column', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const addCardBtn = screen.getByTestId('add-card-btn-column-1');
    await user.click(addCardBtn);

    const titleInput = screen.getByTestId('add-card-title-input-column-1');
    const detailsInput = screen.getByTestId('add-card-details-input-column-1');
    const submitBtn = screen.getByTestId('add-card-submit-column-1');

    await user.type(titleInput, 'New QA Automation Task');
    await user.type(detailsInput, 'Create Playwright suites for continuous testing.');

    await user.click(submitBtn);

    expect(screen.getByText('New QA Automation Task')).toBeInTheDocument();
    expect(
      screen.getByText('Create Playwright suites for continuous testing.')
    ).toBeInTheDocument();

    // Verify card count updated
    const countBadge = screen.getByTestId('column-card-count-column-1');
    expect(countBadge).toHaveTextContent('3');
  });

  it('allows deleting an existing card from a column', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    expect(screen.getByText('User authentication flow')).toBeInTheDocument();

    const deleteBtn = screen.getByTestId('delete-card-card-1');
    await user.click(deleteBtn);

    expect(screen.queryByText('User authentication flow')).not.toBeInTheDocument();

    const countBadge = screen.getByTestId('column-card-count-column-1');
    expect(countBadge).toHaveTextContent('1');
  });

  it('allows cancelling card creation', async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    const addCardBtn = screen.getByTestId('add-card-btn-column-3');
    await user.click(addCardBtn);

    const titleInput = screen.getByTestId('add-card-title-input-column-3');
    await user.type(titleInput, 'Temporary Card');

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelBtn);

    expect(screen.queryByTestId('add-card-title-input-column-3')).not.toBeInTheDocument();
    expect(screen.queryByText('Temporary Card')).not.toBeInTheDocument();
  });
});
