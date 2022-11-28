/** 서버 실행할 포트 설정 **/
const port = 3000;

/** 필요한 의존성 모듈 로드 **/
const express = require("express"),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    routes = require("./routes"),
    fileUpload = require("express-fileupload");

/** Helper Load **/
require("../Helpers/DateFormat.helper");

/** 메인 객체 생성 **/
const app = express();

/** CORS 처리 **/
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/** Rest API 사용을 위한 설정  **/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    uriDecodeFileNames: true,
  })
);


/** 라우터 설정 불러오기 **/
app.use(routes)


/** 서버 실행
 * nodemon을 통해서 npm run server 입력 시 서버 실행됨.**/
app.listen(port, () => {
  console.log(`서버가 작동되었습니다 : PORT ${port}`);
});
