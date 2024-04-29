import { html } from "@lit-html/lit-html.js";
import { getAllData } from "@src/data/data.js";
import { updateTopic } from "@src/data/dataUpdate.js";
import { navigationTemplate } from "@src/views/navigation.js";
import { quizCard } from "@src/views/partials.js";

/**
 *
 * @param {import("@src/types").PageContext} ctx
 * @returns {import('@lit-html/lit-html.js').TemplateResult} Returns an HTML template result.
 */
function homeTemplate(ctx, quizes) {
  return html` 
  ${navigationTemplate(ctx)}
    <section id="welcome">
      <div class="hero layout">
        <div class="splash right-col"><i class="fas fa-clipboard-list"></i></div>
        <div class="glass welcome">
          <h1>Welcome to Quiz Fever!</h1>
          <p>Home to ${quizes.length} quizes in 4 topics. <a href="/dashboard">Browse all quizes</a>.</p>
          ${ctx.user 
            ? html`<a class="action cta" href="/create">Create quiz</a>` 
            : html`<a class="action cta" href="/login">Sign in to create a quiz</a>`}
        </div>
      </div>

      <div class="pad-large alt-page">
        <h2>Our most recent quiz:</h2>
        ${quizes.slice(0, 3).map((quiz) => quizCard(quiz))}
        <div>
          <a class="action cta" href="/dashboard">Browse all quizes</a>
        </div>
      </div>
    </section>`;
}

/**@param {import("@src/types").PageContext} ctx */
export async function showHome(ctx) {
  const quizzes = await getAllData("quizzes");
  const updated = await updateTopic(quizzes);
  ctx.render(homeTemplate(ctx, updated));
}
