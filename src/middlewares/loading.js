import { loading as loadingTemp } from "../views/partials.js";

export function loading() {
  return function (ctx, next) {
    ctx.render(loadingTemp());

    next();
  };
}
