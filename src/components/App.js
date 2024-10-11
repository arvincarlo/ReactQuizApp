import Header from './Header';
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import { useQuiz } from "../contexts/QuizContext";
export default function App() {

  const {status} = useQuiz();
  return <div className="app">
    <Header></Header>
    <Main>
      {status === 'loading' && <Loader></Loader>}
      {status === 'error' && <Error></Error>}
      {status === 'ready' && <StartScreen/>}
      {status === 'active' && (
        <>
          <Progress></Progress>
          <Question></Question>
          <Footer>
            <Timer></Timer>
            <NextButton></NextButton>
          </Footer>
        </>
      )}
      {status === 'finished' && <FinishedScreen/>}
    </Main>
  </div>
}