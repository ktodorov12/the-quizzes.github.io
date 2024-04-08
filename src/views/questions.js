import { html } from "@lit-html/lit-html.js";
import { createSubmitHandler } from "@src/util.js";

/**
 * Question form for create view
 * @param {number} questionNum
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
export function questionForm(questionNum) {
  return html` <article class="editor-question">
    <div class="layout">
      <div class="question-control">
        <button type="submit" form="question${questionNum}" class="input submit action"><i class="fas fa-check-double"></i> Create</button>
        <button class="input submit action"><i class="fas fa-trash-alt"></i> Remove</button>
      </div>
      <h3>Question ${questionNum}</h3>
    </div>
    <form id="question${questionNum}" @submit=${createSubmitHandler(submitQuestion)}>
      <textarea class="input editor-input editor-text" name="text" placeholder="Enter question"></textarea>
      <div class="editor-input">
        <label class="radio">
          <input class="input" type="radio" name="question-${questionNum}" value="0" />
          <i class="fas fa-check-circle"></i>
        </label>

        <input class="input" type="text" name="answer-0" />
        <button type="button" class="input submit action"><i class="fas fa-trash-alt"></i></button>
      </div>
      <div class="editor-input">
        <label class="radio">
          <input class="input" type="radio" name="question-${questionNum}" value="1" />
          <i class="fas fa-check-circle"></i>
        </label>

        <input class="input" type="text" name="answer-1" />
        <button type="button" class="input submit action"><i class="fas fa-trash-alt"></i></button>
      </div>
      <div class="editor-input">
        <label class="radio">
          <input class="input" type="radio" name="question-${questionNum}" value="2" />
          <i class="fas fa-check-circle"></i>
        </label>

        <input class="input" type="text" name="answer-2" />
        <button type="button" class="input submit action"><i class="fas fa-trash-alt"></i></button>
      </div>
      <div class="editor-input">
        <button type="button" class="input submit action">
          <i class="fas fa-plus-circle"></i>
          Add answer
        </button>
      </div>
    </form>
    <!-- <div class="loading-overlay working"></div> -->
  </article>`;
}

const questionsPromises = [];

function submitQuestion(data) {
  const questionData = {
    text: data.text,
    answers: dataParser(data, "answer"),
    correctIndex: Number(dataParser(data, "question").join()),
    quizId: "",
  };
  console.log(questionData);
}

function dataParser(object, criteria) {
  return Object.entries(object)
    .filter((x) => x[0].includes(criteria))
    .map((x) => x[1].trim());
}
