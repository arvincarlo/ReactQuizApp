import { createContext, useContext, useReducer, useEffect } from "react";

const QuizContext = createContext();
const SECONDS_PER_QUESTION = 30;
const initialState = {
    questions: [],
    index: 0,
    answer: null,
    points: 0,
    highScore: 0,
    // 'loading', 'error', 'ready', 'active', 'finished'
    status: '',
    secondsRemaining: null
};

function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived':
            return {
                ...state,
                questions: action.payload,
                status: "ready"
            };
        case 'dataFailed':
            return {
                ...state,
                status: "error"
            }
        case 'start':
            return {
                ...state,
                status: "active",
                secondsRemaining: state.questions.length * SECONDS_PER_QUESTION
            }
        case 'newAnswer':
            const question = state.questions.at(state.index);

            return {
                ...state,
                answer: action.payload,
                points: question.correctOption === action.payload ? state.points + question.points : state.points
            }
        case 'nextQuestion':
            return {
                ...state,
                index: state.index + 1,
                answer: null
            }
        case 'finish':
            return {
                ...state,
                highScore: state.points > state.highScore ? state.points : state.highScore,
                status: "finished"
            }
        case 'restart':
            return {
                ...initialState,
                questions: state.questions,
                highScore: state.highScore,
                status: "ready"
            }
        case 'tick':

            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status: state.secondsRemaining <= 0 ? "finished" : state.status
            }
        default:
            throw new Error("Action unknown");
    }
}

function QuizProvider({ children }) {
    const [{questions, status, index, answer, points, highScore, secondsRemaining}, dispatch] = useReducer(reducer, initialState);
    const maxPossiblePoints = questions.reduce((accumulator, question) => accumulator + question.points, 0);
    const numQuestions = questions.length;
    const question = questions[index];

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:8000/questions');
                const data = await response.json();
                dispatch({ type: 'dataReceived', payload: data });
            } catch {
                dispatch({ type: 'dataFailed' });
            }
        }
        fetchData();
    }, []);

    return <QuizContext.Provider value={{ 
        questions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining,
        dispatch,
        numQuestions,
        maxPossiblePoints,
        question
    }}>
        {children}
    </QuizContext.Provider>
}

function useQuiz() {
    const context = useContext(QuizContext);

    if (!context) {
        throw new Error("useQuiz must be used within a QuizProvider");
    }

    return context;
}

export { QuizProvider, useQuiz }