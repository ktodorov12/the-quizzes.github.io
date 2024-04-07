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
export async function createQuiz(data) {
  await post(endpoints.allData, data);
}

/** @returns Promise<any> */
export async function getAllQuizes() {
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
export async function updateQuiz(id, data) {
    await put(endpoints.request(id), data)
}

/**@param {string} id - id of the quiz to be deleted*/
export async function deleteQuiz(id) {
    await del(endpoints.request(id));
}