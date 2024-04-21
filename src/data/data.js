import { post, get, put, del } from "@src/data/requester.js";

const endpoints = {
  allData: (apiClass) => `/classes/${apiClass}`,
  request: (apiClass, id) => `/classes/${apiClass}/${id}`,
  search: (apiClass, whereClause) => `/classes/${apiClass}?where=${encodeURIComponent(JSON.stringify(whereClause))}`,
  user: (userId) => `/users/${userId}`,
  allDataPointedToItem: (searchedClass, itemId, propertyPointer, className) => `/classes/${searchedClass}?where={"${propertyPointer}": {"__type":"Pointer","className":"${className}","objectId":"${itemId}"}}`,
  resultQuiz: (quizId, userId) => `/classes/quizResults?where={"takenQuizId": "${quizId}","participatedUser": {"__type":"Pointer", "className":"_User","objectId":"${userId}"}}`,
  participationForQuiz: (quizId) => `/classes/quizResults?where={"takenQuizId": "${quizId}"}`
};

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; quizTopic; quizResults;
 * @param {Object} data
 * @return {Promise<Object>}
 */
export async function createData(apiClass, data) {
  return await post(endpoints.allData(apiClass), data);
}

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; quizTopic; quizResults;
 * @returns {Promise<Object>}
 */
export async function getAllData(apiClass) {
  return await get(endpoints.allData(apiClass));
}

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; quizTopic; quizResults;
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getDataDetails(apiClass, id) {
  const data = await get(endpoints.request(apiClass, id))
  return { results: [data] };
}

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; quizTopic; quizResults;
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function updateData(apiClass, id, data) {
  return await put(endpoints.request(apiClass, id), data);
}

/**
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; quizTopic; quizResults;
 * @param {string} id - id of the quiz to be deleted
 * @returns {Promise<Object>}
 */
export async function deleteData(apiClass, id) {
  return await del(endpoints.request(apiClass, id));
}

/**
 * Function to search for quiz by title and topic
 * @param {string} apiClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; quizTopic; quizResults;
 * @param {string} title - if there is no title it empty string should be given, for it to search all quizzes in a topic
 * @param {string} topic - Topic is either all or specified by the user, there must always be topic 
 * @returns {Promise<Object>}
 */
export async function search(apiClass, title, topic) {
  let whereClause = { title: { $regex: title, $options: "i" } };
  if (topic !== "all") {
    whereClause.topic = topic;
  }
  return await get(endpoints.search(apiClass, whereClause));
}

/**
 * Gets data for a user by the user ID
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export async function getUserById(userId) {
  return await get(endpoints.user(userId));
}

/**
 * Returns all of the data in the backend that points to a specific item
 * @param {string} searchedClass - The classes which are putted in the URL for the back4app request, they might be - questions; quizzes; solutions; quizTopic; quizResults;
 * @param {string} itemId - The ID of the item of which we want the data
 * @param {string} propertyPointer - The name of the property in the object that is the pointer - ex.: quizId (for pointer to quiz); participatedUser (for pointer to user); ownerId (in quizzes points to the owner)
 * @param {string} className - The class that the pointer point to - ex.: "_User", "quizzes";
 * @returns {Promise<Object>}
 */
export async function getAllDataForOneItem(searchedClass, itemId, propertyPointer, className) {
  return await get(endpoints.allDataPointedToItem(searchedClass, itemId, propertyPointer, className));
}

export async function getResultsForQuiz(quizId, userId) {
  return await get(endpoints.resultQuiz(quizId, userId));
}

export async function getAllParticipationsForQuiz(quizId) {
  return await get(endpoints.participationForQuiz(quizId));
}