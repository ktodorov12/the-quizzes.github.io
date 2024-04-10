export function quizHelper(ctx, template, quizData) {
  let questionNumbers = 0;
  let questionsData = {};

  const helper = {
    createQuiz,
    addQuestionForm,
    submitQuiz,
    createQuestionData,
    onRemoveQuestion,
    onRemoveAnswer
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
    questionsData[`question-${questionNumbers}`] = {}
    ctx.render(template(ctx, questionNumbers, helper));
  }

  function submitQuiz() {
    console.log(questionsData);
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

    questionsData[form.id] = {
        text: data.text,
        answers: dataParser(data, "answer"),
        correctIndex: Number(dataParser(data, "question").join()),
        quizId: ""
    }
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
    
    delete questionsData[form.id]
    questionNumbers--

    ctx.render(template(ctx, questionNumbers, helper))
  }

  function onRemoveAnswer() {

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