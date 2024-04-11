import { apiCreateQuiz } from "@src/data/quizzes.js";

/**
 * @param {import("@src/types").PageContext} ctx
 * @param {Function} template - template to render, usually createTemplate
 * @param {{topic: string, title: string, questionCount: number, ownerId: string}} quizData
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
    addAnswerLine
  }
  return helper;

  /**
   * Begins quiz creation with a title and topic
   * @param {{title: string, topic: string}} data 
   * @returns {void}
   */
  function createQuiz(data) {
    if (!data.title) {
      return;
    }
    const createQuizBtn = document.getElementById("createQuiz");
    createQuizBtn.style.display = "block";
    createQuizBtn.querySelector("button").disabled = false;
    // @ts-ignore
    document.getElementById("addBtn").disabled = false;

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

  function submitQuiz() {
    const userId = ctx.user.objectId;
    quizData.ownerId = userId
    const quiz = apiCreateQuiz(quizData)
    debugger
    // const updatedData = Object.fromEntries(Object.entries)
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
    for(let key in questionsData) {
      const deletedId = idParser(form.id);
      const currentId = idParser(key);
      if(deletedId < currentId) {
        questionsData[`question-${currentId - 1}`] = questionsData[key];
        delete questionsData[key];
      }
    }
    questionNumbers--

    ctx.render(template(ctx, questionNumbers, helper, questionsData));
  }

    /** 
   * Adds answer line to specific question
   * @event click 
   * @param {object} e 
   * @returns {void}
   * */
  function addAnswerLine(e) {
    const form = e.currentTarget.parentElement
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
    questionsData[form.id].correctIndex--
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
        quizId: ""
  }
  if(data) {
    question.text = data.text;
    question.answers = dataParser(data, "answer");
    question.correctIndex = Number(dataParser(data, "question").join());
    question.quizId = "";
  }
  return question
}

/**
 * Parses question's id into number
 * @param {string} id 
 * @returns {Number}
 */
const idParser = (id) => Number(id.split("-")[1]);