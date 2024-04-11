import { html } from "@lit-html/lit-html.js";

export function loading() {
  return html`<div>Loading...</div>`;
}

export function formInputQuestion(questionNum, questionData, onRemove) {
  return questionData.answers.map((answer, i) => formAnswerQuestions(questionNum, answer, onRemove, i, questionData.correctIndex))
}

function formAnswerQuestions(numQuestion, answer, onRemove, answerIndex, radioIndex) {
  return html`
  <div class="editor-input">
    <label class="radio">
      <input class="input" type="radio" name="question-${numQuestion}" value=${answerIndex} ?checked=${radioIndex == answerIndex} />
      <i class="fas fa-check-circle"></i>
    </label>
    
    <input class="input" type="text" name="answer-${answerIndex}" .value=${answer} />
    <button @click=${onRemove} type="button" class="input submit action"><i class="fas fa-trash-alt"></i></button>
  </div>`
}