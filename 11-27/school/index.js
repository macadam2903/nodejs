import express from 'express';
import studentsRouter from './students.js';
import coursesRouter from './courses.js';
import enrollmentsRouter from './enrollments.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Route-ok beállítása
app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/enrollments', enrollmentsRouter);

// Alapértelmezett route
app.get('/', (req, res) => {
  res.json({ 
    message: 'School API működik!',
    endpoints: {
      students: '/api/students',
      courses: '/api/courses',
      enrollments: '/api/enrollments'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server fut a http://localhost:${PORT} címen`);
});