import {createBrowserRouter, Navigate} from "react-router-dom";
import QuizList from "../pages/quiz_list/QuizList.tsx";
import QuizDetails from "../pages/quiz_details/QuizDetails.tsx";
import QuizCreation from "../pages/quiz_creation/QuizCreation.tsx";


export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/quizzes" replace />,
    },
    {
        path: "/quizzes",
        element: <QuizList/>,
    },
    {
        path: "/quizzes/:id",
        element: <QuizDetails/>,
    },
    {
        path: "/create",
        element: <QuizCreation/>
    }
]);

