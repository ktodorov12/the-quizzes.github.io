import { html } from "@lit-html/lit-html.js";
import { createSubmitHandler } from "@src/util.js";
import { navigationTemplate } from "@src/views/navigation.js";
import { questionForm } from "@src/views/questions.js";

function createTemplate(ctx, questionNumbers) {
  return html`
   ${navigationTemplate(ctx)}
    <section id="editor">
      <header class="pad-large">
        <h1>New quiz</h1>
      </header>

      <div class="pad-large alt-page">
        <form @submit=${createSubmitHandler(createQuiz)}>
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
        ${questionNumbers.map(questionForm)}

        <article class="editor-question">
          <div class="editor-input">
            <button @click=${addQuestion} id="addBtn" class="input submit action" disabled>
              <i class="fas fa-plus-circle"></i>
              Add question
            </button>
          </div>
        </article>
      </div>
    </section>`;
}

const quizData = {
  topic: "",
  title: "",
  questionCount: 0,
  ownerId: "",
};
const questionNumbers = []

let context;
/**@param {import("@src/types").PageContext} ctx  */
export function showCreate(ctx) {
  context = ctx;
  quizData.ownerId = ctx.user.objectId;
  ctx.render(createTemplate(ctx, questionNumbers));
}

/** * @param {{title: string, topic: string}} data * @param {HTMLFormElement} form*/
function createQuiz(data, form) {
  if (!data.title) {
    return
  }
  // @ts-ignore
  document.getElementById("addBtn").disabled = false;
  form.disabled = true;

  quizData.title = data.title;
  quizData.topic = data.topic;

  addQuestion();
}

function addQuestion() {
  quizData.questionCount++;
  questionNumbers.push(quizData.questionCount)
  context.render(createTemplate(context, questionNumbers));
}