import { html, render as baseRender } from "../../lib/lit-html/lit-html.js";

export function renderer(root) {
  return function (ctx, next) {
    ctx.render = (templateRes) => baseRender(templateRes, root);

    next();
  };
}
