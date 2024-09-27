function NextButton({dispatch, answer}) {
    const hasAnswered = answer !== null;
    console.log(hasAnswered);
    
    return (
        <button className="btn btn-ui" onClick={() => dispatch({type: 'nextQuestion'})}>Next</button>
    )
}

export default NextButton
