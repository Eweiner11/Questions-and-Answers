var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database:'SDC'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports=con;


// ///////////////////////////////////
// CREATE TABLE questions (
//     -> id INT NOT NULL AUTO_INCREMENT,
//     -> question_helpfullness int(10),
//     -> questions_body varchar(255),
//     -> questions_date varchar(255),
//     -> asker_name varchar(255),
//     -> reported int(10),
//     -> product_id int(10),
//     -> PRIMARY KEY (id));


// CREATE table photos(
//     -> id INT NOT NULL AUTO_INCREMENT,
//     -> answer_id INT(10),
//     -> url varchar(255),
//     -> PRIMARY KEY(id));

// CREATE TABLE answers (
//     -> answer_id INT NOT NULL AUTO_INCREMENT,
//     -> question_id int(10),
//     -> body varchar(255),
//     -> date_written varchar(255),
//     -> answerer_name varchar(100),
//     -> answerer_email varchar(200),
//     -> reported int(10),
//     -> helpfull int(10),
//     -> PRIMARY KEY(id));