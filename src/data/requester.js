import { clearUserData, getUserToken } from ".././util.js";
import { render } from "../../lib/lit-html/lit-html.js";
import { loading } from "../views/partials.js";

const host = "https://parseapi.back4app.com";
const appId = "wiGlkOqBJqWcycdj7p7yhQbgwk6qksF26LhMIydm";
const apiKey = "BDfgK1OMAfyEIuJkFNRz0bfFmrDru2rbIAoaY25C";

/**
 *
 * @param {string} method
 * @param {string} url
 * @param {Object} data
 */
async function requester(method, url, data) {
  const options = {
    method,
    headers: {
      "X-Parse-Application-Id": appId,
      "X-Parse-JavaScript-Key": apiKey,
    },
  };

  if (data) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  const token = getUserToken();
  if (token) {
    options.headers["X-Parse-Session-Token"] = token;
  }

  try {
    render(loading(), document.querySelector("main"));
    const response = await fetch(host + url, options);

    if (!response.ok) {
      const error = await response.json();

      if (error.code == 209) {
        clearUserData();
      }
      throw new Error(error.message);
    }

    if (response.status == 204) {
      return response;
    } else {
      return response.json();
    }
  } catch (error) {
    //TODO if error is required
    alert(error);
    throw error;
  }
}

/** @type {(url: string) => Promise<any>}*/
export const get = (url) => requester("get", url);
/** @type {(url: string, data: object) => Promise<any>}*/
export const post = (url, data) => requester("post", url, data);
/** @type {(url: string, data: object) => Promise<any>}*/
export const put = (url, data) => requester("put", url, data);
/** @type {(url: string) => Promise<any>}*/
export const del = (url) => requester("delete", url);

/**
 * @typedef {Object} Pointer
 * @property {string} __type
 * @property {string} className
 * @property {string} objectId
 */
