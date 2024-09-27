import { useEffect, useReducer } from "react";
import Header from './Header';
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";

const initialState = {
  questions: [],
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  // 'loading', 'error', 'ready', 'active', 'finished'
  status: '',
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
        status: "active"
      }
    case 'newAnswer': 
      const question = state.questions.at(state.index);
      
      return {
        ...state,
        answer: action.payload,
        points: question.correctOption  === action.payload ? state.points + question.points : state.points
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
    default: 
      throw new Error("Action unknown");
  }
}

export default function App() {

  const [{questions, status, index, answer, points, highScore}, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((accumulator, question) => accumulator + question.points, 0);
  
  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then(response => response.json())
      .then(data => dispatch({type: 'dataReceived', payload: data}))
      .catch(error => dispatch({type: 'dataFailed'}));
  }, []);

  return <div className="app">
    <Header></Header>
    <Main>
      {status === 'loading' && <Loader></Loader>}
      {status === 'error' && <Error></Error>}
      {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
      {status === 'active' && (
        <>
          <Progress index={index} numQuestions={numQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer}></Progress>
          <Question question={questions[index]} dispatch={dispatch} answer={answer} points={points}></Question>
          <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions}></NextButton>
        </>
      )}
      {status === 'finished' && <FinishedScreen points={points} maxPossiblePoints={maxPossiblePoints} highScore={highScore}/>}
    </Main>
  </div>
}