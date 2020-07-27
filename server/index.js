const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/index.js");
const e = require("express");
const app = express();

app.use(bodyParser.json());

app.get("/qa/:product_id", (req, res) => {
  let page = req.query.page ? req.query.page : 1;
  let count = req.query.count ? eq.query.count : 5;
  let resultData = {
    product_id: req.params.product_id,
    results: [],
  };
  db.query(
    `SELECT 
      q.question_id, q.question_body, q.question_date, q.asker_name,q.question_helpfullness, 
      JSON_ARRAYAGG(JSON_OBJECT('id', a.answer_id, 'body', a.body, 'date', a.date_written , 'a.answerer_name',
      a.answerer_name, 'helpfulness',a.helpfulness, "photos",'[]' , 'url',p.url)) as answers
     FROM questions q
     LEFT JOIN answers a ON a.question_id = q.question_id
     LEFT JOIN photos p ON a.answer_id = p.answer_id
            
    WHERE product_id = ${
      resultData.product_id
    } AND q.reported = 0 GROUP BY q.question_id  limit ${count} offset ${
      count * page
    };         
`,
    (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        resultData.results = data;
        res.status(200).send(resultData);
      }
    }
  );
});

///////////////////////////////////////////////////////////////////////////////

app.get("/qa/:question_id/answers", (req, res) => {
  // need to add photos to the returned answer
  let result = {
    question: req.params.question_id,
    page: req.query.page ? req.query.page : 1,
    count: req.query.count ? req.query.count : 5,
  };

  db.query(
    `SELECT a.answer_id,a.body,a.date_written,a.answerer_name,
        a.helpfulness,JSON_ARRAYAGG(photos.url) photos FROM answers a LEFT JOIN photos ON a.answer_id= photos.answer_id 
            WHERE a.question_id=${
              result.question
            } AND a.reported = 0 GROUP BY a.answer_id limit ${
      result.count
    } offset ${result.count * result.page}`,
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        result.results = data;
        result.results = result.results.map((item) => {
          if (item.photos === "[null]") {
            item["photos"] = [];

            return item;
          } else {
            item.photos = JSON.parse(item.photos);
            return item;
          }
        });

        res.send(result);
      }
    }
  );
});

///////////////////////////////////////////////////////////////////////////////

app.post("/qa/:product_id", (req, res) => {
  let { body, name, email } = req.body;
  db.query(
    `INSERT INTO questions(question_helpfullness, question_body, question_date, asker_name, asker_email, reported, product_id)
        VALUE (${0},"${body}", "${new Date()}", "${name}", "${email}",${0},${
      req.params.product_id
    })  
`,
    (err, data) => {
      if (err) {
        console.log(err);
      }
      res.status(201).send("question added");
    }
  );
});
/////////////////////////////////////////////////////////////////////////////

app.post("/qa/:question_id/answers", (req, res) => {
  let { body, name, email } = req.body;
  db.query(
    `INSERT INTO questions(question_id, body , date_written, answerer_name, answerer_email, reported,helpfulness)
            VALUE (${
              req.params.question_id
            },"${body}", "${new Date()}", "${name}", "${email}",${0},${0})  
    `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      } else {
        res.status(201).send("question added");
      }
    }
  );
});
////////////////////////////////////////////////////////////////////////////
app.put("/qa/question/:question_id/helpful", (req, res) => {
  db.query(
    `update questions
    set question_helpfullness = question_helpfullness + 1
    where id =${req.params.question_id};

    `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      } else {
        res.status(201).send("question_helpfulness updated");
      }
    }
  );
});

///////////////////////////////////////////////////////////////////////////
app.put("/qa/question/:question_id/report", (req, res) => {
  db.query(
    `update questions
     set reported = reported + 1
     where id =${req.params.question_id};
 
     `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      } else {
        res.status(201).send("question reported");
      }
    }
  );
});
//////////////////////////////////////////////////////////////////////////
app.put("/qa/answer/:answer_id/helpful", (req, res) => {
  db.query(
    `update answers
     set helpfulness = helpfulness + 1
     where answer_id =${req.params.answer_id};
 
     `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      } else {
        res.status(201).send("helpfulness updated");
      }
    }
  );
});

/////////////////////////////////////////////////////////////////////////
app.put("/qa/answer/:answer_id/report", (req, res) => {
  db.query(
    `update answers
     set reported = reported + 1
     where answer_id =${req.params.answer_id};
 
     `,
    (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(404);
      } else {
        res.status(201).send("answer reported");
      }
    }
  );
});
/////////////////////////////////////////////////////////////////////////
let port = 3001;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port: ${port}`);
  }
});
