import { html } from "@lit-html/lit-html.js";
import { logout } from "@src/data/users.js";

/**
 * @param {import("@src/types").PageContext} ctx  
 * @returns {import('@lit-html/lit-html').TemplateResult} Returns an HTML template result.
*/
export function navigationTemplate(ctx) {
  return html` 
  <header id="titlebar">
    <nav>
      <a class="logotype" href="/"><i class="fas fa-question-circle"></i><i class="merge fas fa-check-circle"></i><span>Quiz Fever</span></a>
      <div class="navigation">
        <a class="nav-link" href="/dashboard">Browse</a>
        ${!!ctx.user 
            ? html`
            <div id="user-nav">
                <a class="nav-link" href="/create">Create</a>
                <a class="nav-link profile-link" href="/profile/${ctx.user.objectId}"><i class="fas fa-user-circle"></i></a>
                <a id="logoutBtn" class="nav-link" @click=${() => onLogout(ctx.page)} href="javascript:void(0)">Logout</a>
            </div>`
            : html`           
            <div id="guest-nav">
                <a class="nav-link" href="/login">Sign in</a>
            </div>`}
      </div>
    </nav>
  </header>`;
}

async function onLogout(page) {
  await logout();
  page.redirect("/")
}