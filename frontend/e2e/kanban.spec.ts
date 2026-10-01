import { test, expect } from '@playwright/test';

test.describe('Kanban Board Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the board to mount and render columns
    await page.waitForSelector('[data-testid="kanban-columns-wrapper"]');
  });

  test('displays board header, 5 columns, and initial dummy cards', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Kanban Board');
    await expect(page.locator('text=5 Columns')).toBeVisible();

    const expectedColumns = ['Backlog', 'Ready', 'In Progress', 'In Review', 'Done'];
    for (const colName of expectedColumns) {
      await expect(page.locator(`text=${colName}`).first()).toBeVisible();
    }

    // Verify dummy cards are present
    await expect(page.locator('text=User authentication flow')).toBeVisible();
    await expect(page.locator('text=Database schema migration')).toBeVisible();
    await expect(page.locator('text=Drag-and-drop interactions')).toBeVisible();
  });

  test('renames a column successfully', async ({ page }) => {
    // Click on the column title for column 1
    const titleWrapper = page.locator('[data-testid="column-title-wrapper-column-1"]');
    await titleWrapper.click();

    // Input should be visible
    const input = page.locator('[data-testid="column-title-input-column-1"]');
    await expect(input).toBeVisible();

    // Fill in new title and click save
    await input.fill('Prioritized Backlog');
    const saveBtn = page.locator('[data-testid="column-title-save-column-1"]');
    await saveBtn.click();

    // Verify title updated
    const updatedTitle = page.locator('[data-testid="column-title-column-1"]');
    await expect(updatedTitle).toHaveText('Prioritized Backlog');
  });

  test('adds a new card to a column', async ({ page }) => {
    // Check initial count
    const countBadge = page.locator('[data-testid="column-card-count-column-2"]');
    await expect(countBadge).toHaveText('2');

    // Click Add Card on Ready column
    const addCardBtn = page.locator('[data-testid="add-card-btn-column-2"]');
    await addCardBtn.click();

    // Fill form
    const titleInput = page.locator('[data-testid="add-card-title-input-column-2"]');
    const detailsInput = page.locator('[data-testid="add-card-details-input-column-2"]');
    await titleInput.fill('Implement automated smoke test');
    await detailsInput.fill('Run end-to-end verification during deployment pipeline.');

    // Submit
    const submitBtn = page.locator('[data-testid="add-card-submit-column-2"]');
    await submitBtn.click();

    // Card should be rendered
    await expect(page.locator('text=Implement automated smoke test')).toBeVisible();
    await expect(
      page.locator('text=Run end-to-end verification during deployment pipeline.')
    ).toBeVisible();

    // Count should be 3
    await expect(countBadge).toHaveText('3');
  });

  test('deletes an existing card', async ({ page }) => {
    const cardTitle = 'Design token alignment';
    await expect(page.locator(`text=${cardTitle}`)).toBeVisible();

    // Click delete button for card-6
    const deleteBtn = page.locator('[data-testid="delete-card-card-6"]');
    await deleteBtn.click();

    // Card should no longer be present
    await expect(page.locator(`text=${cardTitle}`)).not.toBeVisible();
  });

  test('drags a card from one column to another', async ({ page }) => {
    const card = page.locator('[data-testid="card-card-1"]');
    const targetColumnCards = page.locator('[data-testid="column-cards-column-2"]');

    await expect(card).toBeVisible();
    await expect(targetColumnCards).toBeVisible();

    const initialSourceCount = page.locator('[data-testid="column-card-count-column-1"]');
    const initialTargetCount = page.locator('[data-testid="column-card-count-column-2"]');

    await expect(initialSourceCount).toHaveText('2');
    await expect(initialTargetCount).toHaveText('2');

    const cardBox = await card.boundingBox();
    const targetBox = await targetColumnCards.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(targetBox).not.toBeNull();

    if (cardBox && targetBox) {
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(cardBox.x + cardBox.width / 2 + 10, cardBox.y + cardBox.height / 2 + 10, { steps: 5 });
      await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 20 });
      await page.waitForTimeout(200);
      await page.mouse.up();
    }

    // After drag, card-1 should now be inside column-2
    const movedCardInCol2 = targetColumnCards.locator('[data-testid="card-card-1"]');
    await expect(movedCardInCol2).toBeVisible();

    // Verify updated column counts
    await expect(initialSourceCount).toHaveText('1');
    await expect(initialTargetCount).toHaveText('3');
  });

  test('reorders cards within the same column', async ({ page }) => {
    const col3Cards = page.locator('[data-testid="column-cards-column-3"]');
    const firstCard = page.locator('[data-testid="card-card-5"]');
    const secondCard = page.locator('[data-testid="card-card-6"]');

    await expect(firstCard).toBeVisible();
    await expect(secondCard).toBeVisible();

    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();
    expect(firstCardBox).not.toBeNull();
    expect(secondCardBox).not.toBeNull();

    if (firstCardBox && secondCardBox) {
      // Drag second card above first card
      await page.mouse.move(secondCardBox.x + secondCardBox.width / 2, secondCardBox.y + secondCardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(secondCardBox.x + secondCardBox.width / 2, secondCardBox.y - 10, { steps: 5 });
      await page.mouse.move(firstCardBox.x + firstCardBox.width / 2, firstCardBox.y - 10, { steps: 15 });
      await page.waitForTimeout(200);
      await page.mouse.up();
    }

    // Both cards should still be present in column-3
    await expect(col3Cards.locator('[data-testid="card-card-5"]')).toBeVisible();
    await expect(col3Cards.locator('[data-testid="card-card-6"]')).toBeVisible();
  });
});
