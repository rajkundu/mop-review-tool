let css =  `
#review, #answer, i.icon-check, i.icon-remove, .result-wrapper {
  display: none !important;
}
.answer-choice-button.correct, .answer-choice-button.incorrect, .answer-choice-value, .question-container.answer-container.correct, .question-container.answer-container.incorrect {
  border: 1px solid var(--border) !important;
  color: var(--black) !important;
}
.answer-choice-button.correct, .answer-choice-button.incorrect {
	background-color: var(--pure-white) !important;
}
.answer-choice-value {
	background-color: var(--background) !important;
}
#answer {
  margin-top: 100%;
}
`;

var hidden = true;
let style = document.createElement('style');
style.id = "mop-review-tool__css";
style.innerHTML = css;
document.head.appendChild(style);

function setHidden(newVal) {
	hidden = newVal;
	style.innerHTML = hidden ? css : "";
}

document.addEventListener('keydown', (event) => {
	if(event.key === ','){
		setHidden(!hidden);
	}
});
