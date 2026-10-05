const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginMessage = document.getElementById('loginMessage');

        if (username === 'admin' && password === 'admin123') {
            loginMessage.textContent = 'Login successful!';
            loginMessage.style.color = 'green';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            loginMessage.textContent = 'Invalid username or password!';
            loginMessage.style.color = 'red';
        }
    });
}


const logoutButton = document.getElementById('logoutButton');

if (logoutButton) {
    logoutButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });
}

const addStudentButton = document.getElementById('addStudentButton');
const addStudentModal = document.getElementById('addStudentModal');
const closeModalButton = document.getElementById('closeModalButton');
const cancelStudentButton = document.getElementById('cancelStudentButton');

if (addStudentButton && addStudentModal) {
    addStudentButton.addEventListener('click', function () {
        addStudentModal.style.display = 'flex';
    });
}

if (closeModalButton && addStudentModal) {
    closeModalButton.addEventListener('click', function () {
        addStudentModal.style.display = 'none';
    });
}

if (cancelStudentButton && addStudentModal) {
    cancelStudentButton.addEventListener('click', function () {
        addStudentModal.style.display = 'none';
    });
}

let students = [];

async function loadStudents() {
    const response = await fetch('/api/students');
    students = await response.json();

    renderStudents();
}

if (document.getElementById('studentTableBody')) {
    loadStudents();
}

const addStudentForm = document.getElementById('addStudentForm');

if (addStudentForm) {
    addStudentForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('studentName').value;
        const rollNumber = document.getElementById('studentRollNumber').value;
        const email = document.getElementById('studentEmail').value;
        const department = document.getElementById('studentDepartment').value;
        const year = document.getElementById('studentYear').value;

        const student = {
            name: name,
            rollNumber: rollNumber,
            email: email,
            department: department,
            year: year
        };

        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });

        const savedStudent = await response.json();

        students.push(savedStudent);
        renderStudents();
        addStudentForm.reset();
        addStudentModal.style.display = 'none';
        
    });
}


function renderStudents() {
    const studentTableBody = document.getElementById('studentTableBody');
    const totalStudents = document.getElementById('totalStudents');

    if (!studentTableBody || !totalStudents) {
        return;
    }

    studentTableBody.innerHTML = '';

    students.forEach(function (student) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNumber}</td>
            <td>${student.email}</td>
            <td>${student.department}</td>
            <td>${student.year}</td>
            <td>
                <button class="action-button edit-button" data-index="${students.indexOf(student)}">
                      Edit
                </button>

                <button class="action-button delete-button" data-index="${students.indexOf(student)}">
                      Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);
    });

    totalStudents.textContent = students.length;
}

function searchStudents(searchText) {
    const searchValue = searchText.toLowerCase().trim();

    const filteredStudents = students.filter(function (student) {
        return (
            student.name.toLowerCase().includes(searchValue) ||
            student.rollNumber.toLowerCase().includes(searchValue)
        );
    });

    return filteredStudents;
}

const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

if (searchButton && searchInput) {
    searchButton.addEventListener('click', function () {
        const searchText = searchInput.value;

        const filteredStudents = searchStudents(searchText);

        const studentTableBody = document.getElementById('studentTableBody');

        studentTableBody.innerHTML = '';

        filteredStudents.forEach(function (student) {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.rollNumber}</td>
                <td>${student.email}</td>
                <td>${student.department}</td>
                <td>${student.year}</td>
                <td>
                   <button class="action-button edit-button" data-index="${students.indexOf(student)}">
                      Edit
                   </button>

                    <button class="action-button delete-button" data-index="${students.indexOf(student)}">
                      Delete
                    </button>
                </td>
            `;

            studentTableBody.appendChild(row);
        });
    });
}

let editingStudentIndex = -1;

const studentTableBody = document.getElementById('studentTableBody');
const editStudentModal = document.getElementById('editStudentModal');

if (studentTableBody && editStudentModal) {
    studentTableBody.addEventListener('click', function (event) {

        if (event.target.classList.contains('edit-button')) {

            const index = Number(event.target.dataset.index);

            editingStudentIndex = index;

            const student = students[index];

            document.getElementById('editStudentName').value = student.name;
            document.getElementById('editStudentRollNumber').value = student.rollNumber;
            document.getElementById('editStudentEmail').value = student.email;
            document.getElementById('editStudentDepartment').value = student.department;
            document.getElementById('editStudentYear').value = student.year;

            editStudentModal.style.display = 'flex';
        }

    });
}

if (studentTableBody) {
    studentTableBody.addEventListener('click', async function (event) {
        if (event.target.classList.contains('delete-button')) {
            const index = Number(event.target.dataset.index);

            const confirmDelete = confirm(
                'Are you sure you want to delete this student?'
            );

            if (confirmDelete) {
                const response = await fetch(`/api/students/${index}`, {
                    method: 'DELETE'
                });

                await response.json();

                students.splice(index, 1);

                renderStudents();
            }
        }
    });
}

const editStudentForm = document.getElementById('editStudentForm');

if (editStudentForm) {
    editStudentForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        

        if (editingStudentIndex === -1) {
            return;
        }

        const updatedStudent = {
           name: document.getElementById('editStudentName').value,
           rollNumber: document.getElementById('editStudentRollNumber').value,
           email: document.getElementById('editStudentEmail').value,
           department: document.getElementById('editStudentDepartment').value,
           year: document.getElementById('editStudentYear').value
        };

        const response = await fetch(`/api/students/${editingStudentIndex}`, {
          method: 'PUT',
          headers: {
           'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedStudent)
        });

        const savedStudent = await response.json();

        students[editingStudentIndex] = savedStudent;

        renderStudents();

        editStudentForm.reset();

        editStudentModal.style.display = 'none';

        editingStudentIndex = -1;
    });
}


const closeEditModalButton = document.getElementById('closeEditModalButton');
const cancelEditStudentButton = document.getElementById('cancelEditStudentButton');

if (closeEditModalButton && editStudentModal) {
    closeEditModalButton.addEventListener('click', function () {
        editStudentModal.style.display = 'none';
        editStudentForm.reset();
        editingStudentIndex = -1;
    });
}

if (cancelEditStudentButton && editStudentModal) {
    cancelEditStudentButton.addEventListener('click', function () {
        editStudentModal.style.display = 'none';
        editStudentForm.reset();
        editingStudentIndex = -1;
    });
}
