import { html } from "@lit-html/lit-html.js";

export function loading() {
  return html` 
  <div class="pad-large alt-page async">
    <div class="sk-cube-grid">
      <div class="sk-cube sk-cube1"></div>
      <div class="sk-cube sk-cube2"></div>
      <div class="sk-cube sk-cube3"></div>
      <div class="sk-cube sk-cube4"></div>
      <div class="sk-cube sk-cube5"></div>
      <div class="sk-cube sk-cube6"></div>
      <div class="sk-cube sk-cube7"></div>
      <div class="sk-cube sk-cube8"></div>
      <div class="sk-cube sk-cube9"></div>
    </div>
  </div>`;
}

/**
 * 
 * @param {number} questionNum - Number of the question
 * @param {Object} questionData - Data stored into the question / Correct index is needed
 * @param {Function} onRemove 
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
export function formInputQuestion(questionNum, questionData, onRemove) {
  return questionData.answers.map((answer, i) => formAnswerQuestions(questionNum, answer, onRemove, i, questionData.correctIndex));
}

/**
 * 
 * @param {number} numQuestion - Number of the question
 * @param {string} answer - Text of the answer
 * @param {Function} onRemove 
 * @param {number} answerIndex 
 * @param {number} radioIndex 
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function formAnswerQuestions(numQuestion, answer, onRemove, answerIndex, radioIndex) {
  return html` 
  <div class="editor-input">
    <label class="radio">
      <input class="input" type="radio" name="question-${numQuestion}" value=${answerIndex} ?checked=${radioIndex == answerIndex} />
      <i class="fas fa-check-circle"></i>
    </label>

    <input class="input" type="text" name="answer-${answerIndex}" .value=${answer} />
    <button @click=${onRemove} type="button" class="input submit action"><i class="fas fa-trash-alt"></i></button>
  </div>`;
}

export function topicOption(topic) {
  return html`<option value="${topic.value}">${topic.textContent}</option>`;
}

export function quizCard(quiz) {
  return html`
    <article class="preview layout">
      <div class="right-col">
        <a class="action cta" href="/details/${quiz.objectId}">View Quiz</a>
      </div>
      <div class="left-col">
        <h3>${quiz.title}</h3>
        <span class="quiz-topic">Topic: ${quiz.topic}</span>
        <div class="quiz-meta">
          <span>${quiz.questionCount} questions</span>
          <span>|</span>
          <span>Taken ${quiz.timesTaken} times</span>
        </div>
      </div>
    </article>
  `;
}

/**
 * 
 * @param {string} quizId 
 * @param {number} i - Index of the anchor 
 * @param {number | undefined} answered - - Checks data to see if the number was answered/stored
 * @param {number} num - Number of the question
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
export function contestNavQuestionIndexAnchor(quizId, i, answered, num) {
  let classA = "q-index";
  if (answered !== undefined) classA += " q-answered";
  if (num == i + 1) classA += " q-current";
  return html` <a id="question-${i + 1}" class=${classA} href="/contest/${quizId}/${i + 1}"></a> `;
}

/**
 * 
 * @param {Object} question - The question that will be rendered
 * @param {number} questionIndex 
 * @param {Function} onClick 
 * @param {number | undefined} answered - Checks data to see if the number was answered/stored
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
export function contestQuestion(question, questionIndex, onClick, answered) {
  return html` 
  <p class="q-text">${question.text}</p>

    <div>
      ${question
        .answers
        .map((answer, i) => contestAnswerLabel(answer, questionIndex, i, onClick, answered))}
    </div>`;
}

/**
 * 
 * @param {string} answer - The text from the question
 * @param {number} numQuestion - Index of the question
 * @param {number} answerIndex - Index of the answer inside of the question
 * @param {Function} onClick 
 * @param {number | undefined} answered - Checks data to see if the number was answered/stored
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function contestAnswerLabel(answer, numQuestion, answerIndex, onClick, answered) {
  return html`      
  <label class="q-answer radio">
    <input @click=${onClick} class="input" type="radio" name="question-${numQuestion}" value=${answerIndex} ?checked=${answered == answerIndex} />
    <i class="fas fa-check-circle"></i>
    ${answer}
  </label>`
}

/**
 * @param {number} numQuestion 
 * @param {object} question
 * @param {Function} onClick 
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
export function previewAnswer(numQuestion, question, onClick) {
  return html`
  <article class="preview">
      <span class="${question.isCorrect ? "s-correct" : "s-incorrect"}">
          Question ${numQuestion + 1}
          <i class="${question.isCorrect ? "fas fa-check" : "fas fa-times"}"></i>
      </span>
      <div class="right-col">
          <button @click=${onClick} class="action">${question.isCorrect ? "See question" : "Reveal answer"}</button>
      </div>

      <div id="hiddenContent" style="display: none">
        <p>${question.text}</p>
          ${question.answers.map((answer, i) => divAnswer(answer, question.answered, i, question.correctIndex))}
      </div>
  </article>
  `
}

/**
 * 
 * @param {string} answer 
 * @param {number} answerIndex 
 * @param {number} currIndex 
 * @param {number} correctIndex 
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function divAnswer(answer, answerIndex, currIndex, correctIndex) {
  return html`        
  <div class="s-answer">
  <span class="${ternaryCondition("s-correct", "s-incorrect")}">
      ${answer}
      <i class="${ternaryCondition("fas fa-check", "fas fa-times")}"></i>
      ${ternaryCondition("Correct answer", "Your choice")}
  </span>
</div>`

  function ternaryCondition(whenCorrect, whenWrong) {
    return currIndex == answerIndex
      ? answerIndex == correctIndex
        ? whenCorrect
        : whenWrong
      : currIndex == correctIndex
        ? whenCorrect
        : null
  }
}

