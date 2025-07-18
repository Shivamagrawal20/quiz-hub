import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import quizGenRoutes from './routes/quizGen.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Quiz generation routes (admin only)
app.use('/api/quiz-gen', quizGenRoutes);

console.log("=== Backend server starting ===");
// Health check root route
app.get('/test', (req, res) => res.send('Test route working!'));
app.get('/', (req, res) => {
  res.send('QuizHub backend is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`QuizHub backend running on port ${PORT}`);
}); 