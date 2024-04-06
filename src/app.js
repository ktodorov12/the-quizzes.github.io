import page from "@page/page.mjs";

import { session } from "@src/middlewares/session.js";
import { renderer } from "@src/middlewares/render.js";

page(session());
page(renderer(document.querySelector("main")));

page.start();
