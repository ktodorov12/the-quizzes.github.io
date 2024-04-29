import { html } from "../../lib/lit-html/lit-html.js";
import { getDataDetails, getUserById } from "../data/data.js";
import { updateTopic } from "../data/dataUpdate.js";
import { isOwner } from "../util.js";
import { navigationTemplate } from "./navigation.js";

/**
 *
 * @param {import("@src/types").PageContext} ctx
 * @param {Object} quiz
 * @param {import("@src/types").UserSession} creator
 * @param {Boolean} isOwner
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function detailsTemplate(ctx, quiz, creator, isOwner) {
  return html` 
  ${navigationTemplate(ctx)}
    <section id="details">
      <div class="pad-large alt-page">
        <article class="details">
          <h1>${quiz.title}</h1>
          <span class="quiz-topic">A quiz by <a href="/profile/${creator.objectId}">${creator.username}</a> on the topic of ${quiz.topic}</span>
          <div class="quiz-meta">
            <span>${quiz.questionCount} Questions</span>
            <span>|</span>
            <span>Taken ${quiz.timesTaken} times</span>
          </div>
          <p class="quiz-desc">${quiz.description}</p>

          ${!!ctx.user && !isOwner
            ? html` <div>
                <a class="cta action" href="/contest/${quiz.objectId}/${1}">Begin Quiz</a>
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
  const creator = await getUserById(updated[0].ownerId.objectId);
  const owner = isOwner(creator.objectId);
  ctx.render(detailsTemplate(ctx, updated[0], creator, owner));
}
