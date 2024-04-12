import { post, get, put, del } from "@src/data/requester.js";

const endpoints = {
  allData: (apiClass) => `/classes/${apiClass}`,
  request: (apiClass, id) => `/classes/${apiClass}/${id}`,
};

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; solutions
 * @param {Object} data
 * @return {Promise<Object>} 
 */
export async function createData(apiClass, data) {
  return await post(endpoints.allData(apiClass), data);
}

/** 
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; solutions
 * @returns {Promise<Object>} 
*/
export async function getAllData(apiClass) {
  return await get(endpoints.allData(apiClass));
}

/**
 * The data that must be recieved
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; solutions 
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>} 
*/
export async function updateData(apiClass, id, data) {
    return await put(endpoints.request(apiClass, id), data)
}

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; solutions
 * @param {string} id - id of the quiz to be deleted
 * @returns {Promise<Object>} 
*/
export async function deleteData(apiClass, id) {
    return await del(endpoints.request(apiClass, id));
}