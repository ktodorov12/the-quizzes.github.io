import { getAllData } from "@src/data/data.js";

/**
 * Takes a quiz or quizzes and changes its topic in the corresponding one
 * @param {Object} quiz
 * @returns
 */
export async function updateTopic(quiz) {
  const topics = await getAllData("quizTopic");

  const updated = await Promise.all(
    quiz.results.map((quiz) => {
      const correctTopic = topics.results.find((q) => q.value == quiz.topic);
      quiz.topic = correctTopic.textContent;
      return quiz;
    })
  );

  return updated;
}
