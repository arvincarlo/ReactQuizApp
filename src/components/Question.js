import Options from "./Options";

function Question({question}) {
    console.log(question);
    
    return (
        <div>
            <h4>{question.question}</h4>
            <Options question={question}></Options>
        </div>
    )
}

export default Question
