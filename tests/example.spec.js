import { test, expect } from '@playwright/test';

test('TC01 - Open Login Page', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await expect(page).toHaveTitle('Wrong Title');

    await expect(page.getByRole('heading', {
        name: 'Student Management System'
    })).toBeVisible();
});

test('TC02 - Valid Login', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('#username').fill('admin');

    await page.locator('#password').fill('admin123');

    await page.locator('#loginButton').click();

    await expect(page).toHaveURL(/dashboard\.html/);

    await expect(page.getByText('Welcome, Administrator')).toBeVisible();
});

test('TC03 - Invalid Login', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('#username').fill('wronguser');

    await page.locator('#password').fill('wrongpassword');

    await page.locator('#loginButton').click();

    await expect(page.locator('#loginMessage'))
        .toHaveText('Invalid username or password!');
});

test('TC04 - Add Student', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('admin123');
    await page.locator('#loginButton').click();

    await expect(page).toHaveURL(/dashboard\.html/);

    const studentName = `Playwright Student ${Date.now()}`;

    await page.locator('#addStudentButton').click();

    await page.locator('#studentName').fill(studentName);
    await page.locator('#studentRollNumber').fill('PW001');
    await page.locator('#studentEmail').fill('playwright@example.com');
    await page.locator('#studentDepartment').selectOption('CSE');
    await page.locator('#studentYear').selectOption('3rd Year');

    await page.locator('#saveStudentButton').click();

    await expect(
        page.getByRole('cell', {
            name: studentName,
            exact: true
        })
    ).toBeVisible();
});

test('TC05 - Search Student', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('admin123');
    await page.locator('#loginButton').click();

    await expect(page).toHaveURL(/dashboard\.html/);

    const studentName = `Search Test Student ${Date.now()}`;

    await page.locator('#addStudentButton').click();

    await page.locator('#studentName').fill(studentName);
    await page.locator('#studentRollNumber').fill('SEARCH001');
    await page.locator('#studentEmail').fill('search@example.com');
    await page.locator('#studentDepartment').selectOption('CSE');
    await page.locator('#studentYear').selectOption('3rd Year');

    await page.locator('#saveStudentButton').click();

    await page.locator('#searchInput').fill(studentName);
    await page.locator('#searchButton').click();

    await expect(
        page.getByRole('cell', {
            name: studentName,
            exact: true
        })
    ).toBeVisible();
});


test('TC06 - Edit Student', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('admin123');
    await page.locator('#loginButton').click();

    await expect(page).toHaveURL(/dashboard\.html/);

    const studentName = `Edit Test Student ${Date.now()}`;

    await page.locator('#addStudentButton').click();

    await page.locator('#studentName').fill(studentName);
    await page.locator('#studentRollNumber').fill('EDIT001');
    await page.locator('#studentEmail').fill('edit@example.com');
    await page.locator('#studentDepartment').selectOption('CSE');
    await page.locator('#studentYear').selectOption('3rd Year');

    await page.locator('#saveStudentButton').click();

    const studentRow = page.locator('tr').filter({
        hasText: studentName
    });

    await studentRow.getByRole('button', {
        name: 'Edit'
    }).click();

    await page.locator('#editStudentEmail')
        .fill('updated@example.com');

    await page.locator('#saveEditStudentButton').click();

    await expect(
       studentRow.getByRole('cell', {
        name: 'updated@example.com',
        exact: true
       })
    ).toBeVisible();
});


test('TC07 - Delete Student', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('admin123');
    await page.locator('#loginButton').click();

    await expect(page).toHaveURL(/dashboard\.html/);

    const studentName = `Delete Test Student ${Date.now()}`;

    await page.locator('#addStudentButton').click();

    await page.locator('#studentName').fill(studentName);
    await page.locator('#studentRollNumber').fill('DELETE001');
    await page.locator('#studentEmail').fill('delete@example.com');
    await page.locator('#studentDepartment').selectOption('CSE');
    await page.locator('#studentYear').selectOption('3rd Year');

    await page.locator('#saveStudentButton').click();

    const studentRow = page.locator('tr').filter({
        hasText: studentName
    });

    await expect(studentRow).toBeVisible();

    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    await studentRow.getByRole('button', {
        name: 'Delete'
    }).click();

    await expect(studentRow).not.toBeVisible();
});


test('TC08 - Logout', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('admin123');
    await page.locator('#loginButton').click();

    await expect(page).toHaveURL(/dashboard\.html/);

    await page.locator('#logoutButton').click();

    await expect(page).toHaveURL(/index\.html/);

    await expect(
        page.locator('#loginButton')
    ).toBeVisible();
});