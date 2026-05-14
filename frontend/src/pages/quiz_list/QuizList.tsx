import {useEffect, useState} from "react";
import QuizCard from "../../components/quiz_card/QuizCard.tsx";

interface Quiz {
    id: number;
    title: string;
    _count: {
        questions: number;
    };
}

function QuizList(){
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/quizzes')
            .then(res => res.json())
            .then(data => {
                setQuizzes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this quiz?")) return;

        try {
            const res = await fetch(`http://localhost:5000/quizzes/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setQuizzes(quizzes.filter(q => q.id !== id));
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };
    if (loading) return <div>Loading...</div>;
    return (
        <div className="container">
            {quizzes.map((quiz) => (
                <QuizCard
                    key={quiz.id}
                    id={quiz.id}
                    title={quiz.title}
                    questionCount={quiz._count.questions}
                    onDelete={handleDelete}
                />
                ))}
            {quizzes.length === 0 && <p>You haven't created any quizzes yet.</p>}
        </div>
    );
}

export default QuizList;