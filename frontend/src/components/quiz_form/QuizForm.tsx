import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();

    const initialValues = {
        title: '',
        questions: [{ text: '', type: 'input', options: [] }]
    };

    const handleSubmit = async (values: any) => {

        const submissionData = {
            ...values,
            questions: values.questions.map((q: any) => {
                if (q.type === 'boolean') return { ...q, options: ['True', 'False'] };
                return q;
            })
        };

        try {
            const response = await fetch('http://localhost:5000/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                navigate('/quizzes');
            }
        } catch (error) {
            console.error('Submission error:', error);
        }
    };
    return (
        <div>
            <h1>Create New Quiz</h1>

            <Formik
                initialValues={initialValues}
                validationSchema={QuizSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form>

                        <div>
                            <label>Quiz Title</label>
                            <Field name="title" placeholder="Enter quiz title" />
                            <ErrorMessage name="title" component="div" />
                        </div>

                        <hr />


                        <FieldArray name="questions">
                            {({ push, remove }) => (
                                <div>
                                    {values.questions.map((question, index) => (
                                        <div key={index} style={{ marginBottom: '20px', borderBottom: '1px black solid' }}>
                                            <label>Question #{index + 1}</label>
                                            <button type="button" onClick={() => remove(index)}>Remove Question</button>

                                            <div>
                                                <label>Text</label>
                                                <Field name={`questions.${index}.text`} />
                                                <ErrorMessage name={`questions.${index}.text`} component="div" />
                                            </div>

                                            <div>
                                                <label>Type</label>
                                                <Field as="select" name={`questions.${index}.type`}>
                                                    <option value="input">Short Answer</option>
                                                    <option value="boolean">True / False</option>
                                                    <option value="checkbox">Multiple Choice</option>
                                                </Field>
                                            </div>

                                            {/* OPTIONS FOR CHECKBOXES */}
                                            {question.type === 'checkbox' && (
                                                <div>
                                                    <label>Options</label>
                                                    <FieldArray name={`questions.${index}.options`}>
                                                        {({ push: pushOpt, remove: removeOpt }) => (
                                                            <div>
                                                                {question.options.map((_, optIndex) => (
                                                                    <div key={optIndex}>
                                                                        <Field name={`questions.${index}.options.${optIndex}`} placeholder="Option text" />
                                                                        <button type="button" onClick={() => removeOpt(optIndex)}>x</button>
                                                                        <ErrorMessage name={`questions.${index}.options.${optIndex}`} component="div" />
                                                                    </div>
                                                                ))}
                                                                <button type="button" onClick={() => pushOpt('')}>+ Add Option</button>
                                                            </div>
                                                        )}
                                                    </FieldArray>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <button type="button" onClick={() => push({ text: '', type: 'input', options: [] })}>
                                        + Add Question
                                    </button>
                                </div>
                            )}
                        </FieldArray>

                        <div>
                            <button type="submit">Save Quiz</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default QuizForm;