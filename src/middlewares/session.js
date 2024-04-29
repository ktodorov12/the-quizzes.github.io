import { getUserData } from ".././util.js";

export function session() {
  return function (ctx, next) {
    ctx.user = getUserData();

    next();
  };
}
