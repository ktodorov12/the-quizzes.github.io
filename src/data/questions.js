import { post, get, put, del } from "@src/data/requester.js";

const endpoints = {
  allData: "/classes/questions",
  request: (id) => `/classes/questions/${id}`,
};

/**
 * The data that must be recieved
 * @param {{
 *   text: string,
 *   answers: Array,
 *   correctIndex: number,
 *   quizId: import("@src/data/requester").Pointer
 * }} data
 */
export async function createQuestion(data) {
  await post(endpoints.allData, data);
}

/** @returns Promise<any> */
export async function gelAllQuestions() {
  return await get(endpoints.allData);
}

/**
 * The data that must be recieved
 * @param {string} id
 * @param {{
*   text: string,
*   answers: Array,
*   correctIndex: number,
*   quizId: import("@src/data/requester").Pointer
* }} data
*/
export async function updateQuestion(id, data) {
    await put(endpoints.request(id), data)
}

/**@param {string} id - id of the quiz to be deleted*/
export async function deleteQuestion(id) {
    await del(endpoints.request(id));
}