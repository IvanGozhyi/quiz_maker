import {useNavigate} from "react-router-dom";

interface QuizCardProps {
    id: number;
    title: string;
    questionCount: number;
    onDelete: (id: number) => void;
}

function QuizCard({ id, title, questionCount, onDelete }: QuizCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/quizzes/:${id}`);
    }
    return (
        <div onClick={handleClick}>
            <h3>{title}</h3>
            <span>{questionCount} questions</span>
            <button onClick={()=>onDelete(id)}>Delete</button>
        </div>
    );
}

export default QuizCard;