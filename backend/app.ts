import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174'
}));
app.use(express.json());

app.post('/quizzes', async (req, res) => {
    try {
        const { title, questions } = req.body;

        if (!title || !questions || questions.length === 0) {
            return res.status(400).json({ error: "Title and at least one question are required" });
        }


        const newQuiz = await prisma.quiz.create({
            data: {
                title: title,
                questions: {
                    create: questions
                }
            }
        });

        res.status(201).json(newQuiz);
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ error: "Failed to create quiz" });
    }
});

app.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await prisma.quiz.findMany({
            include: {
                _count: {
                    select: { questions: true }
                }
            }
        });
        res.json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ error: "Failed to fetch quizzes" });
    }
});

app.get('/quizzes/:id', async (req, res) => {
    try{
        const id  = parseInt(req.params.id);
        const quiz = await prisma.quiz.findUnique({
            where: { id: id },
            include: { questions: true }
        });

        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        return res.json(quiz);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return res.status(500).json({ error: "Failed to fetch quiz details" });
    }
});

app.delete('/quizzes/:id', async (req, res) => {
    try{
        const id = parseInt(req.params.id);

        await prisma.quiz.delete({
            where: { id: id },
        })

        return res.json({ success: "Successfully deleted quiz" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return res.status(500).json({ error: "Failed to delete quiz" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});