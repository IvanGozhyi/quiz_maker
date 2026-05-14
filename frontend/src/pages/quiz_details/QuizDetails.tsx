import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Question {
    id: number;
    text: string;
    type: 'boolean' | 'input' | 'checkbox';
    options: string[];
}

interface Quiz {
    id: number;
    title: string;
    questions: Question[];
}

function QuizDetails(){
    const { id } = useParams<{id:string}>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`http://localhost:5000/quizzes/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch quiz details');
                return res.json();
            })
            .then((data) => {
                setQuiz(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading quiz data...</div>;
    if (error) return <div>Error: {error}. <Link to="/quizzes">Back to list</Link></div>;
    if (!quiz) return <div>Quiz not found.</div>;

    return (
        <div>
            <Link to="/quizzes">Back to Dashboard</Link>
            <h1>{quiz.title}</h1>
            <p>Total questions: {quiz.questions.length}</p>

            <hr />
            <section>
                {quiz.questions.map((question, index) => (
                    <div key={question.id} style={{ marginBottom: '30px' }}>
                        <h3>{index + 1}. {question.text}</h3>
                        <p><small>Type: {question.type}</small></p>

                        {question.type === 'boolean' && (
                            <div>
                                <label>
                                    <input type="radio" disabled name={`q-${question.id}`} /> True
                                </label>
                                <br />
                                <label>
                                    <input type="radio" disabled name={`q-${question.id}`} /> False
                                </label>
                            </div>
                        )}

                        {question.type === 'input' && (
                            <input
                                type="text"
                                placeholder="User would type answer here..."
                                disabled
                                style={{ width: '300px' }}
                            />
                        )}

                        {question.type === 'checkbox' && (
                            <div>
                                {question.options.map((option, optIndex) => (
                                    <div key={optIndex}>
                                        <label>
                                            <input type="checkbox" disabled /> {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
}

export default QuizDetails;