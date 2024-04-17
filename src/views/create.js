import { html } from "@lit-html/lit-html.js";
import { getAllData } from "@src/data/data.js";
import { quizHelper } from "@src/data/quizHelper.js";
import { createSubmitHandler, pointer } from "@src/util.js";
import { navigationTemplate } from "@src/views/navigation.js";
import { formInputQuestion, topicOption } from "@src/views/partials.js";

/**
 * Main template for the create view
 * @param {import("@src/types").PageContext} ctx 
 * @param {Number} questionNumbers 
 * @param {import("@src/types").QuizHelper} helper 
 * @param {import("@src/types").QuestionData} questionsData 
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function createTemplate(ctx, questionNumbers, helper, questionsData, allTopics) {
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
                ${allTopics.map(topicOption)}
            </select>
          </label>
          <label class="editor-label layout">
            <span class="label-col">Description:</span>
            <textarea class="input i-med" name="description"></textarea>
          </label>
          <input class="input submit action" type="submit" value="Create Quiz" />
        </form>
      </div>

      <header class="pad-large">
        <h2>Questions</h2>
      </header>

      <div class="pad-large alt-page">
        ${new Array(questionNumbers)
            .fill(0)
            .map((_, index) => index + 1)
            .map(n => questionForm(helper, n, Object.values(questionsData)[n - 1]))}

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
 * @param {import("@src/types").QuizHelper} helper 
 * @param {Number} questionNum
 * @param {Object} questionData 
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function questionForm(helper, questionNum, questionData) {
  return html` 
  <article class="editor-question question-art">
    <div class="layout">
      <div class="question-control">
        <button type="submit" form="question-${questionNum}" class="input submit action createBtn"><i class="fas fa-check-double"></i> Save</button>
        <button @click=${helper.onRemoveQuestion} class="input submit action"><i class="fas fa-trash-alt"></i> Remove</button>
      </div>
      <h3>Question ${questionNum}</h3>
    </div>
    <form class="question-form" id="question-${questionNum}" @submit=${createSubmitHandler(helper.createQuestionData)}>
      <textarea class="input editor-input editor-text" name="text" placeholder="Enter question" .value=${questionData.text} ></textarea>
        ${formInputQuestion(questionNum, questionData, helper.onRemoveAnswerLine)}
        <button @click=${helper.addAnswerLine} type="button" class="input submit action">
          <i class="fas fa-plus-circle"></i>
          Add answer
        </button>
      </div>
    </form>
    <div id="saved-${questionNum}"></div>
  </article>`;
}

const quizData = {
  topic: "",
  title: "",
  questionCount: 0,
  description: "",
  ownerId: pointer("_User", ""),
};


/**@param {import("@src/types").PageContext} ctx  */
export async function showCreate(ctx) {
  const allTopics = await getAllData("quizTopic");
  const helper = quizHelper(ctx, createTemplate, quizData, allTopics.results);
  quizData.ownerId.objectId = ctx.user.objectId;
  ctx.render(createTemplate(ctx, 0, helper, {text: "", answers: [], correctIndex: -1, quizId: pointer("quizzes", "")}, allTopics.results));
}
