import { html } from "@lit-html/lit-html.js";
import { quizHelper } from "@src/data/quizHelper.js";
import { createSubmitHandler } from "@src/util.js";
import { navigationTemplate } from "@src/views/navigation.js";
import { formInputQuestion } from "@src/views/partials.js";

function createTemplate(ctx, questionNumbers, helper) {
  return html` ${
    navigationTemplate(ctx)}
    <section id="editor">
      <header class="pad-large">
        <h1>New quiz</h1>
      </header>

      <div class="pad-large alt-page">
        <form @submit=${createSubmitHandler(helper.createQuiz)}>
          <label class="editor-label layout">
            <span class="label-col">Title:</span>
            <input class="input i-med" type="text" name="title"
          /></label>
          <label class="editor-label layout">
            <span class="label-col">Topic:</span>
            <select class="input i-med" name="topic">
              <option value="all">All Categories</option>
              <option value="it">Languages</option>
              <option value="hardware">Hardware</option>
              <option value="software">Tools and Software</option>
            </select>
          </label>
          <input class="input submit action" type="submit" value="Save" />
        </form>
      </div>

      <header class="pad-large">
        <h2>Questions</h2>
      </header>

      <div class="pad-large alt-page">
        ${new Array(questionNumbers)
            .fill(0)
            .map((_, index) => index + 1)
            .map(n => questionForm(helper, n))}

        <article class="editor-question">
          <div class="editor-input">
            <button @click=${helper.addQuestionForm} id="addBtn" class="input submit action" disabled>
              <i class="fas fa-plus-circle"></i>
              Add question
            </button>
          </div>
        </article>
      </div>

      <div id="createQuiz" class="pad-large alt-page">
        <button @click=${helper.submitQuiz} class="input submit action create" disabled>
          <i class="fas fa-plus"></i>
          Create Quiz
        </button>
      </div>
    </section>`;
}

/**
 * Question form for create view
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function questionForm(helper, questionNum) {
  return html` 
  <article class="editor-question question-art">
    <div class="layout">
      <div class="question-control">
        <button type="submit" form="question-${questionNum}" class="input submit action createBtn"><i class="fas fa-check-double"></i> Create</button>
        <button @click=${helper.onRemoveQuestion} class="input submit action"><i class="fas fa-trash-alt"></i> Remove</button>
      </div>
      <h3>Question ${questionNum}</h3>
    </div>
    <form class="question-form" id="question-${questionNum}" @submit=${createSubmitHandler(helper.createQuestionData)}>
      <textarea class="input editor-input editor-text" name="text" placeholder="Enter question"></textarea>
        ${formInputQuestion(questionNum, [null, null, null], helper.onRemoveAnswer)}
        <button type="button" class="input submit action">
          <i class="fas fa-plus-circle"></i>
          Add answer
        </button>
      </div>
    </form>
    <!-- <div class="loading-overlay working"></div> -->
  </article>`;
}

const quizData = {
  topic: "",
  title: "",
  questionCount: 0,
  ownerId: "",
};


/**@param {import("@src/types").PageContext} ctx  */
export function showCreate(ctx) {
  const helper = quizHelper(ctx, createTemplate, quizData);
  quizData.ownerId = ctx.user.objectId;
  ctx.render(createTemplate(ctx, 0, helper));
}
