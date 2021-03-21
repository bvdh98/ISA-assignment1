let questionNumber = 1;
// Create div for question #
let div = undefined;

function CreateQuestion() {
  // Define variables for simplification
  div = document.createElement("div");
  div.setAttribute("id", "div" + questionNumber);
  const fieldSet = document.getElementById("question_field");
  const questionID = "question" + questionNumber;

  // Create Question text
  const questionShow = document.createElement("p");
  questionShow.className = "question" + questionNumber;
  questionShow.append("Question " + questionNumber);

  // Create Answer text
  const answer = document.createElement("p");
  answer.setAttribute("style", "font-size:smaller");
  answer.className = "answerAmountHintOfQuestion" + questionNumber;
  answer.append("How many answers will there be?");

  // create textarea for adding questions
  const textArea = document.createElement("TEXTAREA");
  setAttributeHelper(textArea, {
    rows: "7",
    cols: "50",
    id: questionID,
    class: "question" + questionNumber,
  });

  // add to current div
  fieldSet.appendChild(div); // append div to fieldset
  div.appendChild(document.createElement("br"));
  div.appendChild(questionShow);
  div.appendChild(document.createElement("br"));
  div.appendChild(textArea);
  div.appendChild(answer);

  CreateAnswerAmountButtons();
  questionNumber++;
}

function CreateAnswerSection(answerAmount, Div) {
  divQuestionNumber = Div.id.replace(/^\D+/g, "");
  for (let i = 1; i <= answerAmount; i++) {
    let radio_name = "radio" + divQuestionNumber;
    let radio_id = "radio_id" + divQuestionNumber + "x" + i;
    const radio_button = document.createElement("input");
    setAttributeHelper(radio_button, {
      type: "radio",
      name: radio_name,
      id: radio_id,
      class: "question" + divQuestionNumber,
    });
    radio_button.style.margin = "10px";

    let choice_id = "choice_id" + divQuestionNumber + "x" + i;
    const answer_text = document.createElement("input");
    setAttributeHelper(answer_text, {
      type: "text",
      id: choice_id,
      class: "question" + divQuestionNumber,
    });
    answer_text.style.margin = "10px";

    Div.appendChild(document.createElement("br"));
    Div.appendChild(radio_button);
    Div.appendChild(answer_text);
  }
  removeAnswerButtons(divQuestionNumber);
  removeAnswerAmountHint(divQuestionNumber);
}

function CreateAnswerAmountButtons() {
  const twoAnswersBttn = Object.assign(document.createElement("button"), {
    type: "button",
    innerHTML: "2",
    className: "answerBttnOfQuestion" + questionNumber,
  });
  twoAnswersBttn.addEventListener("click", function() {
    CreateAnswerSection(2, this.parentElement);
  });
  twoAnswersBttn.style.margin = "10px";
  twoAnswersBttn.style.backgroundColor = "#FF0000";
  div.appendChild(twoAnswersBttn);

  const threeAnswersBttn = Object.assign(document.createElement("button"), {
    type: "button",
    innerHTML: "3",
    className: "answerBttnOfQuestion" + questionNumber,
  });
  threeAnswersBttn.addEventListener("click", function() {
    CreateAnswerSection(3, this.parentElement);
  });
  threeAnswersBttn.style.margin = "10px";
  threeAnswersBttn.style.backgroundColor = "#FF0000";
  div.appendChild(threeAnswersBttn);

  const fourAnswersBttn = Object.assign(document.createElement("button"), {
    type: "button",
    innerHTML: "4",
    className: "answerBttnOfQuestion" + questionNumber,
  });
  fourAnswersBttn.addEventListener("click", function() {
    CreateAnswerSection(4, this.parentElement);
  });
  fourAnswersBttn.style.margin = "10px";
  fourAnswersBttn.style.backgroundColor = "#FF0000";
  div.appendChild(fourAnswersBttn);
}

function removeAnswerButtons(divQuestionNumber) {
  let elements = document.getElementsByClassName(
    "answerBttnOfQuestion" + divQuestionNumber
  );
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function removeAnswerAmountHint(divQuestionNumber) {
  let elements = document.getElementsByClassName(
    "answerAmountHintOfQuestion" + divQuestionNumber
  );
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function deleteButton() {
  // Deletes the unique div
  questionNumber--;
  console.log("question number = " + questionNumber);
  document.getElementById("div" + questionNumber).remove();
}

function GetQuestions() {
  for (let i = 1; i < questionNumber; i++) {
    let question = {};
    question.content = document.getElementById("question" + i).value;

    //get all answer input text boxes of the associated question
    let answersNodeList = document.querySelectorAll(`[id^="choice_id${i}"]`);
    //convert node list to regular array
    let answers = Array.from(answersNodeList);
    //store value of each answer node in answers property
    question.answers = answers.map(x => x.value);
    //get all radio buttons of the associated question
    let radioButtonsNodeList = document.querySelectorAll(
      `[id^="radio_id${i}"]`
    );
    let radioButtons = Array.from(radioButtonsNodeList);
    for (let j = 0; j < radioButtons.length; j++) {
      if (radioButtons[j].checked === true) {
        //store the answer associated with the selected radio button in the correct answer property
        question.correctAnswer = question.answers[j];
      }
    }
    Save(question);
  }
}

function Save(question) {
  const endPoint = "http://localhost:8888/questions";
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", endPoint, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  console.log("question: " + question);
  xhttp.send(JSON.stringify(question));
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("response").innerHTML = this.responseText;
    }
  };
}

function setAttributeHelper(element, attr) {
  for (let key in attr) {
    element.setAttribute(key, attr[key]);
  }
}
