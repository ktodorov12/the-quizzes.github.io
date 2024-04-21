import { html } from "@lit-html/lit-html.js";
import { getAllData, search } from "@src/data/data.js";
import { updateTopic } from "@src/data/dataUpdate.js";
import { createSubmitHandler, parseQuery } from "@src/util.js";
import { navigationTemplate } from "@src/views/navigation.js";
import { quizCard, topicOption } from "@src/views/partials.js";

/**
 *
 * @param {import("@src/types").PageContext} ctx
 * @param {Object} quizzes
 * @param {Function} onSearch
 * @param {Object} allTopics
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function dashboardTemplate(ctx, quizzes, onSearch, allTopics) {
  return html` 
  ${navigationTemplate(ctx)}
    <section id="browse">
      <header class="pad-large">
        <form @submit=${createSubmitHandler(onSearch)} class="browse-filter">
          <input class="input" type="text" name="title" />
          <select class="input" name="topic">
            ${allTopics.map(topicOption)}
          </select>
          <input class="input submit action" type="submit" value="Filter Quizes" />
        </form>
        <h1>All quizes</h1>
      </header>

      <div class="pad-large alt-page">${quizzes.map((quiz) => quizCard(quiz))}</div>
    </section>`;
}

/** @param {import("@src/types").PageContext} ctx*/
export async function dashboardView(ctx) {
  // @ts-ignore
  const query = parseQuery(ctx.querystring);
  const allTopics = await getAllData("quizTopic");
  let res = {};

  if (!query) {
    res = await getAllData("quizzes");
  } else {
    const topic = query.topic;
    const title = query.title || "";
    res = await search("quizzes", title, topic);
  }

  const quizzes = await updateTopic(res);
  ctx.render(dashboardTemplate(ctx, quizzes, onSearch, allTopics.results));

  async function onSearch({ title, topic }) {
    let query = `topic=${topic}`;
    if (title) {
      query = `title=${title}&` + query;
    }
    ctx.page.redirect(`dashboard?${query}`);
  }
}
