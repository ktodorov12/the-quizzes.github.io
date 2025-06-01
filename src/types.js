import page from "../lib/page/page.mjs";

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
 * @property {string} email
 */

/**
 * @typedef {Object} QuizHelper
 * @property {Function} createQuiz
 * @property {Function} addQuestionForm
 * @property {Function} submitQuiz
 * @property {Function} createQuestionData
 * @property {Function} onRemoveQuestion
 * @property {Function} onRemoveAnswerLine
 * @property {Function} addAnswerLine
 * @property {Function} editQuiz
 */

/**
 * @typedef {Object} QuestionData
 * @property {string} text
 * @property {Array} answers
 * @property {Number} correctIndex
 * @property {import("./data/requester").Pointer} quizId
 */