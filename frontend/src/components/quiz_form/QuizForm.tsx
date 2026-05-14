import * as Yup from 'yup';

export const QuizSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title is too short')
        .required('Required field'),
    questions: Yup.array()
        .of(
            Yup.object().shape({
                text: Yup.string().required('Question text is required'),
                type: Yup.string().oneOf(['boolean', 'input', 'checkbox']).required(),
                options: Yup.array().of(Yup.string())
            })
        )
        .min(1, 'Add at least one question'),
});


function QuizForm(){
    return (
        <div>
            <form>

            </form>
        </div>
    );
}

export default QuizForm;