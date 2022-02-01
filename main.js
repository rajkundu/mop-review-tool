const HIDE_ANSWERS_CSS = `
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

const HELP_ALERT_STR = `
Review Tool Shortcuts

'.' = show/hide answers for current question
'q' = quiz mode (hide answers for every question)
'r' = review mode (show answers for every question)
'h' = help screen (this dialog)
`

var quizMode = true;
var answersHidden = true;
let style = document.createElement('style');
style.id = 'mop-review-tool__css';
style.innerHTML = HIDE_ANSWERS_CSS;
document.head.appendChild(style);

function setHidden(newVal) {
	answersHidden = newVal;
	style.innerHTML = answersHidden ? HIDE_ANSWERS_CSS : '';
}

function setAnswerChoiceOnClick() {
	var answerButtons = document.getElementsByClassName('answer-choice-button');
	for (let answerButton of answerButtons) {
		answerButton.removeAttribute('disabled');
		answerButton.addEventListener('click', (event) => {
			setHidden(false);
		});
	}
}

const loadingObserver = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		mutation.removedNodes.forEach(function(addedNode) {
			if (addedNode.id === 'progress-modal') {
				setAnswerChoiceOnClick();
				questionChangeObserver.observe(document.querySelector('#answer'), { childList: true, subtree: false });
				loadingObserver.disconnect();
			}
		});
	});
});

const questionChangeObserver = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (quizMode) {
			setHidden(true);
		}
		setAnswerChoiceOnClick();
	});
});

loadingObserver.observe(document.querySelector('body'), { childList: true, subtree: false });

document.addEventListener('keydown', (event) => {
	if (event.key === '.') {
		// If user pressed answer toggle key but was in review mode, they probably want to switch to quiz mode
		quizMode = true;
		setHidden(!answersHidden);
	} else if  (event.key === 'q') {
		// Quiz mode
		quizMode = true;
		setHidden(true);
	} else if (event.key === 'r') {
		// Review mode
		quizMode = false;
		setHidden(false);
	} else if (event.key === 'h') {
		// Help screen
		alert(HELP_ALERT_STR);
	}
});
