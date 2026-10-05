const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
let students = [];
const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/api/students', (req, res) => {
    res.json(students);
});

app.post('/api/students', (req, res) => {
    const student = req.body;

    students.push(student);

    res.status(201).json(student);
});

app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    if (id < 0 || id >= students.length) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    students[id] = req.body;

    res.json(students[id]);
});

app.delete('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    if (id < 0 || id >= students.length) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const deletedStudent = students.splice(id, 1);

    res.json(deletedStudent[0]);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});