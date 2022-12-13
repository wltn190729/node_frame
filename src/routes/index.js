// 라우터 객체 생성
const router = require("express").Router();
const homeController = require("../controllers/home");

router.get("/", homeController.home);
router.use('/board', require('./boardRoutes.js'));
router.use('/authorize', require('./authorizeRoutes.js'));


// 객체 Export
module.exports = router;
