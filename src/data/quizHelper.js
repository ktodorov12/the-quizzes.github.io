import { createData, deleteData, updateData } from "@src/data/data.js";
import { findEmptyQuestion, pointer } from "@src/util.js";

/**
 * @param {import("@src/types").PageContext} ctx
 * @param {Function} template - template to render
 * @param {{
 * topic: string, 
 * title: string, 
 * questionCount: number, 
 * timesTaken: number,
 * description: string,
 * ownerId: import("./requester").Pointer
 * createdAt?: string,
 * updatedAt?: string,
 * objectId?: string}} quizData
 * @param {Object} allTopics 
 * @param {Object=} allQuestions 
 * @returns {import("@src/types").QuizHelper}
 */
export function quizHelper(ctx, template, quizData, allTopics, allQuestions) {
  let questionNumbers = quizData.questionCount;
  let questionsData = {};
  let oldQuestions = [];
  
  if(allQuestions) {
    allQuestions.forEach((question, i) => parseQuestions(questionsData, i, question))
    oldQuestions = JSON.parse(JSON.stringify(allQuestions));
  }
  
  const helper = {
    createQuiz,
    addQuestionForm,
    submitQuiz,
    createQuestionData,
    onRemoveQuestion,
    onRemoveAnswerLine,
    addAnswerLine,
    editQuiz
  };
  return helper;

  /**
   * Begins quiz creation with a title and topic
   * @param {{title: string, topic: string, description: string}} data
   * @param {HTMLFormElement} form 
   * @returns {void}
   */
  function createQuiz(data, form) {
    if (!data.title) return
    const createQuizBtn = document.getElementById("createQuiz");

    if(createQuizBtn) {
      createQuizBtn.style.display = "block";
      createQuizBtn.querySelector("button").disabled = false;
      // @ts-ignore
      document.getElementById("addBtn").disabled = false;
      form.querySelectorAll("input").forEach(i => i.disabled = true);

      addQuestionForm();
    }

    quizData.title = data.title;
    quizData.topic = data.topic;
    quizData.description = data.description
  }

  /**Adds new question form to the createTemplate */
  function addQuestionForm() {
    questionNumbers++;
    questionsData[`question-${questionNumbers}`] = createQuestion();
    ctx.render(template(ctx, questionNumbers, helper, questionsData, allTopics, quizData));
  }

  /**Creates quiz by the provided data*/
  async function submitQuiz(e) {
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
      e.currentTarget.disabled = true;

      const quiz = await createData("quizzes", quizData);

      for (const question of savedQuestions){
        question.quizId.objectId = quiz.objectId;
        await createData("questions", question);
      };
      
      ctx.page.redirect("/");
    } catch (error) {
      ctx.page.redirect("/create");
      alert(error.message);
    }
  }

  /**Edits quiz by the provided data */
  async function editQuiz(e) {
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
    // @ts-ignore
    try {
      e.currentTarget.disabled = true;

      delete quizData.createdAt
      delete quizData.updatedAt
      quizData.questionCount = savedQuestions.length;
      const updateQuiz = updateData("quizzes", quizData.objectId, quizData);
      const promises = [updateQuiz];
      
      for (const oldQuestion of oldQuestions) {
        const deletePromise = deleteData("questions", oldQuestion.objectId);
        promises.push(deletePromise)        
      }

      for (const savedQuestion of savedQuestions) {
        savedQuestion.quizId.objectId = quizData.objectId
        const createPromise = createData("questions", savedQuestion);
        promises.push(createPromise);
      }
      await Promise.all(promises);

      ctx.page.redirect(`/profile/${quizData.ownerId.objectId}`);
    } catch (error) {
      // @ts-ignore
      ctx.page.redirect(`/edit/${quizData.objectId}`);
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

    ctx.render(template(ctx, questionNumbers, helper, questionsData, allTopics, quizData));
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
    ctx.render(template(ctx, questionNumbers, helper, questionsData, allTopics, quizData));
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
    ctx.render(template(ctx, questionNumbers, helper, questionsData, allTopics, quizData));
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

/**
 * It is used when there are existing questions so they are parsed in the correct way for the helper functions
 * @param {Object} questionsData - Updates questions data 
 * @param {number} num - number of the question 
 * @param {object} question - the existing question
 */
function parseQuestions(questionsData, num, question) {
  questionsData[`question-${num + 1}`] = {
    text: question.text,
    answers: question.answers,
    correctIndex: question.correctIndex,
    quizId: question.quizId,
  }
}