import { html } from "@lit-html/lit-html.js";
import { getAllData, search } from "@src/data/data.js";
import { updateTopic } from "@src/data/dataUpdate.js";
import { createSubmitHandler, parseQuery } from "@src/util.js";
import { navigationTemplate } from "@src/views/navigation.js";
import { quizCard } from "@src/views/partials.js";

/**
 * 
 * @param {import("@src/types").PageContext} ctx 
 * @param {Object} quizzes 
 * @param {Function} onSearch 
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function dashboardTemplate(ctx, quizzes, onSearch) {
  return html` 
  ${navigationTemplate(ctx)}
    <section id="browse">
      <header class="pad-large">
        <form @submit=${createSubmitHandler(onSearch)} class="browse-filter">
          <input class="input" type="text" name="title" />
          <select class="input" name="topic">
            <option value="all">All Categories</option>
            <option value="it">Languages</option>
            <option value="hardware">Hardware</option>
            <option value="software">Tools and Software</option>
          </select>
          <input class="input submit action" type="submit" value="Filter Quizes" />
        </form>
        <h1>All quizes</h1>
      </header>

      <div class="pad-large alt-page">${quizzes.map(quizCard)}</div>
    </section>`;
}

/** @param {import("@src/types").PageContext} ctx*/
export async function dashboardView(ctx) {
  // @ts-ignore
  const query = parseQuery(ctx.querystring);
  let res = {}

  if (!query) {
    res = await getAllData("quizzes");
  } else {
    const topic = query.topic;
    const title = query.title || "";
    res = await search("quizzes", title, topic);
  }

  const quizzes = await updateTopic(res)
  ctx.render(dashboardTemplate(ctx, quizzes, onSearch));

  async function onSearch({ title, topic }) {
    let query = `topic=${topic}`;
    if (title) {
      query = `title=${title}&` + query;
    }
    ctx.page.redirect(`dashboard?${query}`);
  }
}
