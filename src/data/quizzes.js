import { post, get, put, del } from "@src/data/requester.js";

const endpoints = {
  allData: "/classes/quizzes",
  request: (id) => `/classes/quizzes/${id}`,
};

/**
 * The data that must be recieved
 * @param {{
 *   title: string,
 *   topic: string, questionCount: number,
 *   ownerId: import("./requester").Pointer
 * }} data
 */
export async function apiCreateQuiz(data) {
  return await post(endpoints.allData, data);
}

/** @returns Promise<any> */
export async function apiGetAllQuizes() {
  return await get(endpoints.allData);
}

/**
 * The data that must be recieved 
 * @param {string} id - id of the quiz to be updated
 * @param {{
*   title: string,
*   topic: string, questionCount: number,
*   ownerId: import("./requester").Pointer
* }} data
*/
export async function apiUpdateQuiz(id, data) {
    return await put(endpoints.request(id), data)
}

/**@param {string} id - id of the quiz to be deleted*/
export async function apiDeleteQuiz(id) {
    return await del(endpoints.request(id));
}