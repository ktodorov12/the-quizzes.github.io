import { createData } from "@src/data/data.js";
import { findEmptyQuestion, pointer } from "@src/util.js";

/**
 * @param {import("@src/types").PageContext} ctx
 * @param {Function} template - template to render, usually createTemplate
 * @param {{topic: string, title: string, questionCount: number, ownerId: import("./requester").Pointer}} quizData
 * @returns {import("@src/types").QuizHelper}
 */
export function quizHelper(ctx, template, quizData) {
  let questionNumbers = 0;
  let questionsData = {};

  const helper = {
    createQuiz,
    addQuestionForm,
    submitQuiz,
    createQuestionData,
    onRemoveQuestion,
    onRemoveAnswerLine,
    addAnswerLine,
  };
  return helper;

  /**
   * Begins quiz creation with a title and topic
   * @param {{title: string, topic: string}} data
   * @param {HTMLFormElement} form 
   * @returns {void}
   */
  function createQuiz(data, form) {
    if (!data.title) {
      //TODO add form validation
      return;
    }
    const createQuizBtn = document.getElementById("createQuiz");
    createQuizBtn.style.display = "block";
    createQuizBtn.querySelector("button").disabled = false;
    // @ts-ignore
    document.getElementById("addBtn").disabled = false;
    form.querySelectorAll("input").forEach(i => i.disabled = true);

    quizData.title = data.title;
    quizData.topic = data.topic;

    addQuestionForm();
  }

  /**Adds new question form to the createTemplate */
  function addQuestionForm() {
    questionNumbers++;
    questionsData[`question-${questionNumbers}`] = createQuestion();
    ctx.render(template(ctx, questionNumbers, helper, questionsData));
  }

  async function submitQuiz() {
    const unsavedQuestions = Object.values(questionsData).filter((x) => findEmptyQuestion(x));
    if (unsavedQuestions.length > 0) {
      const isConfirmed = confirm("There are questions that have not been saved, do you want to proceed?");

      if (!isConfirmed) {
        //TODO add form validation;
        return console.log(unsavedQuestions);
      }
    }
    const savedQuestions = Object.values(questionsData).filter((x) => !findEmptyQuestion(x));
    if (savedQuestions.length < 1) {
      return alert("No questions have been saved!");
    }
    quizData.questionCount = savedQuestions.length;
    try {
      //TODO add loader here
      const quiz = await createData("quizzes", quizData);
  
      savedQuestions.forEach(async (question) => {
        question.quizId.objectId = quiz.objectId;
        await createData("questions", question);
        await createData("solutions", { quizId: pointer("quizzes", quiz.objectId), correct: question.correctIndex });
      });
      ctx.page.redirect("/");
      //TODO remove loader here
    } catch (error) {
      ctx.page.redirect("/create");
      alert(error.message);
    }
  }

  /**
   * Takes data from the question form when create button is pressed
   * and adds the new data to questionsData for further use
   * @param {object} data - Question text, answers and right answer index (radio button)
   * @param {HTMLFormElement} form - The form for the question
   * @returns {void}
   */
  function createQuestionData(data, form) {
    const check = Object.entries(data).some((x) => x[0].includes("question") && x[1] != "");
    if (!check) {
      //TODO add form validation
      return;
    }

    questionsData[form.id] = createQuestion(data);
    const savedDiv = document.getElementById(`saved-${idParser(form.id)}`);
    savedDiv.classList.add("loading-overlay");
    savedDiv.classList.add("working");

    setTimeout(() => {
      savedDiv.classList.remove("loading-overlay")
      savedDiv.classList.remove("remove")
    }, 1500)
  }

  /**
   * Removes question form from the template and it's data
   * @event click
   * @param {object} e
   * @returns {void}
   * */
  function onRemoveQuestion(e) {
    const article = e.currentTarget.parentElement.parentElement.parentElement;
    const form = article.querySelector("form");

    delete questionsData[form.id];
    for (let key in questionsData) {
      const deletedId = idParser(form.id);
      const currentId = idParser(key);
      if (deletedId < currentId) {
        questionsData[`question-${currentId - 1}`] = questionsData[key];
        delete questionsData[key];
      }
    }
    questionNumbers--;

    ctx.render(template(ctx, questionNumbers, helper, questionsData));
  }

  /**
   * Adds answer line to specific question
   * @event click
   * @param {object} e
   * @returns {void}
   * */
  function addAnswerLine(e) {
    const form = e.currentTarget.parentElement;
    questionsData[form.id].answers.push(null);
    ctx.render(template(ctx, questionNumbers, helper, questionsData));
  }

  /**
   * Removes answer line from the specific question
   * @event click
   * @param {object} e
   * @returns {void}
   * */
  function onRemoveAnswerLine(e) {
    const answerLine = e.currentTarget.parentElement;
    const form = e.currentTarget.parentElement.parentElement;
    const answerIndex = Number(answerLine.querySelector("input").value);
    questionsData[form.id].answers.splice(answerIndex, 1);
    questionsData[form.id].correctIndex--;
    ctx.render(template(ctx, questionNumbers, helper, questionsData));
  }
}

/**
 * Parses given data by a criterion
 * @param {Object} object
 * @param {string} criteria
 * @returns {Array}
 */
function dataParser(object, criteria) {
  return Object.entries(object)
    .filter((x) => x[0].includes(criteria))
    .map((x) => x[1].trim());
}

/**
 * Creates shallow question or populates already created one with data
 * @param {import("@src/types").QuestionData=} data
 * @returns {import("@src/types").QuestionData}
 */
function createQuestion(data) {
  let question = {
    text: "",
    answers: [null, null, null],
    correctIndex: -1,
    quizId: pointer("quizzes", ""),
  };
  if (data) {
    question.text = data.text;
    question.answers = dataParser(data, "answer");
    question.correctIndex = Number(dataParser(data, "question").join());
  }
  return question;
}

/**
 * Parses question's id into number
 * @param {string} id
 * @returns {Number}
 */
const idParser = (id) => Number(id.split("-")[1]);
