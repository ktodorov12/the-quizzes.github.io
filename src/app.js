import page from "@page/page.mjs";

import { session } from "@src/middlewares/session.js";
import { renderer } from "@src/middlewares/render.js";
import { loading } from "@src/middlewares/loading.js";

import { showHome } from "@src/views/home.js";
import { showLoginView } from "@src/views/login.js";
import { showRegister } from "@src/views/register.js";
import { showCreate } from "@src/views/create.js";
import { dashboardView } from "@src/views/dashoard.js";
import { showDetails } from "@src/views/details.js";

page(session());
page(renderer(document.querySelector("main")));
page(loading())

page("/", showHome);
page("/login", showLoginView);
page("/register", showRegister);
page("/create", showCreate);
page("/dashboard", dashboardView);
page("/details/:id", showDetails);

page(loading(), showHome);
page.start();
