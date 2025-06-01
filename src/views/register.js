import { html } from "../../lib/lit-html/lit-html.js";
import { register } from "../../src/data/users.js";
import { createSubmitHandler } from "../../src/util.js";
import { navigationTemplate } from "../../src/views/navigation.js";

/**
 * Register form template
 * @param {import("../../src/types").PageContext} ctx
 * @param {Function} handler
 * @returns {import("../../lib/lit-html/lit-html.js").TemplateResult}
 */
function loginTemplate(ctx, handler) {
  return html` 
  ${navigationTemplate(ctx)}
    <section id="register">
      <div class="pad-large">
        <div class="glass narrow">
          <header class="tab layout">
            <a class="tab-item" href="/login">Login</a>
            <h1 class="tab-item active">Register</h1>
          </header>
          <form @submit=${handler} class="pad-med centered">
            <label class="block centered">Username: <input class="auth-input input" type="text" name="username" /></label>
            <label class="block centered">Email: <input class="auth-input input" type="text" name="email" /></label>
            <label class="block centered">Password: <input class="auth-input input" type="password" name="password" /></label>
            <label class="block centered">Repeat: <input class="auth-input input" type="password" name="repass" /></label>
            <input class="block action cta" type="submit" value="Create Account" />
          </form>
        </div>
      </div>
    </section>`;
}

/**@param {import("../../src/types").PageContext} ctx  */
export function showRegister(ctx) {
  const handler = createSubmitHandler(onRegister);
  ctx.render(loginTemplate(ctx, handler));

  /** @param {{username: string, password: string, email: string, repass: string}} data*/
  async function onRegister(data) {
    // TODO - add form error handling
    if (!data.username || !data.password || !data.email) {
      return alert("All fields requiered");
    }

    const body = {
      username: data.username,
      password: data.password,
      email: data.email,
    };
    debugger
    await register(body);
    ctx.page.redirect("/");
  }
}
