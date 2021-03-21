let questionArea = document.getElementById("questionArea");
let buttonDiv = document.getElementById("buttonDiv");
let quiz = [];
let quizCorrectAnswers = [];
let quizCorrectAnswersDict = [];
let score = 0;
document
  .getElementById("startquizButton")
  .addEventListener("click", function() {
    GetQuiz();
  });
async function GetQuiz() {
  const endPoint = "http://localhost:8888/questions";
  const response = await fetch(endPoint);
  const questionNodeList = await response.json();
  if (questionNodeList.results.length == 0) {
    RemoveStartButton();
    alert("no quiz available");
  } else {
    CreateSubmitButton();
    RemoveStartButton();
    CreateQuizObjects(questionNodeList);
  }
}
function CreateSubmitButton() {
  button = document.createElement("button");
  button.id = "submitquizButton";
  button.innerHTML = "Submit";
  button.addEventListener("click", function() {
    CheckAnswers();
  });
  buttonDiv.append(button);
}
function RemoveStartButton() {
  let button = document.getElementById("startquizButton");
  button.parentNode.removeChild(button);
}
function CreateQuizObjects(questionNodeList) {
  for (let i = 0; i < questionNodeList.results.length; i++) {
    let question = {};
    let answer = {};
    answer.id = JSON.parse(questionNodeList.results[i]).idanswers;
    answer.text = JSON.parse(questionNodeList.results[i]).answer_text;
    if (answer.id == JSON.parse(questionNodeList.results[i]).answer) {
      answer.correct = true;
    } else {
      answer.correct = false;
    }

    let currentQuestionId = JSON.parse(questionNodeList.results[i]).idQuestions;
    let questionObj = quiz.find(question => question.id === currentQuestionId);
    if (questionObj === undefined) {
      question.id = JSON.parse(questionNodeList.results[i]).idQuestions;
      question.text = JSON.parse(questionNodeList.results[i]).question_text;
      question.correctAnswer = JSON.parse(
        questionNodeList.results[i]
      ).idcorrect_answers;
      question.answers = [];
      question.answers.push(answer);
      quiz.push(question);
    } else {
      questionObj.answers.push(answer);
    }
  }
  console.log(quiz);
  CreateQuiz();
}

function CreateQuiz() {
  quiz.forEach(question => CreateQuestion(question));
}

function CreateQuestion(question) {
  //Create question div
  div = document.createElement("div");
  div.id = "divOfQuestion" + question.id;
  // Create Question text
  const questionShow = document.createElement("p");
  questionShow.append(question.text);
  div.append(questionShow);
  questionArea.append(div);

  CreateAnswerSection(question, div);
}

function CreateAnswerSection(question, Div) {
  divQuestionNumber = question.id;
  answerAmount = question.answers.length;
  for (let i = 0; i < answerAmount; i++) {
    let radio_name = "radio" + divQuestionNumber;
    let radio_id = "radio_id" + divQuestionNumber + "x" + i;
    const radio_button = document.createElement("input");
    setAttributeHelper(radio_button, {
      type: "radio",
      name: radio_name,
      id: radio_id,
      class: "question" + divQuestionNumber,
    });
    if (question.answers[i].correct == true) {
      quizCorrectAnswers.push(radio_id);
      quizCorrectAnswersDict["question" + divQuestionNumber] =
        question.answers[i].text;
    }
    radio_button.style.margin = "10px";

    let choice_id = "choice_id" + divQuestionNumber + "x" + i;
    const answer_text = document.createElement("input");
    setAttributeHelper(answer_text, {
      type: "text",
      id: choice_id,
      class: "question" + divQuestionNumber,
      value: question.answers[i].text,
      readOnly: true,
    });
    answer_text.style.margin = "10px";
    feedBackSection = document.createElement("div");
    feedBackSection.id = "feedbackSectionOf" + divQuestionNumber;

    Div.appendChild(document.createElement("br"));
    Div.appendChild(radio_button);
    Div.appendChild(answer_text);
  }
  Div.appendChild(feedBackSection);
  console.log("correct answers: " + quizCorrectAnswersDict);
}
function setAttributeHelper(element, attr) {
  // sets multiple attributes
  // element: an element
  // attr: {"attribute": "value"}
  for (var key in attr) {
    element.setAttribute(key, attr[key]);
  }
}

function RemoveSubmitButton() {
  let button = document.getElementById("submitquizButton");
  button.parentNode.removeChild(button);
}

function CheckAnswers() {
  RemoveSubmitButton();
  let radioButtonsNodeList = document.querySelectorAll(`[id^="radio_id`);
  let radioButtons = Array.from(radioButtonsNodeList);
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked === true) {
      CheckAnswerKey(radioButtons[i].id);
    }
  }
  console.log("score: " + score);
  DisplayScore();
  DisplayFeedBack();
}

function CheckAnswerKey(radioButton) {
  console.log(radioButton);
  if (quizCorrectAnswers.includes(radioButton)) {
    score++;
  }
}

function DisplayScore() {
  let message = "Score: " + score + "/" + quiz.length;
  alert(message);
}

function DisplayFeedBack() {
  quiz.forEach(question => ProcessQuestion(question));
}

function ProcessQuestion(question) {
  correctAnswer = quizCorrectAnswersDict["question" + question.id];
  feedBackSection = document.getElementById("feedbackSectionOf" + question.id);
  feedBackSection.innerHTML = "Correct Answer = " + correctAnswer;
}
