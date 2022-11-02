const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs");

var db;

MongoClient.connect(
  "mongodb+srv://Id:pw@cluster0.mk7eto8.mongodb.net/?retryWrites=true&w=majority",
  function (err, client) {
    if (err) return console.log(err);
    db = client.db("todoapp");
    const test = db
      .collection("post")
      .insertOne({ 제목: "John", 나이: 20 }, function (err, result) {
        console.log("저장완료");
      });
    console.log(test);
  }
);

app.listen(8080, function () {
  console.log("listening on 8080");
});

//8080포트에 서버 띄워 주세요
// 컴퓨터에는 외부와 네트워크 통신을 하기위한 구멍이 있음.
// 8080구멍 을 통해서 들어오는 사람들은 이 작업을 해주세요 이 서버에 연결해주세요
//내컴퓨터의 8080구녕으로 들어가는 방법 = 크롬주소창에 localhost:8080쳐

// 이제 요청을 처리하는 기계 제작하기
//url에다가 주소때려박고 엔터 치기 = 서버에 get요청(읽기요청)하기

// 누군가가 /pet으로 방문을 하면..
// pet관련된 안내문을 띄워주자

app.get("/pet", function (req, res) {
  res.send("펫용품 쇼핑할 수 있는 사이트입니다.");
});

app.get("/beauty", function (req, res) {
  res.send("뷰티 용품을 쇼핑할 수 있는 사이트입니다.");
});

//서버 : 누군가 ~~주소로 들어오면 ~~를 보내주세요~라고 코드 짠거임 걍ㅞ
// install -g nodemno : 이폴더안에서만 노드몬 슬거아니고
// 다른 모든 폴더에서도 그니까 내 컴퓨터의 모든폴더파일에서 노드몬 쓸거예요라는 뜻
// nodemon깔고나서, 터미널= nodemon server.js 입력해줌 -> 저장할때마다 서버 재실행

//이번에는 주소로 접속할때 html파일을 보내보자
app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
}); //경로에 '/'하나만 쓰면 홈페이지임 ㅅㅂ
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/add", function (요청, 응답) {
  응답.send("전송완료");
  db.collection("counter").findOne(
    { name: "게시물갯수" },
    function (에러, 결과) {
      console.log(결과.totalPost);
      var 총게시물갯수 = 결과.totalPost;
    }
  );
  db.collection("post").insertOne({
    _id: 총게시물갯수 + 1,
    제목: req.body.title,
  });
  console.log(req.body.date);
  console.log(req.body.title);

  db.collection("post").insertOne(
    { 제목: 요청.body.title, 날짜: 요청.body.date },
    function (err, res) {
      console.log("저장완료");
    }
  );
});

app.get("/list", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (err, result) {
      console.log(result);
      res.render(`list.ejs`, { posts: result });
    }); //데이터 다 꺼내주세요~
});

app.delete("/delete", function (요청, 응답) {
  console.log(요청.body);
  요청.body._id = parseInt(요청.body._id); //문자열로 전달된거를 다시 숫자로
  db.collection("post").deleteOne(요청.body, function (에러, 결과) {
    console.log("삭제완료");
  });
});
