import { post, get, put, del } from "@src/data/requester.js";

const endpoints = {
  allData: (apiClass) => `/classes/${apiClass}`,
  request: (apiClass, id) => `/classes/${apiClass}/${id}`,
  search: (apiClass, whereClause) => `/classes/${apiClass}?where=${encodeURIComponent(JSON.stringify(whereClause))}`,
};

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; solutions; quizTopic
 * @param {Object} data
 * @return {Promise<Object>}
 */
export async function createData(apiClass, data) {
  return await post(endpoints.allData(apiClass), data);
}

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; solutions; quizTopic
 * @returns {Promise<Object>}
 */
export async function getAllData(apiClass) {
  return await get(endpoints.allData(apiClass));
}

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; solutions; quizTopic
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getDataDetails(apiClass, id) {
  const data = await get(endpoints.request(apiClass, id))
  return { results: [data] };
}

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; solutions; quizTopic
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function updateData(apiClass, id, data) {
  return await put(endpoints.request(apiClass, id), data);
}

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; solutions; quizTopic
 * @param {string} id - id of the quiz to be deleted
 * @returns {Promise<Object>}
 */
export async function deleteData(apiClass, id) {
  return await del(endpoints.request(apiClass, id));
}

export async function search(apiClass, title, topic) {
  let whereClause = { title: { $regex: title, $options: "i" } };
  if (topic !== "all") {
    whereClause.topic = topic;
  }
  return await get(endpoints.search(apiClass, whereClause));
}

