import { html } from "../../lib/lit-html/lit-html.js";
import { getAllDataForOneItem, getDataDetails, updateData } from "../../src/data/data.js";
import { setSessionData } from "../../src/util.js";
import { navigationTemplate } from "../../src/views/navigation.js";
import { contestNavQuestionIndexAnchor, contestQuestion } from "../../src/views/partials.js";

const quizCache = {};
let answeredIndexes = {};

/**
 *  View for the contest mode
 * @param {import("../../src/types").PageContext} ctx
 * @param {number} num - Number of the question given from the url
 * @param {Object} quiz - Given quiz
 * @param {Object} questions - All questions in the quiz
 * @param {Function} clickRadioBtn
 * @param {Function} submitAnswers
 * @param {Function} resetQuiz
 * @returns {import("../../lib/lit-html/lit-html.js").TemplateResult}
 */
function contestTemplate(ctx, num, quiz, questions, clickRadioBtn, submitAnswers, resetQuiz) {
  return html` 
  <div @click=${() => (answeredIndexes = {})}>${navigationTemplate(ctx)}</div>
    <section id="quiz">
      <header class="pad-large">
        <h1>${quiz.title}: Question ${num} / ${questions.length}</h1>
        <nav class="layout q-control">
          <span class="block">Question index</span>
          ${questions.map((_, i) => contestNavQuestionIndexAnchor(quiz.objectId, i, answeredIndexes[i + 1], num))}
        </nav>
      </header>
      <div class="pad-large alt-page">
        <article class="question">
          ${contestQuestion(questions[num - 1], num, clickRadioBtn, answeredIndexes[num])}

          <nav class="q-control">
            <span id="remaining" class="block">${questions.length - Object.entries(answeredIndexes).length} questions remaining</span>
            <a class="action" href="/contest/${quiz.objectId}/${arithmetics["-"](num)}"><i class="fas fa-arrow-left"></i> Previous</a>
            <a class="action" href="javascript:void(0)" @click=${resetQuiz}><i class="fas fa-sync-alt"></i> Start over</a>
            <div class="right-col">
              <a class="action" href="/contest/${quiz.objectId}/${arithmetics["+"](num, questions.length)}">Next <i class="fas fa-arrow-right"></i></a>
              <a class="action" @click=${submitAnswers} href="javascript:void(0)">Submit answers</a>
            </div>
          </nav>
        </article>
      </div>
    </section>`;
}

/**
 * Async function for retrieving quizz by id and all questions for it and to render the view with the data
 * @param {import("../../src/types").PageContext} ctx
 */
export async function showContest(ctx) {
  // @ts-ignore
  let { id, num } = ctx.params;
  num = Number(num);

  //Check if the quiz data is already cached
  let quiz;
  if (quizCache[id]) {
    quiz = quizCache[id];
  } else {
    //Fetch quiz data if not found in the cache
    const data = await getDataDetails("quizzes", id);
    quiz = data.results[0];
    //Cache the fetched quiz data
    quizCache[id] = quiz;
  }

  // Fetch questions for the quiz
  let questions;
  if (quizCache[id + "_questions"]) {
    questions = quizCache[id + "_questions"];
  } else {
    questions = await getAllDataForOneItem("questions", quiz.objectId, "quizId", "quizzes");
    quizCache[id + "_questions"] = questions;
  }

  // Render the contest template with the fetched data
  ctx.render(contestTemplate(ctx, num, quiz, questions.results, clickRadioBtn, submitAnswers, resetQuiz));

  function resetQuiz() {
    const agree = confirm("Do you want to reset you attempt?");
    if (!agree) return;
    answeredIndexes = {};
    ctx.page.redirect(`/contest/${quiz.objectId}/1`);
  }

  async function submitAnswers() {
    if (Object.entries(questions.results).length != Object.entries(answeredIndexes).length) {
      const agree = confirm("Now all questions were answered, do you want to proceed?");
      if (!agree) return;
    }
    const agree = confirm("Do you want to finish the attempt?");
    if (!agree) return;

    setSessionData("quiz", quiz);
    setSessionData("questions", questions.results);
    setSessionData("answers", answeredIndexes);
    answeredIndexes = {};

    quiz.timesTaken++;
    delete quiz.updatedAt;
    delete quiz.createdAt;
    await updateData("quizzes", quiz.objectId, quiz);

    ctx.page.redirect("/results");
  }

  function clickRadioBtn(e) {
    const targetName = e.currentTarget.name;
    const questionNum = targetName.split("-")[1];
    const radio = document.getElementById(targetName);
    radio.classList.add("q-answered");

    answeredIndexes[questionNum] = Number(e.currentTarget.value);

    const span = document.getElementById("remaining");
    let context = span.textContent.split(" ");
    context[0] = String(Object.entries(questions.results).length - Object.keys(answeredIndexes).length);
    span.textContent = context.join(" ");
  }
}

const arithmetics = {
  "-": (num) => (num - 1 < 1 ? 1 : num - 1),
  "+": (num, max) => (num + 1 > max ? max : num + 1),
};
