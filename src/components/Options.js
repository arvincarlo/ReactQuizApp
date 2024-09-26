function Options({question}) {
    return (
        <div className="options">
            {question.options.map((option, index) => <button className="btn btn-option" key={option}>{option}</button>)}
        </div>
    )
}

export default Options
