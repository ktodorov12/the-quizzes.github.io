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

export function topicOption(topic) {
  return html`<option value="${topic.value}">${topic.textContent}</option>`
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
