import page from "@page/page.mjs";

import { session } from "@src/middlewares/session.js";
import { renderer } from "@src/middlewares/render.js";
import { loading } from "@src/middlewares/loading.js";

import { showHome } from "@src/views/home.js";
import { showLoginView } from "@src/views/login.js";
import { showRegister } from "@src/views/register.js";
import { showCreate } from "@src/views/create.js";

page(session());
page(renderer(document.querySelector("main")));

page("/", showHome);
page("/login", loading(), showLoginView);
page("/register", loading(), showRegister);
page("/create", showCreate)

page(showHome);
page.start();
