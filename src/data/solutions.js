import { post, get, put, del } from "@src/data/requester.js";

const endpoints = {
  allData: "/classes/solutions",
  request: (id) => `/classes/solutions/${id}`,
};

/**
 * The data that must be recieved
 * @param {{
 *   quizId: import("@src/data/requester").Pointer
 *   correct: number,
 * }} data
 */
export async function createAnswer(data) {
  await post(endpoints.allData, data);
}

/** @returns Promise<any> */
export async function gelAllAnswers() {
  return await get(endpoints.allData);
}

/**
 * The data that must be recieved
 * @param {string} id
 * @param {{
*   quizId: import("@src/data/requester").Pointer
*   correct: number,
* }} data
*/
export async function updateAnswer(id, data) {
    await put(endpoints.request(id), data)
}

/**@param {string} id - id of the solution to be deleted*/
export async function deleteAnswer(id) {
    await del(endpoints.request(id));
}