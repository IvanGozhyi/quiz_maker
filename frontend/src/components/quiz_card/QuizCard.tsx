import {useNavigate} from "react-router-dom";
import "./QuizCard.css";

interface QuizCardProps {
    id: number;
    title: string;
    questionCount: number;
    onDelete: (id: number) => void;
}

function QuizCard({ id, title, questionCount, onDelete }: QuizCardProps) {
    const navigate = useNavigate();

    const handleClick = (e:any) => {
        e.preventDefault();
        navigate(`/quizzes/${id}`);
    }
    return (
        <div className="card" onClick={handleClick}>
            <h3>{title}</h3>
            <span>{questionCount} questions</span>
            <button className="dlt-button" onClick={()=>onDelete(id)}>Delete</button>
        </div>
    );
}

export default QuizCard;