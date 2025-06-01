import { html } from "../../lib/lit-html/lit-html.js";
import { getAllData, getAllDataForOneItem, getDataDetails } from "../../src/data/data.js";
import { quizHelper } from "../../src/data/quizHelper.js";
import { createSubmitHandler } from "../../src/util.js";
import { navigationTemplate } from "../../src/views/navigation.js";
import { questionForm, topicOption } from "../../src/views/partials.js";

/**
 *
 * @param {import("../../src/types").PageContext} ctx
 * @param {number} questionNumbers
 * @param {import("../../src/types").QuizHelper} helper
 * @param {import("../../src/types").QuestionData} questionsData
 * @param {Object} allTopics 
 * @returns {import("../../lib/lit-html/lit-html.js").TemplateResult}
 */
function editTemplate(ctx, questionNumbers, helper, questionsData, allTopics) {
  return html` ${navigationTemplate(ctx)}
    <section id="editor">
      <header class="pad-large">
        <h1>Edit quiz</h1>
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
          .map((n) => questionForm(helper, n, Object.values(questionsData)[n - 1]))}
        <article class="editor-question">
          <div class="editor-input">
            <button @click=${helper.addQuestionForm} class="input submit action">
              <i class="fas fa-plus-circle"></i>
              Add question
            </button>
          </div>
        </article>
      </div>

      <div class="pad-large alt-page">
        <button @click=${helper.editQuiz} class="input submit action create">
          <i class="fas fa-plus"></i>
          Update Quiz
        </button>
      </div>
    </section>`;
}

/**
 *
 * @param {import("../../src/types").PageContext} ctx
 */
export async function showEdit(ctx) {
  //@ts-ignore
  const id = ctx.params.id;
  const response = await getDataDetails("quizzes", id);
  const quiz = response.results[0];
  const allTopics = await getAllData("quizTopic");
  const questions = await getAllDataForOneItem("questions", id, "quizId", "quizzes");
  const helper = quizHelper(ctx, editTemplate, quiz, allTopics.results, questions.results);
  ctx.render(editTemplate(ctx, quiz.questionCount, helper, questions.results, allTopics.results));
}
