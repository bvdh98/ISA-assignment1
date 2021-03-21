const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const port = 8888;

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "isa_assignment1",
  multipleStatements: true,
});

app.post("/questions", (req, res) => {
  console.log(req.body.answers);
  let question = {};
  question.content = req.body.content;
  question.answers = req.body.answers;
  question.correctAnswer = req.body.correctAnswer;
  let answers = question.answers.map(x => [x]);
  let questionStmt = `INSERT INTO questions (question_text) values ('${question.content}')`;
  db.query(questionStmt, function(err, result) {
    if (err) {
      console.log(
        `${question.content} could not be stored in the DB: ` + err.stack
      );
      res.sendStatus(400);
    }
    console.log(`question ${question.content} was stored succesfully`);
  });
  question.answers.forEach(element => {
    let answersStmt = `INSERT INTO answers (answer_text,questionId) values ('${element}', (SELECT idQuestions from questions where question_text = '${question.content}'))`;
    db.query(answersStmt, function(err, result) {
      if (err) {
        console.log(
          `the question ${question.content} could not have it's answers stored succesfully: ` +
            err.stack
        );
        res.sendStatus(400);
      }
      console.log(
        `the question ${question.content} could have it's answers stored succesfully`
      );
    });
  });

  let correctAnswersStmt = `INSERT INTO correct_answers (question,answer) values ((SELECT idQuestions FROM questions WHERE question_text = '${question.content}'),(SELECT idanswers FROM answers where answer_text = '${question.correctAnswer}' AND questionId = (SELECT idQuestions from questions where question_text = '${question.content}')))`;
  db.query(correctAnswersStmt, function(err, result) {
    if (err) {
      console.log(
        `the question ${question.content} could not have it's correct answer stored succesfully: ` +
          err.stack
      );
      res.sendStatus(400);
    }
    console.log(
      `the question ${question.content} could have it's correct answer stored succesfully`
    );
    res.send("quiz saved");
  });
});

app.get("/questions", (req, res) => {
  let questionQuery =
    "SELECT * FROM questions JOIN answers ON (questions.idQuestions = answers.questionId) JOIN correct_answers ON (questions.idQuestions = correct_answers.question)";
  let string = "";
  db.query(questionQuery, function(err, result, fields) {
    if (err) {
      console.log(`could not get questions: ` + err.stack);
      res.sendStatus(400);
    }
    console.log(`Got all question_text`);
    let query_obj = { results: [] };
    for (let i = 0; i < result.length; i++) {
      query_obj["results"].push(JSON.stringify(result[i]));
    }
    console.log(query_obj.results);
    string = JSON.stringify(query_obj);
    res.send(string);
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port} !`);
});
