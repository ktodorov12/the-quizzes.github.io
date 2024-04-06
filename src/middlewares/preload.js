/**
 * Feth data from the remote and store it in the context under "data"
 * @param {*} collection
 * @param {string=} objectId
 * @returns
 */

export function preload(collection, objectId) {
  return async function (ctx, next) {
    //change logic here
    /* if(collection == needed collection) {
        ctx.data = await queryCollection(objectId);
    } 
    */
  };
}

async function queryCollection(id) {
  if (id) {
    // get the needed elements
  } else {
    // returns all
  }
}
