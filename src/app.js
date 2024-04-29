import page from "../lib/page/page.mjs";

import { session } from "./middlewares/session.js";
import { renderer } from "./middlewares/render.js";
import { loading } from "./middlewares/loading.js";

import { showHome } from "./views/home.js";
import { showLoginView } from "./views/login.js";
import { showRegister } from "./views/register.js";
import { showCreate } from "./views/create.js";
import { dashboardView } from "./views/dashoard.js";
import { showDetails } from "./views/details.js";
import { showContest } from "./views/contestMode.js";
import { showResults } from "./views/result.js";
import { showProfile } from "./views/profile.js";
import { showEdit } from "./views/edit.js";

page(session());
page(renderer(document.querySelector("main")));
page(loading());

page("/", showHome);
page("/login", showLoginView);
page("/register", showRegister);
page("/create", showCreate);
page("/dashboard", dashboardView);
page("/details/:id", showDetails);
page("/contest/:id/:num", showContest);
page("/results", showResults);
page("/profile/:id", showProfile);
page("/edit/:id", showEdit)

page(loading(), showHome);
page.start();
