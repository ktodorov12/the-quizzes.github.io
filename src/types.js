import page from "@page/page.mjs";

/**
 * @typedef {Object} PageContext
 * @property {UserSession} user
 * @property {typeof page} page
 * @property {(templateResult) => void} render
 */

/**
 * @typedef {Object} UserSession
 * @property {string} objectId
 * @property {string} username
 * @property {string} sessionToken
 */
