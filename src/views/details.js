import { html } from "@lit-html/lit-html.js";
import { getDataDetails } from "@src/data/data.js";
import { updateTopic } from "@src/data/dataUpdate.js";
import { navigationTemplate } from "@src/views/navigation.js";

/**
 * 
 * @param {import("@src/types").PageContext} ctx 
 * @param {Object} quiz 
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function detailsTemplate(ctx, quiz) {
  return html` 
  ${navigationTemplate(ctx)}
    <section id="details">
      <div class="pad-large alt-page">
        <article class="details">
          <h1>${quiz.title}</h1>
          <span class="quiz-topic">A quiz by <a href="#">${ctx.user?.username}</a> on the topic of ${quiz.topic}</span>
          <div class="quiz-meta">
            <span>${quiz.questionCount} Questions</span>
            <span>|</span>
            <span>Taken ${quiz.timesTaken} times</span>
          </div>
          <p class="quiz-desc">${quiz.description}</p>

          ${!!ctx.user
            ? html` <div>
                <a class="cta action" href="#">Begin Quiz</a>
              </div>`
            : null}
        </article>
      </div>
    </section>`;
}

/**
 *
 * @param {import("@src/types").PageContext} ctx
 */
export async function showDetails(ctx) {
  // @ts-ignore
  const quizId = ctx.params.id;
  const quizDetails = await getDataDetails("quizzes", quizId);
  const updated = await updateTopic(quizDetails);
  ctx.render(detailsTemplate(ctx, updated[0]));
}
