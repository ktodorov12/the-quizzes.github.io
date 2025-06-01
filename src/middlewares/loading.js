import { loading as loadingTemp } from "../../src/views/partials.js";

export function loading() {
  return function (ctx, next) {
    ctx.render(loadingTemp());

    next();
  };
}
