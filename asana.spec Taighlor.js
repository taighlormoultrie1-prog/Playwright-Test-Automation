const { test, expect } = require('@playwright/test');

const cases = [
  { name: 'Test Case 1', project: 'Web Application', task: 'Implement user authentication', column: 'To Do', tags: ['Feature', 'High Priority'] },
  { name: 'Test Case 2', project: 'Web Application', task: 'Fix navigation bug', column: 'To Do', tags: ['Bug'] },
  { name: 'Test Case 3', project: 'Web Application', task: 'Design system updates', column: 'In Progress', tags: ['Design'] },
  { name: 'Test Case 4', project: 'Mobile Application', task: 'Push notification system', column: 'To Do', tags: ['Feature'] },
  { name: 'Test Case 5', project: 'Mobile Application', task: 'Offline mode', column: 'In Progress', tags: ['Feature', 'High Priority'] },
  { name: 'Test Case 6', project: 'Mobile Application', task: 'App icon design', column: 'Done', tags: ['Design'] },
];

async function login(page) {
  await page.goto('/');
  await page.getByRole('textbox', { name: /email|username/i }).fill(process.env.DEMO_USER || 'admin');
  await page.getByLabel(/password/i).fill(process.env.DEMO_PASSWORD || 'password123');
  await page.getByRole('button', { name: /log in|login|sign in/i }).click();
  await expect(
  page.getByRole('heading', {
    name: 'Web Application',
    level: 1,
    exact: true
  })
).toBeVisible();
}

async function openProject(page, project) {
  await page.getByRole('button', {
    name: new RegExp(project, 'i')
  }).click();

  await expect(
    page.getByRole('heading', {
      name: project,
      level: 1,
      exact: true
    })
  ).toBeVisible();
}

async function verifyTask(page, { task, column, tags }) {
  // Find the column by its heading, then scope all assertions to that column.
  // Adjust the column container selector after inspecting the demo app's DOM.
  async function verifyTask(page, { task, column, tags }) {
  const heading = page.getByRole('heading', {
    name: column,
    exact: true
  });

  await expect(heading).toBeVisible();

  const columnContainer = heading.locator('xpath=../..');

  const card = columnContainer
    .locator('div')
    .filter({ hasText: task })
    .last();

  await expect(card).toBeVisible();

  for (const tag of tags) {
    await expect(
      card.getByText(tag, { exact: true })
    ).toBeVisible();
  }
}
  
}

for (const testCase of cases) {
  test(`${testCase.name}: ${testCase.task}`, async ({ page }) => {
    await login(page);
    await openProject(page, testCase.project);
    await verifyTask(page, testCase);
  });
}
