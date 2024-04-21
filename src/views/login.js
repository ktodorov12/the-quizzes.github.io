import { html } from "@lit-html/lit-html.js";
import { login } from "@src/data/users.js";
import { createSubmitHandler } from "@src/util.js";
import { navigationTemplate } from "@src/views/navigation.js";

/**
 * Template for login view
 * @param {import("@src/types").PageContext} ctx
 * @param {Function} handler
 * @returns {import("@lit-html/lit-html.js").TemplateResult}
 */
function loginTemplate(ctx, handler) {
  return html` 
  ${navigationTemplate(ctx)}
    <section id="login">
      <div class="pad-large">
        <div class="glass narrow">
          <header class="tab layout">
            <h1 class="tab-item active">Login</h1>
            <a class="tab-item" href="/register">Register</a>
          </header>
          <form @submit=${handler} class="pad-med centered">
            <label class="block centered">Username: <input class="auth-input input" type="text" name="username" /></label>
            <label class="block centered">Password: <input class="auth-input input" type="password" name="password" /></label>
            <input class="block action cta" type="submit" value="Sign In" />
          </form>
        </div>
      </div>
    </section>`;
}

/**@param {import("@src/types").PageContext} ctx  */
export function showLoginView(ctx) {
  const handler = createSubmitHandler(onLogin);
  ctx.render(loginTemplate(ctx, handler));

  /** @param {{username: string, password: string}} data*/
  async function onLogin(data) {
    // TODO - add form error handling
    if (!data.username || !data.password) {
      return alert("All fields requiered");
    }
    await login(data);
    ctx.page.redirect("/");
  }
}
