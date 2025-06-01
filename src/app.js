import page from "../lib/page/page.mjs";

import { session } from "../src/middlewares/session.js";
import { renderer } from "../src/middlewares/render.js";
import { loading } from "../src/middlewares/loading.js";

import { showHome } from "../src/views/home.js";
import { showLoginView } from "../src/views/login.js";
import { showRegister } from "../src/views/register.js";
import { showCreate } from "../src/views/create.js";
import { dashboardView } from "../src/views/dashoard.js";
import { showDetails } from "../src/views/details.js";
import { showContest } from "../src/views/contestMode.js";
import { showResults } from "../src/views/result.js";
import { showProfile } from "../src/views/profile.js";
import { showEdit } from "../src/views/edit.js";

page(session());
page(renderer(document.querySelector("main")));

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

page.start();
