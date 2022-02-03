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

function quizModeSetup() {
	quizMode = true;
	setAnswerButtonsEnabled(quizMode);
	setHidden(quizMode);
}

function reviewModeSetup() {
	quizMode = false;
	setAnswerButtonsEnabled(quizMode);
	setHidden(quizMode);

	// Reset answer button appearance
	var answerButtons = document.getElementsByClassName('answer-choice-button');
	for (let answerButton of answerButtons) {
		if (!(answerButton.classList.contains('correct') || answerButton.classList.contains('incorrect'))) {
			answerButton.getElementsByTagName('i')[0].remove();
			answerButton.classList.remove('is-selected');
		}
	}
}

function setAnswerButtonsEnabled(buttonsEnabled) {
	var answerButtons = document.getElementsByClassName('answer-choice-button');
	for (let answerButton of answerButtons) {
		if (buttonsEnabled) {
			answerButton.removeAttribute('disabled');
		} else {
			answerButton.setAttribute('disabled', true);
			answerButton.blur();
		}
	}
}

function setAnswerClickCallback() {
	var answerButtons = document.getElementsByClassName('answer-choice-button');
	for (let answerButton of answerButtons) {
		setAnswerButtonsEnabled(quizMode);
		answerButton.addEventListener('click', (event) => {
			// Show all answers
			setHidden(false);
			// Disable clicking answer buttons
			setAnswerButtonsEnabled(false);
		});
	}
}

// Primary observer that observes nearly the entire document body; starts secondary observer on review page load
const loadingObserver = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		mutation.addedNodes.forEach((addedNode) => {
			// There are some empty #question-app divs, so make sure this one actually has content
			if (addedNode.id === 'question-app' && addedNode.innerText.trim().length > 0) {
				setAnswerClickCallback();
				questionChangeObserver.observe(document.getElementById('answer'), { childList: true, subtree: false });
				loadingObserver.disconnect();
			}
		});
	});
});

// Secondary, less taxing observer
const questionChangeObserver = new MutationObserver((mutations) => {
	if (quizMode) {
		setHidden(true);
	}
	setAnswerClickCallback();
});

// ========== Content script ========== //

// Start primary observer
loadingObserver.observe(document.getElementById('wrapper'), { childList: true, subtree: true });

// Listen for keypresses
document.addEventListener('keydown', (event) => {
	if (event.key === '.') {
		// If user pressed answer toggle key but was in review mode, they probably want to switch to quiz mode
		quizMode = true;
		setHidden(!answersHidden);
	} else if  (event.key === 'q') {
		// Quiz mode
		quizModeSetup();
	} else if (event.key === 'r') {
		// Review mode
		reviewModeSetup();
	} else if (event.key === 'h') {
		// Help screen
		alert(HELP_ALERT_STR);
	}
});
